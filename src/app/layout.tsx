import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'El Profesor Python y El Misterio de la Alcantarilla',
  description: 'Aventura gráfica interactiva de misterio y deducción estilo Profesor Layton por Pablo Jiménez Jorquera y Ayoub Atidi Belbaz.',
  icons: {
    icon: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Profesor Python',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#160d09',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-[#0d0806] text-[#f7eedb] min-h-screen antialiased selection:bg-amber-600/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}

