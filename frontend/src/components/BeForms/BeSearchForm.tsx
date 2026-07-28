'use client';
import React from "react";
import { useEffect } from "react";
import "./be-style.css";

export default function BeSearchForm({ className }) {
  const searchForm = (w: any) => {
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
      ["setContext", "BE-INT-anstay-com-vn_2025-12-02", "vi"],
      ["embed", "search-form", {
        container: "be-search-form"
      }]
    ]);
  }

  useEffect(() => {
    searchForm(window);
  }, []);

  return (
    <div id="block-search" className={className}>
      <div id="be-search-form" className="be-container">
        <a href="https://exely.com/" rel="nofollow" target="_blank">Hotel management software</a>
      </div>
    </div>
  )
}