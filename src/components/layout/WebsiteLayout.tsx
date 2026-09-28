import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

const WebsiteLayout = ({ children }: Props) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard/");

  return (
    <>
      <Header />

      <main>{children}</main>

      {!isDashboard && <Footer />}
    </>
  );
};

export default WebsiteLayout;