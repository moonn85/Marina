import React, { useLayoutEffect, useRef, useState } from "react";
import "./OrgChart.css";

export default function OrgChart() {
    const viewportRef = useRef(null);
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const canvas = canvasRef.current;
        if (!viewport || !canvas) return;

        const compute = () => {
            const vw = viewport.getBoundingClientRect().width;
            const cw = canvas.scrollWidth; // chiều rộng thật của chart (chưa scale)
            const s = cw ? Math.min(1, vw / cw) : 1;

            setScale(s);
            setIsMobile(vw < 640); // mobile: chuyển layout list cho dễ đọc
        };

        compute();

        const ro = new ResizeObserver(compute);
        ro.observe(viewport);
        ro.observe(canvas);

        window.addEventListener("resize", compute);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", compute);
        };
    }, []);

    if (isMobile) {
        return (
            <section className="orgWrap">
                <h2 className="orgTitle">5. Sơ Đồ Công Ty</h2>

                <div className="orgMobile">
                    <div className="mCard mHead">Giám đốc</div>

                    <div className="mGrid">
                        <div className="mCard"><div className="mTitle">Phòng hành chính nhân sự</div></div>

                        <div className="mCard">
                            <div className="mTitle">Phòng vận hành</div>
                            <ul className="mList">
                                <li>Bộ phận lễ tân</li>
                                <li>Bộ phận buồng</li>
                                <li>Bộ phận an ninh</li>
                            </ul>
                        </div>

                        <div className="mCard"><div className="mTitle">Phòng tài chính kế toán</div></div>

                        <div className="mCard">
                            <div className="mTitle">Phòng kinh doanh</div>
                            <ul className="mList">
                                <li>Bộ phận sale</li>
                                <li>Bộ phận CSKH</li>
                                <li>Bộ phận marketing</li>
                            </ul>
                        </div>

                        <div className="mCard"><div className="mTitle">Phòng kỹ thuật</div></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="orgWrap">
            <h2 className="orgTitle">5. Sơ Đồ Công Ty</h2>

            <div ref={viewportRef} className="orgViewport">
                <div className="orgScaler" style={{ transform: `scale(${scale})` }}>
                    <div ref={canvasRef} className="orgContent">        <ul className="tree">
                        <li className="hasChildren">
                            <div className="nodeWrap">
                                <div className="node nodeTop">Giám đốc</div>
                            </div>

                            {/* Hàng 5 phòng */}
                            <ul className="children childrenTop">
                                <li>
                                    <div className="nodeWrap">
                                        <div className="node nodeSmall">
                                            Phòng<br />hành chính<br />nhân sự
                                        </div>
                                    </div>
                                </li>

                                <li className="hasChildren">
                                    <div className="nodeWrap">
                                        <div className="node nodeSmall">
                                            Phòng<br />vận hành
                                        </div>
                                    </div>

                                    {/* 3 bộ phận vận hành */}
                                    <ul className="children childrenTall">
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />lễ tân</div></div></li>
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />buồng</div></div></li>
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />an ninh</div></div></li>
                                    </ul>
                                </li>

                                <li>
                                    <div className="nodeWrap">
                                        <div className="node nodeSmall">
                                            Phòng<br />tài chính<br />kế toán
                                        </div>
                                    </div>
                                </li>

                                <li className="hasChildren">
                                    <div className="nodeWrap">
                                        <div className="node nodeSmall">
                                            Phòng<br />kinh doanh
                                        </div>
                                    </div>

                                    {/* 3 bộ phận kinh doanh */}
                                    <ul className="children childrenTall">
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />sale</div></div></li>
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />CSKH</div></div></li>
                                        <li><div className="nodeWrap"><div className="node nodeTall">Bộ<br />phận<br />marke<br />ting</div></div></li>
                                    </ul>
                                </li>

                                <li>
                                    <div className="nodeWrap">
                                        <div className="node nodeSmall">
                                            Phòng<br />kỹ thuật
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
