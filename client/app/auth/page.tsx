'use client';
import { supabase } from '@/libs/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Page() {
	return (
		<div className='h-full w-full flex justify-center items-center'>
			<div className='max-w-md rounded-box p-10 w-full bg-base-100 text-base-content shadow-sm'>
				<Auth
					supabaseClient={supabase}
					appearance={{ theme: ThemeSupa }}
					theme='default'
					providers={['google']}
				/>
			</div>
		</div>
	);
}
