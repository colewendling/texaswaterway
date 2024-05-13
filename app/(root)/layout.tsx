import SessionProvider from '../SessionProvider';
import Navbar from '../../components/Navbar';
import Footer from '@/components/Footer';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-inter">
      <SessionProvider>
        <Navbar />
        {children}
        <Footer />
      </SessionProvider>
    </main>
  );
}
