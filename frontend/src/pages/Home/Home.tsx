import { useEffect, useRef } from "react";
import { useTranslation } from "@/localization";

import "./Home.css";

import Event from "../../components/Event/Event";
import Review from "../../components/Review/Review";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import Slide from "../../components/Slide/Slide";
import { marinaShowcaseImages } from "../../data/marinaImages";

const EVENT_BANNER_IMAGE = marinaShowcaseImages.banner;

const Home: React.FC = () => {
  const { t } = useTranslation("home");
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (section): section is HTMLDivElement => section !== null
    );

    if (sections.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (index: number) => (element: HTMLDivElement | null) => {
    sectionRefs.current[index] = element;
  };

  return (
    <div className="main-home">
      <Slide />

      <div ref={setSectionRef(0)} className="home-reveal-section">
        <Event />
      </div>

      <div ref={setSectionRef(1)} className="home-reveal-section home-banner-reveal">
        <div className="event-banner">
          <div className="event-banner-container">
            <img
              src={EVENT_BANNER_IMAGE}
              alt="Anstay Marina Hotel Ha Long"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <div className="event-banner-overlay">
              <h2 className="event-banner-title">Marina</h2>
              <h6 className="event-banner-subtitle">
                {t(
                  "home.img.subtitle",
                  "SẠCH ĐẸP, GIÁ HỢP LÝ, THUẬN TIỆN KHÁM PHÁ HẠ LONG"
                )}
              </h6>
              <p className="event-banner-description">
                {t(
                  "home.img.description",
                  "Anstay Marina Hotel Ha Long phù hợp cho cặp đôi, gia đình và nhóm bạn cần một nơi ở mới, dễ di chuyển, có bể bơi tầng thượng, tiện ích đầy đủ và đội ngũ hỗ trợ lưu trú rõ ràng từ Anstay."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={setSectionRef(2)} className="home-reveal-section">
        <Review />
      </div>

      <ScrollToTopButton showAt={1000} />
    </div>
  );
};

export default Home;
