import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { useTranslation } from "@/localization";

const Footer: React.FC = () => {
  const { t } = useTranslation(["footer", "about", "policy"]);
  return (
    <div className="footer-wrapper">
      <div className="footer-main">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <img
                src="/pictures/LogoAnstay.webp"
                alt="ANSTAY Logo"
                className="logo-image"
              />
            </div>
          </div>

          {/* All Content Below Logo */}
          <div className="footer-content-below">
            {/* Left Side - 3 Columns */}
            <div className="footer-left-columns">
              {/* First Column */}
              <div className="footer-column">
                <h3>{t('footer.header.title1')}</h3>
                <ul>
                  <li className="address-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>{t('footer.title1.child1', 'Địa chỉ: Khu đô thị dịch vụ Hùng Thắng, P. Hùng Thắng, Hạ Long, Quảng Ninh, Việt Nam')}</span>
                  </li>
                  <li>
                    <i className="bi bi-telephone-fill"></i>
                    <span>{t('footer.title1.child2', 'Điện thoại: 0384945614')}</span>
                  </li>
                  <li>
                    <i className="bi bi-envelope-fill"></i>
                    <span>{t('footer.title1.child3', 'Email: anstayresidence@gmail.com')}</span>
                  </li>
                </ul>
                <h3>{t('footer.header.title2')}</h3>
                <ul>
                  <li><Link to="/about-us">{t('footer.title2.child1', 'Về Chúng Tôi')}</Link></li>
                  <li><Link to="/contact">{t('about:about.button.title2', 'Liên hệ tư vấn')}</Link></li>
                  {/* <li><Link to="/support">{t('footer.title2.child2', 'Sách Hướng Dẫn')}</Link></li> */}
                </ul>
              </div>

              {/* Second Column */}
              <div className="footer-column">

              </div>

              {/* Third Column - Social Media */}
              <div className="footer-column" style={{ width: 'px' }}>
                <h3>{t('footer.header.title3')}</h3>
                <ul>
                  <li><Link to="/chinh-sach-bao-mat">{t('footer.title3.child1', 'Chính Sách Quyền Riêng Tư')}</Link></li>
                  <li><Link to="/chuong-trinh-hop-tac">{t('footer.title3.child2', 'Đối Tác Chiến Lược Cùng Anstay')}</Link></li>
                  <li><Link to="/policy">{t('policy:policy.header.title', 'Chính Sách Lưu Trú')}</Link></li>
                </ul>
                <h3>{t('footer.header.title4')}</h3>
                <div className="social-icons">
                  <a href="https://www.facebook.com/Anstayalacarte" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1763449848/Facebook-Logo-2019_eaumnl.png"
                      alt="facebook"
                      className="icon-fl"
                    />
                    Facebook
                  </a>
                  <a href="https://zalo.me/303298464254784727" target="_blank" rel="noopener noreferrer">
                    <img
                      src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1774854468/zalo-icon-4635_bcur1v.png"
                      alt="zalo"
                      className="icon-fl"
                    />
                    Zalo
                  </a>

                  <a href="https://www.youtube.com/@AnstayResidencebyALaCarte" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/pictures/youtube.webp"
                      alt="youtube"
                      className="icon-fl"
                    />
                    Youtube
                  </a>
                  <a href="https://www.instagram.com/alacarte_by_anstay/" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/pictures/instagram.webp"
                      alt="instagram"
                      className="icon-fl"
                    />
                    Instagram
                  </a>
                  <a href="https://www.tiktok.com/@alacarte_by_anstay" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/pictures/tiktok.png"
                      alt="tiktok"
                      className="icon-fl"
                    />
                    TikTok
                  </a>
                  <a
                    href="https://www.tripadvisor.com.vn/Hotel_Review-g14776299-d27574934-Reviews-A_La_Carte_Halong_Bay_Managed_By_Anstay-Ha_Long_City_H_Long_Bay_Quang_Ninh_Province.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logomark.svg"
                      alt="Tripadvisor"
                      className="icon-fl"
                    />
                    Tripadvisor
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="footer-right-section">
              <div className="footer-column">
                <h3>{t('footer.header.title5')}</h3>
                <div className="footer-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.9507648614167!2d107.00194373598717!3d20.954492274147686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5f8118acfff7%3A0x5cda7725e937f7!2sAnstay%20Marina%20Hotel%20Ha%20Long!5e0!3m2!1svi!2s!4v1784101464815!5m2!1svi!2s"
                    width="300"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Hotel Location Map"
                  ></iframe>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            ANSTAY VIETNAM JOINT STOCK COMPANY
          </div>
          <div className="footer-links">
            Copyright 2025 © <span style={{ fontWeight: 600 }}>Anstay VN</span> All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
