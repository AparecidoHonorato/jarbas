import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JARBAS - AI Assistant',
  description: 'Your intelligent AI assistant powered by multiple AI providers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-jarbas-darker text-white font-sans antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
