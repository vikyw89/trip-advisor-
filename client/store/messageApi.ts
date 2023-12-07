import { supabase } from '@/libs/supabase';
import { emptySplitApi } from './emptySplitApi';
import { SERVER_BASE_URL, serverApi } from '@/libs/server';
import { jsonStreamIterator } from '@/libs/streamAsyncIterator';
import { z } from 'zod';
import { v4 } from 'uuid';

let isStreamingMessage = false;

const messageApi = emptySplitApi.injectEndpoints({
	// @ts-ignore
	overrideExisting: module.hot?.status() === 'apply',
	endpoints: (builder) => ({
		sendMessage: builder.mutation<
			any,
			{ text: string; file?: File; tripId: string }
		>({
			queryFn: async ({ text, file, tripId }) => {
				try {
					const session = await supabase.auth.getSession();

					if (!session.data.session?.user?.id) {
						throw new Error('Session expired');
					}

					// if there's a file
					let fileUrl;
					if (file) {
						const fileUploadRes = await supabase.storage
							.from('files')
							.upload(
								`${
									session.data.session?.user?.id
								}/${tripId}/${Date.now().toString()}`,
								file
							);
						fileUrl = supabase.storage
							.from('files')
							.getPublicUrl(
								`${
									session.data.session?.user?.id
								}/${tripId}/${Date.now().toString()}`
							).data.publicUrl;
					}

					const res = await serverApi.POST(
						'/users/{user_id}/trips/{trip_id}/messages',
						{
							params: {
								path: {
									user_id: session.data.session?.user?.id,
									trip_id: tripId,
								},
							},
							body: {
								text: text,
								file_url: fileUrl,
							},
						}
					);

					if (res.error) {
						throw new Error(
							res.error.detail?.[0].msg || 'Failed to send message'
						);
					}
					return { data: res.data };
				} catch (error) {
					return {
						error,
					};
				}
			},
			// onQueryStarted: async (patch, { dispatch, queryFulfilled }) => {
			// 	const patchResult = dispatch(
			// 		messageApi.util.updateQueryData(
			// 			'readMessages',
			// 			{ order: 'asc', limit: 20, tripId: patch.tripId },
			// 			(draft) => {
			// 				draft.push({
			// 					id: v4(),
			// 					text: patch.text,
			// 					isUser: true,
			// 					isLoading: false,
			// 				});
			// 			}
			// 		)
			// 	);
			// 	try {
			// 		await queryFulfilled;
			// 	} catch {
			// 		patchResult.undo();

			// 		/**
			// 		 * Alternatively, on failure you can invalidate the corresponding cache tags
			// 		 * to trigger a re-fetch:
			// 		 * dispatch(api.util.invalidateTags(['Post']))
			// 		 */
			// 	}
			// },
			// invalidatesTags:["message"]
		}),
		readMessages: builder.query<
			Array<{
				id: string;
				text: string;
				isUser: boolean;
				isLoading: boolean;
			}>,
			{
				limit?: number;
				after?: string;
				before?: string;
				order?: 'asc' | 'desc';
				tripId: string;
			}
		>({
			queryFn: async ({ limit, after, before, order, tripId }) => {
				try {
					const session = await supabase.auth.getSession();

					if (!session.data.session?.user?.id) {
						throw new Error('Session expired');
					}

					const res = await serverApi.GET(
						'/users/{user_id}/trips/{trip_id}/messages',
						{
							params: {
								path: {
									user_id: session.data.session?.user?.id,
									trip_id: tripId,
								},
								query: {
									limit: limit,
									after: after,
									before: before,
									order: order,
								},
							},
						}
					);
					const data = res.data?.messages.map((v) => {
						return {
							id: v.id,
							text: v.text,
							isUser: v.is_user,
							isLoading: false,
						};
					});
					return { data: data ?? [] };
				} catch (error) {
					return { error };
				}
			},
			providesTags: ['message'],
			onCacheEntryAdded: async (
				args,
				{ cacheDataLoaded, cacheEntryRemoved, updateCachedData }
			) => {
				try {
					if (isStreamingMessage) return;

					await cacheDataLoaded;
					isStreamingMessage = true;
					const session = await supabase.auth.getSession();

					if (!session.data.session?.user?.id) {
						throw new Error('Session expired');
					}

					const res = await serverApi.GET(
						'/users/{user_id}/trips/{trip_id}/messages/subscribe',
						{
							params: {
								path: {
									user_id: session.data.session?.user?.id,
									trip_id: args.tripId,
								},
							},
							parseAs: 'stream',
						}
					);
					// const res = await fetch(`${SERVER_BASE_URL}/users/${session.data.session?.user?.id}/messages/subscribe`)
					const stream = res.response.body;

					if (!stream) {
						throw new Error('Stream not found');
					}
					console.log(
						'🚀 ~ file: messageApi.ts:113 ~ isStreamingMessage:',
						isStreamingMessage
					);

					const MessageEventSchema = z.object({
						event: z
							.literal('create')
							.or(z.literal('update'))
							.or(z.literal('delete')),
						message: z.object({
							id: z.string(),
							text: z.string(),
							is_user: z.boolean(),
						}),
					});
					type MessageEvent = z.infer<typeof MessageEventSchema>;

					for await (const message of jsonStreamIterator(stream)) {
						const parsedMessage: MessageEvent = JSON.parse(message);
						console.log(
							'🚀 ~ file: messageApi.ts:154 ~ forawait ~ parsedMessage:',
							parsedMessage
						);

						const event = parsedMessage.event;
						const messageContent = parsedMessage.message;

						switch (event) {
							case 'create': {
								updateCachedData((draft) => {
									draft.push({
										id: messageContent.id,
										text: messageContent.text,
										isLoading: false,
										isUser: messageContent.is_user,
									});
								});
								break;
							}
							case 'update': {
								updateCachedData((draft) => {
									for (let i = 0; i < draft.length; i++) {
										if (draft[i].id === messageContent.id) {
											draft[i] = {
												id: messageContent.id,
												text: messageContent.text,
												isLoading: false,
												isUser: messageContent.is_user,
											};
											break;
										}
									}
								});
								break;
							}
							case 'delete': {
								updateCachedData((draft) => {
									draft = draft.filter((v) => v.id !== 'streaming');
									return draft;
								});
								break;
							}
						}
					}
				} finally {
					await cacheEntryRemoved;
					isStreamingMessage = false;
				}
			},
		}),
	}),
});

export const { useSendMessageMutation, useReadMessagesQuery } = messageApi;
