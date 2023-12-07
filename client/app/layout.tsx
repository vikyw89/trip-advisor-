import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Daejeon GPT',
	description: 'Your travel partner',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body
				className={`${inter.className} fixed inset-0 bg-base-100 text-base-content`}
        data-theme="cupcake"
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
