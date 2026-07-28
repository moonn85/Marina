import React, { useEffect, useState } from "react";
import { useTranslation } from "@/localization";
import "./Slide.css";
import FloatingBanner from "../FloatingBanner/FloatingBanner";
import FloatingContactBt from "../FloatingContactBt/FloattingContactBt";

const PROMO_BANNER_IMAGE =
  "https://res.cloudinary.com/drpqrn5jz/image/upload/w_520,h_260,c_fill,f_auto,q_auto:eco/v1778743832/09001jtx-14a3-1200x630_xgsnnf.jpg";

const HERO_VIDEO = "/videos/anstaylager-hero.mp4";
const HERO_POSTER = "/videos/anstaylager-poster.webp";

const Slide = () => {
  const { t } = useTranslation('home');
  const [showContactBt, setShowContactBt] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  // Defer loading the hero video until the page is idle so it never competes
  // with the LCP image for bandwidth. The poster image shows instantly.
  const [loadVideo, setLoadVideo] = useState(false);

  const handleBannerClose = () => {
    setShowContactBt(true);
  };

  useEffect(() => {
    const showBanner = () => setShowPromoBanner(true);
    const browserWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let videoTimeoutId: number | undefined;

    const scheduleBanner = () => {
      // Defer the hero video until the browser is idle AND the LCP window has passed,
      // so its (multi-MB) download never competes with the critical above-the-fold paint.
      const startVideo = () => {
        videoTimeoutId = browserWindow.setTimeout(() => setLoadVideo(true), 1200);
      };
      if (browserWindow.requestIdleCallback) {
        browserWindow.requestIdleCallback(startVideo, { timeout: 3000 });
      } else {
        startVideo();
      }
      if (browserWindow.requestIdleCallback) {
        idleId = browserWindow.requestIdleCallback(showBanner, { timeout: 4500 });
      } else {
        timeoutId = browserWindow.setTimeout(showBanner, 3500);
      }
    };

    if (document.readyState === "complete") {
      scheduleBanner();
    } else {
      window.addEventListener("load", scheduleBanner, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleBanner);
      if (timeoutId) browserWindow.clearTimeout(timeoutId);
      if (videoTimeoutId) browserWindow.clearTimeout(videoTimeoutId);
      if (idleId && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <div className="slider-container">
      <div className="slider-image">
        {/* <video
          src="/videos/anstaylager2.mp4?v=2"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          preload="metadata"
          disablePictureInPicture
          className="slider-video"
          style={{
            objectFit: 'cover',
            boxShadow: '0 80px 300px rgba(0, 0, 0, 0.9), inset 0 0 60px rgba(0, 0, 0, 0.3)'
          }}
        /> */}
        {/* Eager poster image = clean LCP element; painted instantly while the video defers */}
        <img
          className="slider-poster"
          src={HERO_POSTER}
          alt=""
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
        />
        {loadVideo && (
          <video
            className="slider-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            src={HERO_VIDEO}
          />
        )}
        {/* Block overlay to keep the hero non-interactive */}
        <div className="slider-overlay-block"></div>
      </div>

      <div className="slider-dark-overlay">
        <div className="slider-overlay">
          <p className="slider-subtitle">{t('home.hero.title', 'Chào Mừng Bạn Đến Với ANSTAY')}</p>
          <h1 className="slider-title">{t('home.hero.subtitle', 'Căn hộ tại À La Carte Hạ Long Bay được Anstay vận hành, hỗ trợ check-in, dọn phòng, tư vấn tour và chăm sóc khách trong suốt kỳ nghỉ.')}</h1>
          {/* <div className="slider-buttons">
            <button className="btn primary">Xem Căn Hộ →</button>
          </div> */}
        </div>

        {/* Thanh tìm kiếm được đặt ở giữa */}
        <div className="slider-search-container">
          <div className="search-title">
            <a href="/booking" className="btn-booking">
              {t('home.button', 'Kiểm tra phòng trống hôm nay')}
            </a>
          </div>
          {/* <BoxSearch /> */}
        </div>
      </div>

      {showPromoBanner && (
        <FloatingBanner
          imageUrl={PROMO_BANNER_IMAGE}
          title="Mẹ và bé - Ưu đãi đặc biệt"
          description="Combo Gia Đình-Giảm đến 50% "
          buttonText="Tìm hiểu thêm"
          buttonLink="/mevabe"
          onClose={handleBannerClose}
        />
      )}

      {showContactBt && <FloatingContactBt />}
    </div>
  );
};

export default Slide;
