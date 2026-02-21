import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Banner from "@/components/banner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
