import type { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ToastContainer from "../../ui/Toast/ToastContainer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <ToastContainer />
    </>
  );
}
