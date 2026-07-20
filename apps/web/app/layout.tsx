import React from 'react';
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

export const metadata = {
  title: 'EventBytes',
  description: 'Discover and host incredible local events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/" dynamic>
      <html lang="en" style={{ margin: 0, padding: 0 }}>
        <body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
