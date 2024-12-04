// layout.tsx
import './global.css';
import { Header, Navigation } from './components/header';
import type { ReactNode } from 'react';

// Use TypeScript interface for props
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
        <div className="flex min-h-screen flex-col">
          <Header cartCount={2} />
          <Navigation />
          <main className="container mx-auto flex-grow px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
