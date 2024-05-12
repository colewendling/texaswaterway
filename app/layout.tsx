import type { Metadata } from 'next';
import localFont from 'next/font/local';
import 'easymde/dist/easymde.min.css';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

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
  description: 'Lake Data Application',
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
        <Toaster />
      </body>
    </html>
  );
}
