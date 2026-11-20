import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroPulse — AI Urban Air Quality & Winter Smog Advisor',
  description:
    'Real time atmospheric telemetry and Google Gemini 3 air quality guidance for families. Calculate inhaled PM2.5 dose reductions, DIY clean air hacks, and low emission routines.',
  keywords: [
    'winter smog advisor',
    'air quality index',
    'thermal inversion',
    'PM2.5 inhaled dose calculator',
    'DIY Corsi Rosenthal box',
    'WHO air quality guidelines',
    'Gemini urban air advisor',
  ],
  authors: [{ name: 'AeroPulse Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'AeroPulse — AI Urban Air Quality & Winter Smog Advisor',
    description:
      'Safeguard your family from toxic winter smog and atmospheric inversions with Google Gemini 3 and deterministic inhalation models.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AeroPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AeroPulse — AI Urban Air Quality & Winter Smog Advisor',
    description:
      'Real time atmospheric telemetry and Google Gemini 3 guidance tailored for infants, seniors, and vulnerable households.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍃</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  name: 'AeroPulse Urban Air Quality Advisor',
                  applicationCategory: 'HealthApplication',
                  operatingSystem: 'All',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  description:
                    'Agentic GenAI urban air quality advisor providing deterministic PM2.5 dose reduction metrics and low emission daily routines.',
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is a thermal inversion and why does it make winter smog dangerous?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'A thermal inversion occurs when a layer of warm air aloft traps cooler, polluted air close to the ground like a lid. During calm winter nights, pollutants cannot rise or disperse.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Can a DIY Corsi Rosenthal box match commercial HEPA purifiers?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. Multiple peer reviewed engineering studies show that a 20 inch box fan equipped with four MERV 13 pleated filters delivers clean air delivery rates exceeding 320 CFM at one fifth the cost.',
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-base text-white antialiased selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
