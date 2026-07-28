'use client';
import React from "react";
import { useEffect } from "react";
import "./be-style.css";
import { useTranslation } from "@/localization";

export default function BeBookingForm() {
  const { language: lang } = useTranslation();
  const TITLES = {
    vi: "Đặt phòng trực tuyến Anstay Residence by A La Carte Hạ Long, Ha Long - Trang web chính thức",
    en: "Online reservation Anstay Residence by A La Carte Hạ Long, Ha Long - Official Site",
    ko: "온라인 예약 Anstay Residence by A La Carte Hạ Long, Ha Long - 공식 사이트",
    zh: "网上预约 Anstay Residence by A La Carte Hạ Long, Ha Long - 官方网站",
    ru: "Онлайн-бронирование Anstay Residence by A La Carte Hạ Long, Халонг - официальный сайт",
    hi: "Anstay Residence by A La Carte Hạ Long, Ha Long ऑनलाइन आरक्षण - आधिकारिक साइट",
  };

  const bookingForm = (w: any) => {
    // @ts-ignore
    !function (e, n) {
      var t = "bookingengine", o = "integration", i = e[t] = e[t] || {}, a = i[o] = i[o] || {}, r = "__cq", c = "__loader", d = "getElementsByTagName";
      if (n = n || [], a[r] = a[r] ? a[r].concat(n) : n, !a[c]) {
        a[c] = !0; var l = e.document, g = l[d]("head")[0] || l[d]("body")[0];
        // @ts-ignore
        !function n(i) {
          if (0 !== i.length) {
            var a = l.createElement("script"); a.type = "text/javascript", a.async = !0, a.src = "https://" + i[0] + "/integration/loader.js",
              a.onerror = a.onload = function (n, i) { return function () { e[t] && e[t][o] && e[t][o].loaded || (g.removeChild(n), i()) } }(a, (function () { n(i.slice(1, i.length)) })), g.appendChild(a)
          }
        }(
          ["vn-ibe.hopenapi.com", "ibe.hopenapi.com", "ibe.behopenapi.com"])
      }
    }(window, [
      ["setContext", "BE-INT-anstay-com-vn_2025-12-02", lang],
      ["embed", "booking-form", {
        container: "be-booking-form"
      }]
    ]);
  }

  useEffect(() => {
    bookingForm(window);
    const previousTitle = document.title;
    document.title = TITLES[lang] ?? TITLES.en;
    return () => {
      document.title = previousTitle;
    };
  }, [lang]);

  return (
    <>
      <h1 className="be-title"></h1>
      <div id="be-booking-form" />
    </>
  )
}
