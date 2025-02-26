"use client";

import "./global.css";
import { Header, Navigation } from "./components/header";
import { SearchProvider } from "./components/search";
import type { ReactNode } from "react";
import Logo from "../public/ico.png";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Moyens Logistiques Non Motorisés</title>
        <link rel="icon" type="image/svg+xml" href={Logo.src} />
      </head>
      <body>
        <SearchProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
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
