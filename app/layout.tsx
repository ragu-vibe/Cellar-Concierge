import './globals.css';
import type { Metadata } from 'next';
import { TopBar } from '@/components/shared/TopBar';

export const metadata: Metadata = {
  title: 'Cellar Concierge',
  description: 'Premium wine planning with Account Manager curation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <TopBar />
          <main className="container py-10 animate-fadeIn">{children}</main>
          <footer className="border-t border-border bg-surface/80 py-6">
            <div className="container text-xs text-muted">
              You must be 18+ (UK) to purchase alcohol. Indicative valuations only. Not investment advice.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
