import type { Metadata } from 'next';
import localFont from 'next/font/local';
import 'easymde/dist/easymde.min.css';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = localFont({
  src: [
    { path: './fonts/Inter.ttf', weight: '100 900' }, // Thin to Black
    {
      path: './fonts/Inter-Italic.ttf',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Texas Waterway',
  description:
    'Comprehensive dashboard app offering lake data, levels, and weather insights for Texas lakes.',
  authors: [{ name: 'Cole Wendling' }],
  openGraph: {
    title: 'Texas Waterway',
    description:
      'Comprehensive dashboard app offering lake data, levels, and weather insights for Texas lakes.',
    url: 'https://www.texaswaterway.com',
    images: [
      {
        url: '/meta/social-share.png',
        width: 1200,
        height: 630,
        alt: 'Texas Waterway - Comprehensive Lake Data',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Texas Waterway',
    description:
      'Comprehensive dashboard app offering lake data, levels, and weather insights for Texas lakes.',
    images: ['/meta/social-share.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {children}
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
