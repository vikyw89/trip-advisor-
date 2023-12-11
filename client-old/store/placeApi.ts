import { supabase } from '@/libs/supabase';
import { emptySplitApi } from './emptySplitApi';
import { serverApi } from '@/libs/server';
import { paths } from '@/types/server';

type ReadLocationFromTextResponse =
	paths['/locations/{location_name}']['get']['responses']['200']['content']['application/json'];

type ReadPhotoResponse = paths['/photos/retrieve_url']['post']['responses']['200']['content']['application/json'];

export const placeApi = emptySplitApi.injectEndpoints({
	endpoints: (builder) => ({
		readLocationFromText: builder.query<
			ReadLocationFromTextResponse,
			{ locationName: string }
		>({
			queryFn: async ({ locationName }) => {
				try {
					const session = await supabase.auth.getSession();

					if (session.error) {
						throw new Error('Session expired');
					}

					const res = await serverApi.GET('/locations/{location_name}', {
						params: {
							path: {
								location_name: locationName,
							},
						},
					});

					if (res.error) {
						throw new Error('Failed to retrieve location');
					}

					return { data: res.data };
				} catch (error) {
					return { error };
				}
			},
		}),
		readPhotoUrl: builder.query<
			ReadPhotoResponse,
			{ photo_name: string }
		>({
			queryFn: async ({ photo_name }) => {
				try {
					const session = await supabase.auth.getSession();

					if (session.error) {
						throw new Error('Session expired');
					}

					const res = await serverApi.POST('/photos/retrieve_url', {
						body: {
							photo_name: photo_name,
						},
					});

					return { data: res.data };
				} catch (error) {
					return { error };
				}
			},
		}),
	}),
});

export const { useReadLocationFromTextQuery,useReadPhotoUrlQuery } = placeApi;
