import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import { LanguageProvider } from "@/components/language-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
