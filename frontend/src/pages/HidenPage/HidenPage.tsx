import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./HidenPage.css";
import HidenEn from "../../components/TestPage/English/HidenEn";
import HidenViet from "../../components/TestPage/Vietnam/Hiden";

const HidenPage = () => {
  const { apartment: apartmentParam } = useParams();
  const location = useLocation();
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const apartmentFromState = location.state?.apartment || "";
  const apartmentCode = (apartmentParam || apartmentFromState || "")
    .toString()
    .trim()
    .toUpperCase();
  const copyByLanguage = {
    vi: {
      checkInHub: "Trung tâm nhận phòng",
      apartment: "Căn hộ",
      subtitle:
        "Hướng dẫn nhận phòng, sử dụng tiện ích và thông tin lưu trú trong một trang duy nhất.",
      highlights: [
        { title: "Wi-Fi & Mã cửa", description: "Hiển thị theo căn hộ" },
        { title: "Video hướng dẫn", description: "Dễ thao tác, dễ theo dõi" },
        { title: "Hỗ trợ 24/7", description: "Liên hệ nhanh khi cần" },
      ],
      toolbarTitle: "Nội dung tiếng Việt",
      languageVi: "Tiếng Việt",
      languageEn: "Tiếng Anh",
    },
    en: {
      checkInHub: "Check-in Hub",
      apartment: "Apartment",
      subtitle:
        "Check-in guide, amenity instructions, and stay information in one place.",
      highlights: [
        { title: "Wi-Fi & Door Code", description: "Shown by apartment" },
        { title: "Video Instructions", description: "Easy to follow and use" },
        { title: "24/7 Support", description: "Quick help whenever needed" },
      ],
      toolbarTitle: "English Content",
      languageVi: "Vietnamese",
      languageEn: "English",
    },
  } as const;
  const copy = copyByLanguage[language];

  return (
    <div className="hiden-page">
      <div className="hiden-page__bg-shape hiden-page__bg-shape--one" />
      <div className="hiden-page__bg-shape hiden-page__bg-shape--two" />

      <header className="hiden-page__hero">
        <div className="hiden-page__hero-badges">
          <span className="hiden-page__pill">
            <i className="bi bi-house-door" />
            {copy.checkInHub}
          </span>
          {apartmentCode && (
            <span className="hiden-page__pill hiden-page__pill--soft">
              <i className="bi bi-key" />
              {copy.apartment} {apartmentCode}
            </span>
          )}
        </div>

        <h1 className="hiden-page__title">À La Carte Ha Long Bay</h1>
        <p className="hiden-page__subtitle">{copy.subtitle}</p>

        <div className="hiden-page__highlights">
          <div className="hiden-page__highlight">
            <i className="bi bi-wifi" />
            <div>
              <p>{copy.highlights[0].title}</p>
              <span>{copy.highlights[0].description}</span>
            </div>
          </div>
          <div className="hiden-page__highlight">
            <i className="bi bi-play-circle" />
            <div>
              <p>{copy.highlights[1].title}</p>
              <span>{copy.highlights[1].description}</span>
            </div>
          </div>
          <div className="hiden-page__highlight">
            <i className="bi bi-headset" />
            <div>
              <p>{copy.highlights[2].title}</p>
              <span>{copy.highlights[2].description}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="hiden-page__toolbar">
        <p className="hiden-page__toolbar-title">{copy.toolbarTitle}</p>
        <div className="hiden-page__language-switch" role="tablist">
          <button
            role="tab"
            aria-selected={language === "vi"}
            onClick={() => setLanguage("vi")}
            className={`hiden-page__lang-btn ${
              language === "vi" ? "is-active" : ""
            }`}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/vn.svg"
              width="20"
              height="20"
              alt="Vietnamese"
              loading="lazy"
            />
            <span>{copy.languageVi}</span>
          </button>
          <button
            role="tab"
            aria-selected={language === "en"}
            onClick={() => setLanguage("en")}
            className={`hiden-page__lang-btn ${
              language === "en" ? "is-active" : ""
            }`}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/gb.svg"
              width="20"
              height="20"
              alt="English"
              loading="lazy"
            />
            <span>{copy.languageEn}</span>
          </button>
        </div>
      </section>

      <main className="hiden-page__content">
        {language === "vi" ? <HidenViet /> : <HidenEn />}
      </main>
    </div>
  );
};

export default HidenPage;
