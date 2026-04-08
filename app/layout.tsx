import Layout from './components/Layout';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-app-bg text-app-text min-h-screen">
        <Layout>{children}</Layout>
        </body>
    </html>
  );
}