'use client';

import './global.css';
import { Header, Navigation } from './components/header';
import { SearchProvider } from './components/search';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SearchProvider>
          <div className="flex min-h-screen flex-col">
            <Header cartCount={2} />
            <Navigation />
            <main className="container mx-auto flex-grow px-4 py-6">
              {children}
            </main>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
