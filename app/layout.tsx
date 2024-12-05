'use client';

import './global.css';
import { Header, Navigation } from './components/header';
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
} | null>(null);

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [searchQuery, setSearchQuery] = useState<string>(''); // État global pour la recherche

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
          <div className="flex min-h-screen flex-col">
            <Header cartCount={2} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Navigation />
            <main className="container mx-auto flex-grow px-4 py-6">
              {children}
            </main>
          </div>
        </SearchContext.Provider>
      </body>
    </html>
  );
}
