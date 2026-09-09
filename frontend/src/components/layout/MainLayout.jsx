import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children, noFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
