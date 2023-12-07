import { supabase } from '../libs/supabase';
import { emptySplitApi } from './emptySplitApi';
import { Session } from '@supabase/supabase-js';

export const authApi = emptySplitApi.injectEndpoints({
	// @ts-ignore
	overrideExisting: module.hot?.status() === 'apply',
	endpoints: (builder) => ({
		signOut: builder.mutation<any, any>({
			queryFn: async () => {
				try {
					const { error } = await supabase.auth.signOut();
					if (error) {
						throw new Error('Failed to sign out');
					}
					return { data: null };
				} catch (error) {
					return {
						error,
					};
				}
			},
		}),
		readSession: builder.query<Session | null, any>({
			queryFn: async () => {
				try {
					const { error, data } = await supabase.auth.refreshSession();
					if (error) {
						throw new Error('Session expired');
					}
					const auth = await supabase.auth.startAutoRefresh();

					return {
						data: data?.session,
					};
				} catch (error) {
					return {
						error,
					};
				}
			},
		}),
	}),
});

export const { useSignOutMutation, useReadSessionQuery } = authApi;
