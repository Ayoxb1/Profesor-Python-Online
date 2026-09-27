import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'El Profesor Python y El Misterio de la Alcantarilla',
  description: 'Aventura gráfica interactiva creada por Pablo Jiménez Jorquera y Ayoub Atidi Belbaz.',
  icons: {
    icon: '/images/inicio_general/PORTADA IMAGEN BUENA.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
