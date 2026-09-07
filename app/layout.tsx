import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://thesamarthjagtap.com'),
  title: 'Samarth Jagtap | Software Engineer, Solutions Builder',
  description: 'Samarth Jagtap is a software engineering senior at UT Arlington building cloud applications, AI tools, event platforms, and creative technology.',
  keywords: ['Samarth Jagtap', 'software engineer', 'solutions engineer', 'forward deployed engineer', 'UT Arlington', 'cloud engineering', 'AI tools', 'full stack developer'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://thesamarthjagtap.com',
    title: 'Samarth Jagtap | Software Engineer, Solutions Builder',
    description: 'Cloud applications, AI tools, event platforms, and creative technology by Samarth Jagtap.',
    siteName: 'Samarth Jagtap',
  },
  twitter: {
    card: 'summary',
    title: 'Samarth Jagtap | Software Engineer, Solutions Builder',
    description: 'Cloud applications, AI tools, event platforms, and creative technology by Samarth Jagtap.',
  },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
