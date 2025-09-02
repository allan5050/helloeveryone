import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Hello Everyone - Connect Through Shared Interests',
    template: '%s | Hello Everyone'
  },
  description: 'Discover meaningful connections through shared interests and local events. Join communities, attend meetups, and build lasting friendships.',
  keywords: ['social networking', 'events', 'meetups', 'communities', 'interests', 'friends'],
  authors: [{ name: 'Hello Everyone Team' }],
  creator: 'Hello Everyone',
  publisher: 'Hello Everyone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Hello Everyone',
    title: 'Hello Everyone - Connect Through Shared Interests',
    description: 'Discover meaningful connections through shared interests and local events.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hello Everyone - Connect Through Shared Interests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@helloeveryone',
    creator: '@helloeveryone',
    title: 'Hello Everyone - Connect Through Shared Interests',
    description: 'Discover meaningful connections through shared interests and local events.',
    images: ['/og-image.png'],
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hello Everyone',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`font-sans antialiased min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <div id="root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
