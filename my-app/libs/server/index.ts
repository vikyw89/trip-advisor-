import createClient from 'openapi-fetch';
import { paths } from '@/types/server';

export const SERVER_BASE_URL = process.env['NEXT_PUBLIC_SERVER_BASE_URL'];
if (!SERVER_BASE_URL) {
	throw new Error('NEXT_PUBLIC_SERVER_BASE_URL is not set');
}

export const serverApi = createClient<paths>({ baseUrl: SERVER_BASE_URL });
