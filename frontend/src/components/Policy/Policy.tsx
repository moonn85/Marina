// Policy.tsx
import React from 'react';
import './Policy.css';
import { Helmet } from 'react-helmet-async';
import BeSearchForm from "../BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

interface PolicyProps {
    className?: string;
}

const Policy: React.FC<PolicyProps> = ({ className }) => {
    const { t } = useTranslation('policy');
    return (
        <div className={`policy-container ${className || ''}`}>
            <Helmet>
                <title>Chính Sách Lưu Trú | ANSTAY - À La Carte Ha Long Bay Residence</title>
                <meta
                    name="description"
                    content="Chính sách đặt phòng và lưu trú tại À La Carte Ha Long Bay. Miễn phí hủy trước 5 ngày, check-in 15:00, check-out 12:00. Chấp nhận thẻ Visa, Mastercard, JCB, Momo, Crypto, Paypal."
                />
                <meta name="keywords" content="chính sách đặt phòng Hạ Long, hủy phòng miễn phí, giờ nhận phòng ANSTAY, thanh toán khách sạn Hạ Long, chính sách trẻ em" />
                <meta property="og:title" content="Chính Sách Lưu Trú - À La Carte Ha Long Bay by ANSTAY" />
                <meta property="og:description" content="Tìm hiểu chính sách đặt phòng, hủy phòng, check-in/out và phương thức thanh toán tại ANSTAY Hạ Long." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://anstay.vn/policy" />

                {/* Structured Data - FAQPage Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Chính sách hủy phòng của ANSTAY như thế nào?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Miễn phí hủy phòng tối đa trước 5 ngày so với ngày đến. Hủy trong vòng 5 ngày trước khi đến hoặc không đến sẽ tính phí toàn bộ thời gian lưu trú."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Giờ nhận phòng và trả phòng là mấy giờ?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Giờ nhận phòng: 15:00 - 23:30. Giờ trả phòng: 00:30 - 12:00."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Khách sạn chấp nhận những phương thức thanh toán nào?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "ANSTAY chấp nhận Visa, Mastercard, JCB, American Express, thẻ ghi nợ nội địa, tiền mặt, Crypto (USDT), Paypal, Momo và VNPay."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Chính sách dành cho trẻ em?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Trẻ dưới 5 tuổi: MIỄN PHÍ cho tối đa 02 trẻ ngủ chung giường với bố mẹ. Trẻ từ 6-11 tuổi: Phụ thu theo chính sách khách sạn."
                                }
                            }
                        ]
                    })}
                </script>
            </Helmet>
            <div className="policy-content">
                <header className="policy-header">
                    <h1>{t('policy.header.title', 'Chính Sách Lưu Trú ')}</h1>
                    <p className="policy-subtitle">À La Carte Ha Long Bay Residence</p>
                </header>

                {/* Chính sách hủy phòng */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-house-door section-icon"></i>
                        {t('policy.header.title1', 'Chính sách hủy phòng')}
                    </h2>
                    <div className="policy-card">
                        <h3 className="policy-card-title">
                            <i className="bi bi-arrow-repeat"></i>
                            {t('policy.title1.child1', 'Giá Flexible:')}
                        </h3>
                        <ul className="policy-list">
                            <li>
                                <i className="bi bi-check-circle-fill text-success"></i>
                                <strong>{t('policy.title1.child2.strong', 'Miễn phí hủy')}</strong> {t('policy.title1.child2.des', 'tối đa trước 5 ngày so với ngày đến.')}
                            </li>

                        </ul>
                    </div>
                    <div className="policy-note">
                        <p>
                            <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                            <strong>{t('policy.title1.child3.strong', 'Hủy trong vòng 5 ngày')}</strong> {t('policy.title1.child3.des', 'trước khi đến hoặc không đến:')}
                            <span className="highlight">{t('policy.title1.child3.highlight', 'tính phí toàn bộ thời gian lưu trú.')}</span>
                        </p>
                    </div>
                </section>

                {/* Điều khoản điều kiện */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-file-text section-icon"></i>
                        {t('policy.header.title2', 'Điều khoản, điều kiện và chính sách bảo mật')}
                    </h2>
                    <div className="policy-grid">
                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <i className="bi bi-clock"></i>
                                {t('policy.title2.child1', 'Giờ nhận phòng')}
                            </h3>
                            <p className="time-info">
                                <span className="time">15:00</span> - <span className="time">23:30</span>
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <i className="bi bi-clock-history"></i>
                                {t('policy.title2.child2', 'Giờ trả phòng')}
                            </h3>
                            <p className="time-info">
                                <span className="time">00:30</span> - <span className="time">12:00</span>
                            </p>
                        </div>
                    </div>
                    <div className="policy-note">
                        <p>
                            <i className="bi bi-info-circle"></i>
                            <strong>{t('policy.title2.child3', 'Lưu ý:')}</strong> {t('policy.title2.child4', 'Chính sách hủy và thanh toán trước có thể khác nhau tùy theo loại phòng.Vui lòng kiểm tra điều kiện áp dụng cho từng lựa chọn khi đặt phòng.')}

                        </p>
                    </div>
                </section>

                {/* Chính sách trẻ em */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-people section-icon"></i>
                        {t('policy.header.title3', 'Chính sách trẻ em & giường')}
                    </h2>
                    <div className="children-policy">
                        <div className="age-group">
                            <h3>
                                <i className="bi bi-person-heart"></i>
                                {t('policy.title3.child1', 'Dưới 5 tuổi')}
                            </h3>
                            <p><span className="free-tag">{t('policy.title3.child2', 'MIỄN PHÍ')}</span> {t('policy.title3.child3', 'cho tối đa 02 trẻ ngủ chung giường với bố mẹ.')}</p>
                        </div>
                        <div className="age-group">
                            <h3>
                                <i className="bi bi-person-check"></i>
                                {t('policy.title3.child4', 'Từ 6 – 11 tuổi')}
                            </h3>
                            <p>{t('policy.title3.child5', 'Phụ thu theo chính sách khách sạn.')}</p>
                        </div>
                    </div>
                    <div className="policy-note">
                        <p>
                            <i className="bi bi-info-circle"></i>
                            {t('policy.title3.child6', 'Để hiển thị giá và số khách chính xác, vui lòng nhập số lượng và độ tuổi trẻ em khi tìm phòng.')}
                        </p>
                    </div>
                </section>

                {/* Chính sách giường cũi */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-bed section-icon"></i>
                        {t('policy.header.title4', 'Chính sách giường cũi & giường phụ')}
                    </h2>
                    <div className="bed-policy">
                        <div className="age-category">
                            <h3>
                                <i className="bi bi-0-circle"></i>
                                {t('policy.title4.child1.age', '0 – 2 tuổi:')}
                            </h3>
                            <ul className="bed-list">
                                <li>
                                    <i className="bi bi-plus-circle"></i>
                                    <span className="bed-type">{t('policy.title4.child1.extra_bed', 'Giường phụ theo yêu cầu:')}</span>
                                    <span className="price">{t('policy.title4.child3', 'Có')}</span>
                                </li>
                                <li>
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                    <span className="bed-type">{t('policy.title4.child4', 'Giường cũi theo yêu cầu:')}</span>
                                    <span className="free-tag">{t('policy.title4.child5', 'Miễn phí')}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="age-category">
                            <h3>
                                <i className="bi bi-3-circle"></i>
                                {t('policy.title4.child6', 'Từ 3 tuổi trở lên:')}
                            </h3>
                            <ul className="bed-list">
                                <li>
                                    <i className="bi bi-plus-circle"></i>
                                    <span className="bed-type">{t('policy.title4.child7', 'Giường phụ theo yêu cầu:')}</span>
                                    <span className="price">{t('policy.title4.child8', 'Có')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="policy-warning">
                        <i className="bi bi-exclamation-triangle"></i>
                        <strong>{t('policy.title4.child9', 'Lưu ý:')}</strong>
                        <ul>
                            <li>{t('policy.title4.child10', 'Giá giường cũi và giường phụ không bao gồm trong tổng giá phòng và sẽ được thanh toán riêng trong thời gian lưu trú.')}</li>
                            <li>{t('policy.title4.child11', 'Số lượng giường phụ/giường cũi tùy thuộc vào loại phòng và tình trạng có sẵn.')}</li>
                        </ul>
                    </div>
                </section>

                {/* Các chính sách khác */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-info-circle section-icon"></i>
                        {t('policy.header.title5', 'Thông tin bổ sung')}
                    </h2>
                    <div className="policy-grid">
                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <i className="bi bi-calendar-check"></i>
                                {t('policy.title5.child1', 'Giới hạn độ tuổi')}
                            </h3>
                            <p>{t('policy.title5.child2', 'Không có giới hạn độ tuổi khi nhận phòng.')}</p>
                        </div>

                        <div className="policy-card">
                            <h3 className="policy-card-title">
                                <i className="bi bi-x-circle-fill text-danger"></i>
                                {t('policy.title5.child3', 'Vật nuôi')}
                            </h3>
                            <p>{t('policy.title5.child4', 'Khách sạn không chấp nhận vật nuôi.')}</p>
                        </div>
                    </div>
                </section>

                {/* Thẻ thanh toán */}
                <section className="policy-section">
                    <h2 className="section-title">
                        <i className="bi bi-credit-card section-icon"></i>
                        {t('policy.header.title6', 'Thẻ thanh toán')}
                    </h2>
                    <div className="payment-section">
                        <div className="payment-intro">
                            <p>{t('policy.title6.subtitle', 'Khách sạn chấp nhận các loại thẻ thanh toán quốc tế và nội địa:')}</p>
                        </div>

                        <div className="payment-cards-grid">
                            <div className="payment-card">
                                <div className="card-logo">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                                </div>
                                <span className="card-name">Mastercard</span>
                            </div>

                            <div className="payment-card">
                                <div className="card-logo">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                                </div>
                                <span className="card-name">Visa</span>
                            </div>

                            <div className="payment-card">
                                <div className="card-logo">
                                    <img src="data:image/jpeg;base64,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" alt="JCB" />
                                </div>
                                <span className="card-name">JCB</span>
                            </div>

                            <div className="payment-card">
                                <div className="card-logo">
                                    <img src="data:image/png;base64,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" alt="American Express" />
                                </div>
                                <span className="card-name">American Express</span>
                            </div>

                            <div className="payment-card">
                                <div className="card-logo">
                                    <i className="bi bi-credit-card-2-front"></i>
                                </div>
                                <span className="card-name">    {t('policy.title6.child1', 'Thẻ ghi nợ')}</span>
                            </div>
                            <div className="payment-card">
                                <div className="card-logo1">
                                    <img src="/pictures/cash.png" alt="Tiền mặt" style={{ width: '', padding: '0px' }} />
                                </div>
                                <span className="card-name">{t('policy.title6.child2', 'Tiền mặt')}</span>
                            </div>
                            <div className="payment-card">
                                <div className="card-logo1">
                                    <img src="/pictures/usdt.png" alt="Crypto" />
                                </div>
                                <span className="card-name">Crypto </span>
                            </div>
                            <div className="payment-card">
                                <div className="card-logo1">
                                    <img src="/pictures/paypal.webp" alt="Paypal" />
                                </div>
                                <span className="card-name">Paypal</span>
                            </div>
                            <div className="payment-card">
                                <div className="card-logo1">
                                    <img src="/pictures/momo.png" alt="Momo" />
                                </div>
                                <span className="card-name">Momo</span>
                            </div>
                            <div className="payment-card">
                                <div className="card-logo1">
                                    <img src="/pictures/vnpay.jpg" alt="Vnpay" />
                                </div>
                                <span className="card-name">Vnpay</span>
                            </div>
                        </div>

                        <div className="payment-features">
                            <div className="feature-item">
                                <i className="bi bi-shield-check"></i>
                                <span>{t('policy.title6.child3', 'Thanh toán an toàn')}</span>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-clock"></i>
                                <span>{t('policy.title6.child4', 'Xử lý nhanh chóng')}  </span>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-globe"></i>
                                <span>{t('policy.title6.child5', 'Hỗ trợ đa quốc gia')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="policy-note">
                        <p>
                            <i className="bi bi-shield-lock"></i>
                            <strong>À La Carte Ha Long Bay Residence</strong>{t('policy.title6.child6', ' có quyền tạm giữ một khoản tiền trước khi nhận phòng.')}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Policy;