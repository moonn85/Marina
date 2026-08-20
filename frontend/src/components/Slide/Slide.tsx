import React, { useEffect, useState } from "react";
import { useTranslation } from "@/localization";
import {
  FaBed,
  FaHeadset,
  FaLocationArrow,
  FaUsers,
} from "react-icons/fa";
import "./Slide.css";
import FloatingBanner from "../FloatingBanner/FloatingBanner";
import FloatingContactBt from "../FloatingContactBt/FloattingContactBt";
import BoxSearch from "../BoxSearch/BoxSearch";

const PROMO_BANNER_IMAGE =
  "https://res.cloudinary.com/drpqrn5jz/image/upload/w_520,h_260,c_fill,f_auto,q_auto:eco/v1778743832/09001jtx-14a3-1200x630_xgsnnf.jpg";
const HERO_IMAGE = "/pictures/marina-hero-entrance.jpg";

const useCountUp = (targetValue: string, durationMs = 1600) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const numericValue = Number.parseInt(targetValue.replace(/\D/g, ""), 10);
    const shouldAnimate = numericValue === 100 || numericValue === 10000;

    if (!Number.isFinite(numericValue) || numericValue <= 0 || !shouldAnimate) {
      setDisplayValue(targetValue);
      return;
    }

    const suffix = targetValue.replace(/[0-9.,]/g, "");
    const startTime = performance.now();
    let frameId = 0;

    const updateValue = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(numericValue * easedProgress);

      setDisplayValue(`${currentValue.toLocaleString("vi-VN")}${suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateValue);
      }
    };

    frameId = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(frameId);
  }, [durationMs, targetValue]);

  return displayValue;
};

const StatValue = ({ value }: { value: string }) => {
  const animatedValue = useCountUp(value);
  const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10);
  const shouldShowPlus = numericValue === 100 || numericValue === 10000;

  return <strong>{shouldShowPlus ? `${animatedValue}+` : animatedValue}</strong>;
};

const Slide = () => {
  const { t } = useTranslation("home");
  const [showContactBt, setShowContactBt] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  const handleBannerClose = () => {
    setShowContactBt(true);
  };

  const stats = [
    {
      icon: <FaBed />,
      value: "100",
      label: t("home.stats.rooms", "Phòng & Căn hộ"),
    },
    {
      icon: <FaUsers />,
      value: "10.000",
      label: t("home.stats.guests", "Lượt khách lưu trú"),
    },
    {
      icon: <FaHeadset />,
      value: "24/7",
      label: t("home.stats.support", "Hỗ trợ khách hàng"),
    },
    {
      icon: <FaLocationArrow />,
      value: "50m",
      label: t("home.stats.distance", "Cách biển"),
    },
  ];

  useEffect(() => {
    const showBanner = () => setShowPromoBanner(true);
    const browserWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const scheduleBanner = () => {
      if (browserWindow.requestIdleCallback) {
        idleId = browserWindow.requestIdleCallback(showBanner, {
          timeout: 4500,
        });
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
      if (idleId && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <section className="hero-shell">
      <div className="slider-container">
        <div className="slider-image">
          <img
            className="slider-poster"
            src={HERO_IMAGE}
            alt=""
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
          />
          <div className="slider-overlay-block"></div>
        </div>

        <div className="slider-dark-overlay">
          <div className="slider-overlay">
            <p className="slider-subtitle">
              {t("home.hero.title", "Anstay Marina Hotel Ha Long")}
            </p>
            <h1 className="slider-title">
              <span className="slider-title-line">
                {t("home.hero.propertyType", "Kỳ nghỉ mới tại Bãi Cháy")}
              </span>
              <span className="slider-title-line">
                {t("home.hero.management", "Hạ Long do Anstay vận hành")}
              </span>
            </h1>
            <p className="slider-description">
              {t(
                "home.hero.description",
                "Khách sạn khai trương năm 2026 tại Halong Marina, gần bãi biển công cộng, quảng trường Marina và các điểm vui chơi nổi bật của Hạ Long.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="hero-below">
        <div className="hero-search-wrap">
          <BoxSearch />
        </div>

        <div className="hero-stats">
          {stats.map((item) => (
            <div className="hero-stat" key={item.label}>
              <div className="hero-stat-copy">
                <StatValue value={item.value} />
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {showPromoBanner && (
        <FloatingBanner
          imageUrl={PROMO_BANNER_IMAGE}
          title="Mẹ và bé - Ưu đãi đặc biệt"
          description="Combo Gia Đình-Giảm đến 50% "
          buttonText="Tìm hiểu thêm"
          buttonLink="/mevabe"
          onClose={handleBannerClose}
        />
      )} */}

      {showContactBt && <FloatingContactBt />}
    </section>
  );
};

export default Slide;
