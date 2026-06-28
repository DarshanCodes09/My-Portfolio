import { CommandPaletteProvider } from '@/components/command-palette';
import CommandPaletteRoot from '@/components/command-palette/CommandPaletteRoot';
import ConditionalFooter from '@/components/common/ConditionalFooter';
import Navbar from '@/components/common/Navbar';
import { ThemeProvider } from '@/components/common/ThemeProviders';
import {
  generateMetadata as getMetadata,
  getStructuredData,
} from '@/config/Meta';
import { siteConfig } from '@/config/Site';
import ReactLenis from 'lenis/react';
import { ViewTransitions } from 'next-view-transitions';
import Script from 'next/script';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata = {
  ...getMetadata('/'),
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: siteConfig.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = getStructuredData();
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const enableUmami =
    process.env.NODE_ENV === 'production' && umamiSrc && umamiWebsiteId;

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body className="bg-background font-hanken-grotesk antialiased">
          {enableUmami && (
            <Script
              src={umamiSrc}
              data-website-id={umamiWebsiteId}
              strategy="afterInteractive"
            />
          )}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CommandPaletteProvider>
              <ReactLenis root>
                <Navbar />
                {children}
                <ConditionalFooter />
                <CommandPaletteRoot />
                <Toaster richColors position="bottom-right" />
              </ReactLenis>
            </CommandPaletteProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
