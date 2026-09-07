import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: 'Samarth Jagtap — Software, systems & stories',
  description: 'Software engineer, creative builder, and lifelong learner. Explore Samarth Jagtap’s work in cloud systems, AI, and creative technology.',
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
