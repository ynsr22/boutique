'use client';

import './global.css';
import { Header, Navigation } from './components/header';
import { SearchProvider } from './components/search';
import type { ReactNode } from 'react';
import Head from 'next/head'; // Pour les métadonnées globales

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <Head>
        {/* Titre par défaut */}
        <title>Ma Boutique</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Bienvenue dans notre boutique en ligne." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="boutique, shopping, produits" />
      </Head>
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
