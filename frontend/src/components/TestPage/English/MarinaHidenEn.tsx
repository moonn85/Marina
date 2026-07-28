import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../Vietnam/Hiden.css";
import {
    ceramicTablewareRows,
    compensationPriceRows,
    toolEquipmentRows,
    exampleToolMapRows,
    type MarinaTableRow,
} from "../MarinaEquipmentData";

const OPEN_DOOR_VIDEO_EMBED_URL =
    "https://www.youtube.com/embed/J8whvmMRx20?controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1&fs=0";

const DOOR_CODES = {
    M101: "123456#",
    M102: "234567#",
    M201: "345678#",
    M202: "456789#",
    M301: "567890#",
    M302: "678901#",
};

const WIFI_PASSWORDS = {
    M101: "Anstaycamon",
    M102: "Anstaycamon",
    M201: "Anstaycamon",
    M202: "Anstaycamon",
    M301: "Anstaycamon",
    M302: "Anstaycamon",
};

const renderTableRows = (rows: readonly MarinaTableRow[]) =>
    rows.map(([stt, product, unit, price]) => (
        <tr key={`${stt}-${product}`}>
            <td>{stt}</td>
            <td>{product}</td>
            <td>{unit}</td>
            <td>{price}</td>
        </tr>
    ));

function MarinaHidenEn() {
    const { apartment } = useParams();
    const normalizedApartment = useMemo(() => {
        if (!apartment) return undefined;
        return decodeURIComponent(apartment).trim().toUpperCase();
    }, [apartment]);

    const [openTabs, setOpenTabs] = useState<(number | string)[]>([0]);
    const [showPopup, setShowPopup] = useState<string | null>(null);

    const getDoorCode = useCallback((apt: string | undefined) => {
        if (!apt) return "No door code";
        const upperApt = apt.trim().toUpperCase();
        return DOOR_CODES[upperApt] || "8668";
    }, []);

    const getWifiPassword = useCallback((apt: string | undefined) => {
        if (!apt) return "Anstaycamon";
        const upperApt = apt.trim().toUpperCase();
        return WIFI_PASSWORDS[upperApt] || "Anstaycamon";
    }, []);

    const getWifiName = useCallback((apt: string | undefined) => {
        if (!apt) return "Marina Hotel Ha Long Bay";
        const upperApt = apt.trim().toUpperCase();
        return `Marina Hotel Ha Long - ${upperApt}`;
    }, []);

    const toggleTab = useCallback((tabId: number | string) => {
        setOpenTabs((prev) =>
            prev.includes(tabId)
                ? prev.filter((id) => id !== tabId)
                : [...prev, tabId]
        );
    }, []);

    const isTabOpen = useCallback((tabId: number | string) => {
        return openTabs.includes(tabId);
    }, [openTabs]);

    return (
        <div className="guide-container-Hiden">
            <h2 className="guide-title-Hiden">Anstay Marina Hotel Ha Long Room Check-in Guide</h2>
            <div className="guide-hero-Hiden">
                <div className="guide-hero-main-Hiden">
                    <p className="guide-hero-kicker-Hiden">Stay Guide</p>
                    <p className="guide-hero-text-Hiden">
                        Quick access to door code, Wi-Fi and complete room usage guide.
                    </p>
                </div>
                <div className="guide-hero-meta-Hiden">
                    <span className="guide-hero-chip-Hiden">
                        Room: {normalizedApartment || "N/A"}
                    </span>
                    <span className="guide-hero-chip-Hiden">Support: 24/7</span>
                </div>
            </div>

            <div className="door-password-section">
                <div className="wifi-info-Hiden">
                    <div className="wifi-credential-Hiden">
                        <span className="wifi-label-Hiden">Wi-Fi: </span>
                        <span className="wifi-value-Hiden">{getWifiName(normalizedApartment)}</span>
                    </div>
                    <div className="wifi-credential-Hiden">
                        <span className="wifi-label-Hiden">Password: </span>
                        <span className="wifi-value-Hiden">{getWifiPassword(normalizedApartment)}</span>
                    </div>
                </div>

                <p className="door-password-note-Hiden">
                </p>
            </div>

            <div className="accordion-Hiden">
                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(1)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(1)}
                    >
                        Opening Door Instructions
                    </button>
                    {isTabOpen(1) && (
                        <div className="accordion-content-Hiden">
                            <p>Swipe your key card to open the door.</p>
                            <p>
                                If you swipe more than 3 times and the door does not open, please
                                contact the front desk for support.
                            </p>
                            <p>
                                <strong>Hotline:</strong> +84 384 945 614 or +84 842 272 772.
                            </p>
                            <button
                                onClick={() => setShowPopup("open-door-video")}
                                className="guide-button-Hiden"
                            >
                                Watch detailed video guide
                            </button>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(2)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(2)}
                    >
                        Instructions for using electrical appliances
                    </button>
                    {isTabOpen(2) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                Please insert your key card into the sensor slot to activate the electricity (the air conditioner will automatically turn on).
                            </p>
                            <p>
                                Turn on the switches to use the lighting system.
                            </p>
                            <p>
                                The central hot water system is always available, you can use it immediately.
                            </p>
                            <p>
                                Please dispose of trash in the designated place to maintain shared hygiene. Thank you!
                            </p>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(3)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(3)}
                    >
                        Bathroom Instructions
                    </button>
                    {isTabOpen(3) && (
                        <div className="accordion-content-Hiden">
                            <p>Use the shower faucet to adjust the water temperature to your preference.</p>
                            <p>Please make sure to turn off the faucet after use.</p>
                            <p>Towels are prepared in the bathroom for your use.</p>
                            <p>
                                If you need support, please contact the front desk: +84 842 272 772.
                            </p>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(4)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(4)}
                    >
                        Stay Information Notes
                    </button>
                    {isTabOpen(4) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                <strong>Check-out time:</strong> 12:00 noon
                            </p>
                            <p>
                                <strong>Check-in time:</strong> 2:00 PM
                            </p>
                            <p>
                                <strong>Quiet hours:</strong> 10:00 PM - 8:00 AM
                            </p>
                            <p>Please respect other guests in the hotel.</p>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(5)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(5)}
                    >
                        Additional Services
                    </button>
                    {isTabOpen(5) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                <strong>Room Service:</strong> Available 24/7
                            </p>
                            <p>
                                <strong>Laundry Service:</strong> Contact front desk to use this service
                            </p>
                            <p>
                                <strong>Airport Transfer:</strong> Please book in advance
                            </p>
                            <p>
                                <strong>Front Desk Phone:</strong> +84 384 945 614 or +84 842 272 772
                            </p>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(6)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(6)}
                    >
                        Equipment Information and Pricing
                    </button>
                    {isTabOpen(6) && (
                        <div className="accordion-content-Hiden">
                            <div className="sub-accordion-Hiden">
                                <div className="sub-accordion-item-Hiden">
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggleTab("6-1");
                                        }}
                                        className="sub-accordion-header-Hiden"
                                        aria-expanded={isTabOpen("6-1")}
                                    >
                                        Ceramic Tableware Price List
                                    </button>
                                    {isTabOpen("6-1") && (
                                        <div className="sub-accordion-content-Hiden table-scroll-Hiden">
                                            <table className="compensation-table-Hiden">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Product</th>
                                                        <th>Unit</th>
                                                        <th>Compensation Price (VND)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{renderTableRows(ceramicTablewareRows)}</tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="sub-accordion-item-Hiden">
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggleTab("6-2");
                                        }}
                                        className="sub-accordion-header-Hiden"
                                        aria-expanded={isTabOpen("6-2")}
                                    >
                                        Compensation Price List
                                    </button>
                                    {isTabOpen("6-2") && (
                                        <div className="sub-accordion-content-Hiden table-scroll-Hiden">
                                            <table className="compensation-table-Hiden">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Item Type (Species)</th>
                                                        <th>Size</th>
                                                        <th>Price (C&amp;B) (VND)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{renderTableRows(compensationPriceRows)}</tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="sub-accordion-item-Hiden">
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggleTab("6-3");
                                        }}
                                        className="sub-accordion-header-Hiden"
                                        aria-expanded={isTabOpen("6-3")}
                                    >
                                        Tool &amp; Equipment Price List
                                    </button>
                                    {isTabOpen("6-3") && (
                                        <div className="sub-accordion-content-Hiden table-scroll-Hiden">
                                            <table className="compensation-table-Hiden">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Product</th>
                                                        <th>Unit</th>
                                                        <th>Compensation Price (VND)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{renderTableRows(toolEquipmentRows)}</tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="sub-accordion-item-Hiden">
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggleTab("6-4");
                                        }}
                                        className="sub-accordion-header-Hiden"
                                        aria-expanded={isTabOpen("6-4")}
                                    >
                                        Example Tool Map
                                    </button>
                                    {isTabOpen("6-4") && (
                                        <div className="sub-accordion-content-Hiden table-scroll-Hiden">
                                            <table className="compensation-table-Hiden">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>PRODUCT</th>
                                                        <th>UNIT</th>
                                                        <th>COMPENSATION PRICE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{renderTableRows(exampleToolMapRows)}</tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        className="accordion-header-Hiden"
                        onClick={() => window.open("https://zalo.me/g/vwxouf293", "_blank")}
                    >
                        Anstay Ha Long Customer Community (Zalo)
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "15px", margin: "20px 0", textAlign: "center" }}>
                <p style={{ color: "#856404", fontSize: "15px", margin: "0", fontWeight: "500" }}>
                    Anstay supports guests to use kites and boomerangs for free.
                </p>
                <p style={{ color: "#856404", fontSize: "15px", margin: "8px 0 0 0", fontWeight: "500" }}>
                    If damaged or lost, an additional fee of <strong>150,000đ/item</strong> applies.
                </p>
            </div>

            {showPopup && (
                <>
                    <div
                        className="popup-overlay-Hiden"
                        onClick={() => setShowPopup(null)}
                    >
                        <div
                            className={`popup-content-Hiden ${showPopup === "open-door-video" ? "popup-content-Hiden--shorts" : ""
                                }`}
                            onClick={(event) => event.stopPropagation()}
                        >
                            {showPopup === "open-door-video" && (
                                <iframe
                                    className="popup-video-frame-Hiden"
                                    src={OPEN_DOOR_VIDEO_EMBED_URL}
                                    title="Marina Hotel door opening guide"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            )}
                            <button
                                className={`close-popup-Hiden ${showPopup === "open-door-video" ? "close-popup-Hiden--shorts" : ""
                                    }`}
                                onClick={() => setShowPopup(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MarinaHidenEn;
