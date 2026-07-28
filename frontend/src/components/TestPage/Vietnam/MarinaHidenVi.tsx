import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./Hiden.css";
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

function MarinaHidenVi() {
    const { apartment } = useParams();
    const normalizedApartment = useMemo(() => {
        if (!apartment) return undefined;
        return decodeURIComponent(apartment).trim().toUpperCase();
    }, [apartment]);

    const [openTabs, setOpenTabs] = useState<(number | string)[]>([0]);
    const [showPopup, setShowPopup] = useState<string | null>(null);

    const getDoorCode = useCallback((apt: string | undefined) => {
        if (!apt) return "không có mã";
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
            <h2 className="guide-title-Hiden">Hướng dẫn nhận phòng Anstay Marina Hotel Ha Long</h2>
            <div className="guide-hero-Hiden">
                <div className="guide-hero-main-Hiden">
                    <p className="guide-hero-kicker-Hiden">Stay Guide</p>
                    <p className="guide-hero-text-Hiden">
                        Truy cập nhanh mã cửa, Wi-Fi và toàn bộ hướng dẫn sử dụng phòng.
                    </p>
                </div>
                <div className="guide-hero-meta-Hiden">
                    <span className="guide-hero-chip-Hiden">
                        Phòng: {normalizedApartment || "N/A"}
                    </span>
                    <span className="guide-hero-chip-Hiden">Hỗ trợ: 24/7</span>
                </div>
            </div>

            <div className="door-password-section">
                {/* <h2 className="door-password-title-Hiden">
                    Mật khẩu cửa phòng {normalizedApartment} :{" "}
                    {getDoorCode(normalizedApartment)}
                </h2> */}

                <div className="wifi-info-Hiden">
                    <div className="wifi-credential-Hiden">
                        <span className="wifi-label-Hiden">Wi-Fi: </span>
                        <span className="wifi-value-Hiden">{getWifiName(normalizedApartment)}</span>
                    </div>
                    <div className="wifi-credential-Hiden">
                        <span className="wifi-label-Hiden">Mật khẩu: </span>
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
                        Hướng dẫn mở cửa phòng
                    </button>
                    {isTabOpen(1) && (
                        <div className="accordion-content-Hiden">
                            <p>Quẹt thẻ để mở cửa.</p>
                            <p>
                                Nếu quẹt quá 3 lần mà cửa không mở, vui lòng liên hệ lễ tân để
                                được hỗ trợ.
                            </p>
                            <p>
                                <strong>Hotline:</strong> +84 384 945 614 hoặc +84 842 272 772.
                            </p>
                            <button
                                onClick={() => setShowPopup("open-door-video")}
                                className="guide-button-Hiden"
                            >
                                Xem video hướng dẫn chi tiết
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
                        Hướng dẫn sử dụng các thiết bị điện
                    </button>

                    {isTabOpen(2) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                Vui lòng đặt thẻ vào khe cảm biến để kích hoạt điện (điều hòa sẽ
                                tự động bật).
                            </p>
                            <p>
                                Bật các công tắc để sử dụng hệ thống chiếu sáng.
                            </p>
                            <p>
                                Hệ thống nước nóng trung tâm luôn sẵn sàng, bạn có thể sử dụng
                                ngay.
                            </p>
                            <p>
                                Vui lòng bỏ rác đúng nơi quy định để giữ gìn vệ sinh chung. Xin
                                cảm ơn!
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
                        Hướng dẫn phòng tắm
                    </button>
                    {isTabOpen(3) && (
                        <div className="accordion-content-Hiden">
                            <p>Sử dụng vòi sen để điều chỉnh nhiệt độ nước theo nhu cầu.</p>
                            <p>Vui lòng đảm bảo đã tắt vòi nước sau khi sử dụng.</p>
                            <p>
                                Khăn tắm được chuẩn bị sẵn trong phòng tắm để bạn sử dụng.
                            </p>
                            <p>
                                Nếu cần hỗ trợ, vui lòng liên hệ lễ tân: +84 842 272 772.
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
                        Thông tin lưu ý khi lưu trú
                    </button>
                    {isTabOpen(4) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                <strong>Giờ trả phòng:</strong> 12:00 trưa
                            </p>
                            <p>
                                <strong>Khách hàng vào phòng:</strong> 14:00 chiều
                            </p>
                            <p>
                                <strong>Quy tắc yên tĩnh:</strong> 22:00 - 08:00
                            </p>
                            <p>Vui lòng tôn trọng các khách hàng khác trong khách sạn.</p>
                        </div>
                    )}
                </div>

                <div className="accordion-item-Hiden">
                    <button
                        onClick={() => toggleTab(5)}
                        className="accordion-header-Hiden"
                        aria-expanded={isTabOpen(5)}
                    >
                        Dịch vụ thêm
                    </button>
                    {isTabOpen(5) && (
                        <div className="accordion-content-Hiden">
                            <p>
                                <strong>Dịch vụ phòng:</strong> Có sẵn 24/7
                            </p>
                            <p>
                                <strong>Giặt ủi:</strong> Liên hệ lễ tân để sử dụng dịch vụ
                            </p>
                            <p>
                                <strong>Đưa đón sân bay:</strong> Vui lòng đặt trước
                            </p>
                            <p>
                                <strong>Số điện thoại lễ tân:</strong> +84384945614 hoặc +84842272772
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
                        Thông tin thiết bị và mức giá
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
                                                        <th>STT</th>
                                                        <th>Sản phẩm</th>
                                                        <th>Đơn vị</th>
                                                        <th>Giá đền bù (VND)</th>
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
                                                        <th>STT</th>
                                                        <th>Loại vật dụng (Species)</th>
                                                        <th>Kích thước (Size)</th>
                                                        <th>Giá (C&amp;B) (VND)</th>
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
                                        Bảng Đồ Công Cụ Dụng Cụ
                                    </button>
                                    {isTabOpen("6-3") && (
                                        <div className="sub-accordion-content-Hiden table-scroll-Hiden">
                                            <table className="compensation-table-Hiden">
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Sản phẩm</th>
                                                        <th>Đơn vị</th>
                                                        <th>Giá đền bù (VND)</th>
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
                                                        <th>STT</th>
                                                        <th>SẢN PHẨM</th>
                                                        <th>ĐƠN VỊ</th>
                                                        <th>GIÁ ĐỀN BÙ</th>
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
                        onClick={() =>
                            window.open("https://zalo.me/g/vwxouf293", "_blank")
                        }
                    >
                        Cộng đồng khách hàng Anstay Hạ Long (Zalo)
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "15px", margin: "20px 0", textAlign: "center" }}>
                <p style={{ color: "#856404", fontSize: "15px", margin: "0", fontWeight: "500" }}>
                    Anstay hỗ trợ khách sử dụng diều và boomerang miễn phí.
                </p>
                <p style={{ color: "#856404", fontSize: "15px", margin: "8px 0 0 0", fontWeight: "500" }}>
                    Nếu khách làm hỏng hoặc làm mất phụ thu <strong>150.000đ/món</strong>.
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
                                    title="Huong dan mo cua Marina Hotel"
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
                                Đóng
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MarinaHidenVi;
