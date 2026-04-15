import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: {
    template: '%s | Sprint Sync',
    default: 'Sprint Sync - Premium Project Management & Task Tracking',
  },
  description:
    "Boost your team's productivity with Sprint Sync. A modern, fast, and agile Kanban board for seamless project management and task tracking.",
  keywords: [
    'project management',
    'kanban board',
    'task tracking',
    'agile workflow',
    'sprint management',
    'productivity tool',
    'jira alternative',
  ],
  authors: [{ name: 'Sprint Sync Team' }],
  creator: 'Sprint Sync',
  publisher: 'Sprint Sync',
  metadataBase: new URL('https://sprintsync.com'), // Replace with actual production URL if available
  openGraph: {
    title: 'Sprint Sync - Premium Project Management',
    description:
      "Boost your team's productivity with Sprint Sync. A modern, fast, and agile Kanban board for seamless project management.",
    url: '/',
    siteName: 'Sprint Sync',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/icon/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Sprint Sync - Project Management Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprint Sync - Premium Project Management',
    description:
      "Boost your team's productivity with Sprint Sync. A modern, fast, and agile Kanban board for seamless project management.",
    images: ['/icon/logo.svg'],
    creator: '@sprintsync',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon/logo.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon/logo.svg'],
    apple: [
      { url: '/icon/logo.svg', type: 'image/svg+xml' }, // SVG can be used, though PNG is typical for apple, SVG is a good fallback
    ],
  },
  manifest: '/site.webmanifest', // Ensure to create this subsequently if a PWA is planned
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='font-sans antialiased'>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
