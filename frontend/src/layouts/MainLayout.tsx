import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import FloattingContactBt from "../components/FloatingContactBt/FloattingContactBt";
import "./MainLayout.css";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean; // Ẩn header chung
  hideFooter?: boolean; // Thêm prop này
  hideFloattingContactBt?: boolean; // Thêm prop này
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideHeader = false, hideFooter = false, hideFloattingContactBt = false }) => {
  return (
    <div className="layout">
      {!hideHeader && <Header />}
      <main className="main-content">{children}</main>
      {!hideFooter && <Footer />} {/* Chỉ hiện Footer khi hideFooter = false */}
      {!hideFloattingContactBt && <FloattingContactBt />}
    </div>
  );
};

export default MainLayout;