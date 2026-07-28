import { useTranslation } from "@/localization";
import { Helmet } from 'react-helmet-async';
import './MeVaBe.css';
import MeVaBeHeader from '../../components/MeVaBe/MeVaBeHeader';
import Footer from '../../components/Footer/Footer';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ComboPrice {
    nights: string;
    guests: string;
    price: number;
    ageNote: string;
    discountPercent?: number;
}

interface Combo {
    id: number;
    name: string;
    description: string;
    image: string;
    category: 'museum' | 'bus' | 'sunworld';
    icon: string;
    includes: string[];
    prices: ComboPrice[];
}

const combos: Combo[] = [
    {
        id: 1,
        name: 'Combo Phòng + Buffet Sáng + Bảo Tàng Quảng Ninh',
        description: 'Phòng + buffet ăn sáng + vé thăm quan bảo tàng Quảng Ninh',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-museum-1',
        category: 'museum',
        icon: '🏛️',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Vé thăm quan bảo tàng Quảng Ninh'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 1400000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 2100000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 2,
        name: 'Combo Phòng + Buffet Sáng + Bữa Trưa/Tối + Bảo Tàng',
        description: 'Phòng + buffet sáng + bữa trưa/tối + vé thăm quan bảo tàng Quảng Ninh',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-museum-2',
        category: 'museum',
        icon: '🏛️',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Bữa trưa/tối', 'Vé thăm quan bảo tàng Quảng Ninh'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 1650000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 2450000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 3,
        name: 'Combo Phòng + 3 Bữa Ăn + Bảo Tàng Quảng Ninh',
        description: 'Phòng + buffet sáng + bữa trưa + bữa tối + vé thăm quan bảo tàng Quảng Ninh',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-museum-3',
        category: 'museum',
        icon: '🏛️',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Bữa trưa', 'Bữa tối', 'Vé thăm quan bảo tàng'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 1900000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 2800000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 4,
        name: 'Combo Phòng + Buffet Sáng + Xe Bus 2 Tầng',
        description: 'Phòng + buffet ăn sáng + xe bus 2 tầng khám phá Hạ Long',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-bus-1',
        category: 'bus',
        icon: '🚌',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Xe bus 2 tầng Hạ Long'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 1800000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 2500000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 5,
        name: 'Combo Phòng + 3 Bữa Ăn + Xe Bus 2 Tầng',
        description: 'Phòng + buffet sáng + bữa trưa/tối + xe bus 2 tầng',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-bus-2',
        category: 'bus',
        icon: '🚌',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Bữa trưa/tối', 'Xe bus 2 tầng Hạ Long'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 2100000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 2850000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 6,
        name: 'Combo Phòng + 3 Bữa Ăn Đầy Đủ + Xe Bus 2 Tầng',
        description: 'Phòng + buffet sáng + bữa trưa + bữa tối + xe bus 2 tầng',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-bus-3',
        category: 'bus',
        icon: '🚌',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Bữa trưa', 'Bữa tối', 'Xe bus 2 tầng'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 2350000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 3200000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 7,
        name: 'Combo Phòng + Buffet Sáng + Vé Sunworld',
        description: 'Phòng + buffet ăn sáng + vé Sunworld (Cáp treo Nữ Hoàng)',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-sunworld-1',
        category: 'sunworld',
        icon: '🎢',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Vé Sunworld - Cáp treo Nữ Hoàng'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 2450000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 3450000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
    {
        id: 8,
        name: 'Combo Phòng + 3 Bữa Ăn + Vé Sunworld',
        description: 'Phòng + buffet sáng + bữa trưa/tối + vé Sunworld (Cáp treo Nữ Hoàng)',
        image: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/v1/combo-sunworld-2',
        category: 'sunworld',
        icon: '🎢',
        includes: ['Phòng nghỉ', 'Buffet ăn sáng', 'Bữa trưa/tối', 'Vé Sunworld - Cáp treo Nữ Hoàng'],
        prices: [
            { nights: '1 ngủ', guests: '2NL + 1TE', price: 2680000, ageNote: 'Trẻ < 6 tuổi', discountPercent: 20 },
            { nights: '2 ngủ', guests: '2NL + 2TE', price: 3750000, ageNote: 'Trẻ < 12 tuổi', discountPercent: 20 },
        ],
    },
];

const MeVaBe = () => {
    const { t } = useTranslation('home');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'museum' | 'bus' | 'sunworld'>('all');
    const [wishlist, setWishlist] = useState<number[]>([]);

    const filteredCombos = selectedCategory === 'all'
        ? combos
        : combos.filter(combo => combo.category === selectedCategory);

    const toggleWishlist = (id: number) => {
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const categoryLabels = {
        all: 'Tất Cả Combo',
        museum: 'Bảo Tàng',
        bus: 'Xe Bus 2 Tầng',
        sunworld: 'Sunworld',
    };

    return (
        <>
            <Helmet>
                <title>Combo Chào Hè - Gói Du Lịch Gia Đình Giá Tốt | ANSTAY Hạ Long</title>
                <meta name="description" content="Gói combo du lịch gia đình giá tốt: phòng + ăn sáng + bảo tàng/bus/Sunworld. Chọn gói phù hợp với gia đình bạn tại ANSTAY Hạ Long." />
                <meta name="keywords" content="combo du lịch hạ long, gói gia đình, du lịch hè, combo phòng + ăn" />
                <meta property="og:title" content="Combo Chào Hè - Gói Du Lịch Gia Đình | ANSTAY" />
                <meta property="og:description" content="Gói combo du lịch hạ long cho gia đình với giá cạnh tranh. Phòng + ăn sáng + hoạt động vui nhộn." />
                <meta property="og:image" content="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/Anstay_wra7ap.png" />
                <link rel="canonical" href="https://anstay.com.vn/mevabe" />

                {/* CollectionPage Schema - Product Listing */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Combo Chào Hè - Gói Du Lịch Gia Đình",
                        "description": "Bộ sưu tập gói combo du lịch cho gia đình tại ANSTAY với giá cạnh tranh",
                        "url": "https://anstay.com.vn/mevabe",
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": combos.slice(0, 6).map((combo, idx) => ({
                                "@type": "ListItem",
                                "position": idx + 1,
                                "item": {
                                    "@type": "Product",
                                    "@id": `https://anstay.com.vn/mevabe#combo-${combo.id}`,
                                    "name": combo.name,
                                    "description": combo.description,
                                    "image": combo.image,
                                    "brand": {
                                        "@type": "Brand",
                                        "name": "ANSTAY"
                                    },
                                    "offers": combo.prices.map((price, priceIdx) => ({
                                        "@type": "Offer",
                                        "priceCurrency": "VND",
                                        "price": price.price.toString(),
                                        "priceValidUntil": "2026-12-31",
                                        "availability": "InStock",
                                        "description": `${combo.name} - ${price.nights}, ${price.guests}`,
                                        "url": `https://anstay.com.vn/mevabe#combo-${combo.id}`,
                                        "seller": {
                                            "@type": "Organization",
                                            "name": "ANSTAY"
                                        }
                                    }))
                                }
                            }))
                        }
                    })}
                </script>

                {/* Individual Product/BundleOffer Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": combos.map((combo, idx) => ({
                            "@type": "BundleOffer",
                            "@id": `https://anstay.com.vn/mevabe#combo-${combo.id}`,
                            "name": combo.name,
                            "description": combo.description,
                            "image": combo.image,
                            "includedItem": combo.includes.map(inc => ({
                                "@type": "Service",
                                "name": inc
                            })),
                            "offers": combo.prices.map((price, priceIdx) => ({
                                "@type": "Offer",
                                "priceCurrency": "VND",
                                "price": price.price.toString(),
                                "priceValidUntil": "2026-12-31",
                                "availability": "InStock",
                                "url": "https://anstay.com.vn/mevabe",
                                "seller": {
                                    "@type": "Organization",
                                    "name": "ANSTAY",
                                    "url": "https://anstay.com.vn"
                                }
                            })),
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.5",
                                "ratingCount": "100"
                            }
                        }))
                    })}
                </script>
            </Helmet>
            <main className="mevabe-page">
                {/* Hero Section */}
                <section className="mevabe-hero">
                    {/* <div className="mevabe-hero-decorations">
                        <div className="mevabe-deco mevabe-deco-1">🌊</div>
                        <div className="mevabe-deco mevabe-deco-2">🌴</div>
                        <div className="mevabe-deco mevabe-deco-3">☀️</div>
                        <div className="mevabe-deco mevabe-deco-4">🐚</div>
                        <div className="mevabe-deco mevabe-deco-5">🌴</div>
                        <div className="mevabe-deco mevabe-deco-6">🌴</div>
                    </div> */}
                    <div className="mevabe-hero-content">
                        <h1 className="mevabe-hero-title">
                            <span className="mevabe-title-main">COMBO CHÀO Hè</span>
                            <span className="mevabe-title-highlight">KỲ NGHỈ BIỂN CHO GIA ĐÌNH</span>
                        </h1>
                        <p className="mevabe-hero-subtitle">
                            Những gói dịch vụ vui nhộn, an toàn và tuyệt vời cho mẹ, bé và cả gia đình
                        </p>
                    </div>
                </section>

                {/* Featured Combos Section */}
                {/* <section className="mevabe-featured-combos">
                    <div className="mevabe-container">
                        <div className="mevabe-featured-title">
                            <h2>Gói Combo Nổi Bật Cho Mẹ & Bé</h2>
                            <p>Chọn gói phù hợp với nhu cầu gia đình bạn</p>
                        </div>
                        <div className="mevabe-featured-grid">

                            <div className="mevabe-featured-card">
                                <div className="mevabe-featured-badge">Tiết Kiệm</div>
                                <div className="mevabe-featured-header">
                                    <h3>Gia Đình Tiết Kiệm</h3>
                                    <p className="mevabe-featured-duration">2 Ngày 1 Đêm</p>
                                    <p className="mevabe-featured-target">Ưu tiên gia đình đi ô tô</p>
                                </div>
                                <div className="mevabe-featured-content">
                                    <h4>Bao gồm:</h4>
                                    <ul>
                                        <li>✓ Phòng nghỉ</li>
                                        <li>✓ Ăn sáng</li>
                                        <li>✓ Quà cho bé</li>
                                        <li>✓ Du thuyền</li>
                                    </ul>
                                </div>
                                <button className="mevabe-featured-btn" onClick={() => window.location.href = '/booking'}>
                                    Đặt ngay
                                </button>
                            </div>


                            <div className="mevabe-featured-card mevabe-featured-card-popular">
                                <div className="mevabe-featured-badge mevabe-featured-badge-popular">Phổ Biến</div>
                                <div className="mevabe-featured-header">
                                    <h3>Gia Đình Tiện Lợi</h3>
                                    <p className="mevabe-featured-duration">2-3 Ngày 1-2 Đêm</p>
                                    <p className="mevabe-featured-target">Ưu tiên gia đình đi máy bay (3N2Đ)</p>
                                </div>
                                <div className="mevabe-featured-content">
                                    <h4>Bao gồm:</h4>
                                    <ul>
                                        <li>✓ Phòng nghỉ</li>
                                        <li>✓ Ăn sáng & 1 bữa chính</li>
                                        <li>✓ Hỗ trợ chăm sóc trẻ em</li>
                                        <li>✓ 3 hạng hoạt động chơi</li>
                                        <li>✓ Team hỗ trợ 24/7</li>
                                    </ul>
                                </div>
                                <button className="mevabe-featured-btn mevabe-featured-btn-primary" onClick={() => window.location.href = '/booking'}>
                                    Đặt ngay
                                </button>
                            </div>


                            <div className="mevabe-featured-card">
                                <div className="mevabe-featured-badge">Premium</div>
                                <div className="mevabe-featured-header">
                                    <h3>Gia Đình Trọn Gói</h3>
                                    <p className="mevabe-featured-duration">3 Ngày 2 Đêm</p>
                                    <p className="mevabe-featured-target">Trải nghiệm đầy đủ</p>
                                </div>
                                <div className="mevabe-featured-content">
                                    <h4>Bao gồm:</h4>
                                    <ul>
                                        <li>✓ Phòng nghỉ</li>
                                        <li>✓ Ăn sáng, trưa, tối</li>
                                        <li>✓ Hoạt động nhẹ nhàng cho bé</li>
                                        <li>✓ Tất cả dịch vụ hỗ trợ</li>
                                    </ul>
                                </div>
                                <button className="mevabe-featured-btn" onClick={() => window.location.href = '/booking'}>
                                    Đặt ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Category Filter */}
                <section className="mevabe-combos">
                    <div className="mevabe-hero-decorations">
                        <div className="mevabe-deco mevabe-deco-3"><img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1777101491/cute-boy-is-running-and-holding-the-tire-to-swim-vector-43890584-removebg-preview_x9vjft.png" alt="Sticker" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} /></div>
                        <div className="mevabe-deco mevabe-deco-2"><img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1777100478/z7755669696383_16eb812eadf782538dd23d2fb875f38e-removebg-preview_eetke3.png" alt="Sticker" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} /></div>
                        <div className="mevabe-deco mevabe-deco-1">☀️</div>
                        <div className="mevabe-deco mevabe-deco-4"><img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1777102940/z7755669696383_16eb812eadf782538dd23d2fb875f38e-removebg-preview_3_g4htbg.png" alt="Sticker" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} /></div>
                        <div className="mevabe-deco mevabe-deco-5">🌴</div>
                        <div className="mevabe-deco mevabe-deco-6"><img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1777100528/z7755676255090_87965bba2c42bb4f90f000afef3dad1a-removebg-preview_tncjqh.png" alt="Sticker" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} /></div>
                    </div>
                    <div className="mevabe-container">
                        <div className="mevabe-combos-filter-wrapper">
                            <div className="mevabe-filter-wrapper-inner">
                                <div className="mevabe-filter-banner">
                                    <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_50/v1776932752/z7732150100554_6cd64368753ebc70e7049e324daf2a34_eixnti.jpg" alt="Mẹ & Bé" />
                                </div>
                                <div className="mevabe-filter-right-section">
                                    {/* <div className="mevabe-combos-banner-top">
                                        <img src="https://img.freepik.com/vetores-premium/ola-dia-de-verao-na-praia_9850-1133.jpg" alt="Combo" />
                                    </div> */}
                                    <div className="mevabe-combos-banner-top">
                                        <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_50/v1776933778/d251230c-6282-411a-9f22-a0c839ac7446_mtbblg.png" alt="Combo" />
                                    </div>
                                    <div className="mevabe-combos-filter">
                                        {(['all', 'museum', 'bus', 'sunworld'] as const).map(category => (
                                            <button
                                                key={category}
                                                className={`mevabe-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {categoryLabels[category]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Combos Grid */}
                        <div className="mevabe-combos-grid">
                            {filteredCombos.map(combo => (
                                <div key={combo.id} className="mevabe-combo-card">
                                    {/* <div className="mevabe-combo-header">
                                        <div className="mevabe-combo-icon">{combo.icon}</div>
                                        <button
                                            className={`mevabe-wishlist-btn ${wishlist.includes(combo.id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(combo.id)}
                                        >
                                            <Heart size={20} fill={wishlist.includes(combo.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    </div> */}

                                    <h3 className="mevabe-combo-name">{combo.name}</h3>
                                    <p className="mevabe-combo-description">{combo.description}</p>

                                    <div className="mevabe-combo-includes">
                                        <h4>Bao gồm:</h4>
                                        <ul>
                                            {combo.includes.map((item, idx) => (
                                                <li key={idx}>✓ {item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mevabe-combo-prices">
                                        <h4>Giá:</h4>
                                        {combo.prices.map((priceInfo, idx) => {
                                            const discount = priceInfo.discountPercent || 20;
                                            const originalPrice = Math.round(priceInfo.price / (1 - discount / 100));
                                            return (
                                                <div key={idx} className="mevabe-price-row">
                                                    <div className="mevabe-price-info">
                                                        <span className="mevabe-price-nights">{priceInfo.nights}</span>
                                                        <span className="mevabe-price-guests">({priceInfo.guests})</span>
                                                        <span className="mevabe-price-age">{priceInfo.ageNote}</span>
                                                    </div>
                                                    <div className="mevabe-price-values" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                        <span className="mevabe-price-original" style={{ textDecoration: 'line-through', color: '#999' }}>
                                                            {originalPrice.toLocaleString('vi-VN')}đ
                                                        </span>
                                                        <span className="mevabe-price-value" style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                                            {priceInfo.price.toLocaleString('vi-VN')}đ
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button className="mevabe-combo-btn" onClick={() => {
                                        const message = `Tôi muốn đặt combo: ${combo.name}\n\n--Website Mẹ & Bé: https://anstay.com/mevabe`;

                                        // Detect mobile
                                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                                        if (isMobile) {
                                            // Copy message vào clipboard
                                            navigator.clipboard.writeText(message).then(() => {
                                                alert('✓ Đã copy tin nhắn vào clipboard. Vui lòng paste vào Zalo');
                                                window.open(`https://zalo.me/0384945614`, '_blank');
                                            }).catch(() => {
                                                alert('Vui lòng paste tin nhắn sau: ' + message);
                                                window.open(`https://zalo.me/0384945614`, '_blank');
                                            });
                                        } else {
                                            const encodedMessage = encodeURIComponent(message);
                                            window.open(`https://zalo.me/0384945614?text=${encodedMessage}`, '_blank');
                                        }
                                    }}>
                                        Đặt/Tư Vấn   ngay
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Combo Highlights Section */}
                <section className="mevabe-highlights">
                    <div className="mevabe-container">
                        <div className="mevabe-highlights-grid">
                            <div className="mevabe-highlight-item">
                                <div className="mevabe-highlight-icon">
                                    <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1778579223/R_u6k161.jpg" alt="Museum" style={{ width: '150px', height: '100px', objectFit: 'cover', objectPosition: 'center', borderRadius: '8px' }} />
                                </div>
                                <h3>Bảo Tàng Quảng Ninh</h3>
                                <p>Khám phá lịch sử và văn hoá<br />Combo 1-3</p>
                            </div>

                            <div className="mevabe-highlight-item">
                                <div className="mevabe-highlight-icon">
                                    <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1778577506/Review-xe-bus-2-tang-Ha-Long_rm7p0o.jpg" alt="Bus" style={{ width: '150px', height: '100px', objectFit: 'cover', objectPosition: 'center', borderRadius: '8px' }} />
                                </div>
                                <h3>Xe Bus 2 Tầng</h3>
                                <p>Hành trình khám phá Hạ Long<br />Combo 4-6</p>
                            </div>

                            <div className="mevabe-highlight-item">
                                <div className="mevabe-highlight-icon">
                                    <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/f_auto,q_70/cap-treo-nu-hoang-acc-3_ofppd1.webp" alt="Cable Car" style={{ width: '150px', height: '100px', objectFit: 'cover', objectPosition: 'center', borderRadius: '8px' }} />
                                </div>
                                <h3>Cáp Treo Nữ Hoàng</h3>
                                <p>Sunworld - Thắng Cảnh Tuyệt Vời<br />Combo 7-8</p>
                            </div>

                            <div className="mevabe-highlight-item">
                                <div className="mevabe-highlight-icon">
                                    <img src="https://res.cloudinary.com/drpqrn5jz/image/upload/v1778578246/z7740435859194_614308fb1cd3db5905b4f9a678a7423d_hstvfb.jpg" alt="Buffet" style={{ width: '150px', height: '100px', objectFit: 'cover', objectPosition: 'center', borderRadius: '8px' }} />
                                </div>
                                <h3>Buffet Ăn Sáng</h3>
                                <p>Hơn 20 món Á - Âu<br />Tất cả combo đều có</p>
                            </div>
                        </div>
                    </div>
                </section>



            </main>

        </>
    );
};

export default MeVaBe;
