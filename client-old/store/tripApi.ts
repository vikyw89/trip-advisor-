import { supabase } from '@/libs/supabase';
import { emptySplitApi } from './emptySplitApi';
import { serverApi } from '@/libs/server';
import { paths } from '@/types/server';

type ReadTripsResponse =
	paths['/users/{user_id}/trips']['get']['responses'][200]['content']['application/json']['trips'];

const tripApi = emptySplitApi.injectEndpoints({
	endpoints: (builder) => ({
		createTrip: builder.mutation<{ tripId: string }, any>({
			queryFn: async () => {
				try {
					const session = await supabase.auth.getSession();

					if (session.error || !session.data.session?.user?.id) {
						throw new Error('Session expired');
					}

					const res = await serverApi.POST('/users/{user_id}/trips', {
						params: {
							path: {
								user_id: session.data.session?.user?.id,
							},
						},
					});

					if (res.error) {
						throw new Error('Failed to create trip');
					}

					return {
						data: {
							tripId: res.data.tripId,
						},
					};
				} catch (error) {
					return { error };
				}
			},
			invalidatesTags: ['trip'],
		}),
		readTrips: builder.query<ReadTripsResponse, { isUpcoming?: boolean }>({
			queryFn: async ({ isUpcoming }) => {
				try {
					const session = await supabase.auth.getSession();

					if (session.error || !session.data.session?.user.id) {
						throw new Error('Session expired');
					}

					const res = await serverApi.GET('/users/{user_id}/trips', {
						params: {
							path: {
								user_id: session.data.session?.user?.id,
							},
							query: {
								upcoming: isUpcoming,
							},
						},
					});

					if (res.error) {
						throw new Error('Failed to retrieve trips');
					}

					return {
						data: res.data.trips.reverse(),
					};
				} catch (error) {
					return { error };
				}
			},
			providesTags: ['trip'],
		}),
	}),
});

export const { useCreateTripMutation, useReadTripsQuery } = tripApi;
