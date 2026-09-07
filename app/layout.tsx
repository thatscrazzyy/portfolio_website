import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: 'Samarth Jagtap | Software engineering',
  description: 'Samarth Jagtap is a software engineering senior at UT Arlington. Explore his cloud applications, AI tools, work experience, and student leadership.',
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
