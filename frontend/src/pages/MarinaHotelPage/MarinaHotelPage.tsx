import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./MarinaHotelPage.css";
import MarinaHidenEn from "../../components/TestPage/English/MarinaHidenEn";
import MarinaHidenVi from "../../components/TestPage/Vietnam/MarinaHidenVi";

const SEO_TITLE = 'Anstay Marina Hotel Ha Long - Trang web chính thức';
const SEO_DESCRIPTION = 'Thông tin nhận phòng và lưu trú tại Anstay Marina Hotel Ha Long trên trang web chính thức của ANSTAY.';
const SEO_KEYWORDS = 'Anstay Marina Hotel Ha Long, trang web chính thức, nhận phòng marina hotel';
const SEO_URL = 'https://anstay.com.vn/marina-hotel';
const SEO_IMAGE = 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_75/v1763450336/halong-bay-tour_mpTU2_t0fcmv.jpg';

const MarinaHotelPage = () => {
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
            apartment: "Phòng",
            subtitle:
                "Hướng dẫn nhận phòng, sử dụng tiện ích và thông tin lưu trú trong một trang duy nhất.",
            highlights: [
                { title: "Wi-Fi & Mã cửa", description: "Hiển thị theo phòng" },
                { title: "Video hướng dẫn", description: "Dễ thao tác, dễ theo dõi" },
                { title: "Hỗ trợ 24/7", description: "Liên hệ nhanh khi cần" },
            ],
            toolbarTitle: "Nội dung tiếng Việt",
            languageVi: "Tiếng Việt",
            languageEn: "Tiếng Anh",
        },
        en: {
            checkInHub: "Check-in Hub",
            apartment: "Room",
            subtitle:
                "Check-in guide, amenity instructions, and stay information in one place.",
            highlights: [
                { title: "Wi-Fi & Door Code", description: "Shown by room" },
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
            <Helmet>
                <title>{SEO_TITLE}</title>
                <meta name="description" content={SEO_DESCRIPTION} />
                <meta name="keywords" content={SEO_KEYWORDS} />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <meta name="author" content="ANSTAY" />
                <meta name="geo.position" content="20.9590;107.0436" />
                <meta name="geo.region" content="VN-QN" />
                <meta name="geo.placename" content="Hạ Long, Quảng Ninh, Việt Nam" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:title" content={SEO_TITLE} />
                <meta property="og:description" content={SEO_DESCRIPTION} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SEO_URL} />
                <meta property="og:site_name" content="ANSTAY" />
                <meta property="og:image" content={SEO_IMAGE} />
                <meta property="og:image:alt" content="Anstay Marina Hotel Ha Long" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@AnstayVN" />
                <meta name="twitter:title" content={SEO_TITLE} />
                <meta name="twitter:description" content={SEO_DESCRIPTION} />
                <meta name="twitter:image" content={SEO_IMAGE} />
                <link rel="canonical" href={SEO_URL} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Hotel",
                        "name": SEO_TITLE,
                        "description": SEO_DESCRIPTION,
                        "url": SEO_URL,
                        "image": SEO_IMAGE,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Hạ Long",
                            "addressRegion": "Quảng Ninh",
                            "addressCountry": "VN"
                        },
                        "telephone": "+84-20-3355-9555",
                        "email": "info@alacartehalongbay.com",
                        "inLanguage": language,
                        "isPartOf": {
                            "@type": "WebSite",
                            "name": "ANSTAY",
                            "url": "https://anstay.com.vn"
                        }
                    })}
                </script>
            </Helmet>
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

                <h1 className="hiden-page__title">Anstay Marina Hotel Ha Long Bay</h1>
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
                        className={`hiden-page__lang-btn ${language === "vi" ? "is-active" : ""
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
                        className={`hiden-page__lang-btn ${language === "en" ? "is-active" : ""
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
                {language === "vi" ? <MarinaHidenVi /> : <MarinaHidenEn />}
            </main>
        </div>
    );
};

export default MarinaHotelPage;
