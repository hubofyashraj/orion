import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './auth/ds';

const inter = Inter({ subsets: ['latin'] })



const APP_NAME = "Orion";
const APP_DEFAULT_TITLE = "Orion";
const APP_TITLE_TEMPLATE = "%s - Orion";
const APP_DESCRIPTION = "Let's Connect";



export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  icons: ['./icon.png'],
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startupImage: ['./icon.png'],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      {/* <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' /> */}
      <AuthProvider>
        <body className={inter.className} >{children}</body>

      </AuthProvider>
    </html>
  )
}


export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
