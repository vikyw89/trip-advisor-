import { supabase } from '@/libs/supabase';
import { emptySplitApi } from './emptySplitApi';
import { serverApi } from '@/libs/server';

const itineraryApi = emptySplitApi.injectEndpoints({
	endpoints: (builder) => ({
		readItineraries: builder.query<
			{
				itineraries: Array<{ itineraryId: string; content: string }>;
				tripId: string;
			},
			{ tripId: string }
		>({
			queryFn: async ({ tripId }) => {
				try {
					const session = await supabase.auth.getSession();

					if (!session.data.session?.user.id) {
						throw new Error('Session expired');
					}

					const res = await serverApi.GET("/trips/{trip_id}/itineraries",{
						params:{
							path:{
								trip_id: tripId
							}
						}
					})

					if (res.error) {
						throw new Error('Failed to retrieve itinearies');
					}

					const parsedData = res.data?.itineraries.map((v) => {
						return {
							...v,
							itineraryId: v.itinerary_id,
						};
					});
					return {
						data: {
							itineraries: parsedData,
							tripId: res.data.trip_id,
						},
					};
				} catch (error) {
					return { error };
				}
			},
		}),
		readItinerary: builder.query<
			{ itineraryId: string; content: string },
			{ itineraryId: string }
		>({
			queryFn: async ({ itineraryId }) => {
				try {
					const res = await serverApi.GET('/itineraries/{itinerary_id}', {
						params: {
							path: {
								itinerary_id: itineraryId,
							},
						},
					});
					
					if (res.error) {
						throw new Error('Failed to retrieve itinerary');
					}

					return {
						data: {
							itineraryId: res.data.itinerary_id,
							content: res.data.content,
						},
					};
				} catch (error) {
					return { error };
				}
			},
		}),
	}),
});

export const { useReadItinerariesQuery, useReadItineraryQuery } = itineraryApi;
