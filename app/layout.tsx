import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { TopBar } from '@/components/shared/TopBar';
import { Footer } from '@/components/shared/Footer';
import { ClientProviders } from '@/components/ClientProviders';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Cellar Concierge | Berry Bros. & Rudd',
  description: 'Your personal wine curator. Building your cellar with intention, access, and expertise. Curated with your dedicated Account Manager.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ClientProviders>
          <TopBar />
          <main className="container py-8 flex-1 animate-fadeIn">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
