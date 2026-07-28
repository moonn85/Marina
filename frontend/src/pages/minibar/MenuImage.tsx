import './menu-image.css';
import { Helmet } from 'react-helmet-async';

const MenuImagePage = () => {
    const menuImageUrl1 = 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825624/Screenshot_2026-05-03_232532_w1yndk.png';
    const menuImageUrl2 = 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825625/Screenshot_2026-05-03_232555_xinazc.png';
    const menuImageUrl3 = 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825624/Screenshot_2026-05-03_232614_ni6wav.png';

    return (
        <>
            <Helmet>
                <title>Bảng Giá Minibar & Tủ Phòng | ANSTAY Hạ Long</title>
                <meta name="description" content="Bảng giá minibar, nước ngọt, đồ ăn nhẹ và các dịch vụ trong phòng tại ANSTAY Hạ Long. Chi tiết giá tất cả các mặt hàng trong tủ lạnh phòng." />
                <meta name="keywords" content="minibar, giá minibar hạ long, dịch vụ phòng, nước uống, đồ ăn" />
                <meta property="og:title" content="Bảng Giá Minibar & Dịch Vụ Phòng | ANSTAY" />
                <meta property="og:description" content="Xem bảng giá chi tiết các mặt hàng minibar: nước ngọt, nước tương tác, đồ ăn nhẹ tại ANSTAY." />
                <meta property="og:image" content="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/Anstay_wra7ap.png" />
                <link rel="canonical" href="https://anstay.com.vn/minibar" />

                {/* PriceSpecification Schema - Minibar Service */}
                <script type="application/ld+json">

                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "Dịch Vụ Minibar & Tủ Phòng",
                        "description": "Dịch vụ minibar với các mặt hàng: nước ngọt, nước tương tác, đồ ăn nhẹ, các loại nước khác tại phòng khách sạn",
                        "provider": {
                            "@type": "Organization",
                            "name": "ANSTAY Residence",
                            "url": "https://anstay.com.vn"
                        },
                        "areaServed": {
                            "@type": "Place",
                            "name": "Hạ Long, Quảng Ninh"
                        },
                        "availableChannel": {
                            "@type": "ServiceChannel",
                            "serviceUrl": "https://anstay.com.vn",
                            "servicePhone": "+84916612772"
                        },
                        "priceRange": "₫ - ₫₫",
                        "image": [
                            "https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825624/Screenshot_2026-05-03_232532_w1yndk.png",
                            "https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825625/Screenshot_2026-05-03_232555_xinazc.png",
                            "https://res.cloudinary.com/drpqrn5jz/image/upload/v1777825624/Screenshot_2026-05-03_232614_ni6wav.png"
                        ]
                    })}
                </script>

                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Trang chủ",
                                "item": "https://anstay.com.vn"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Dịch Vụ",
                                "item": "https://anstay.com.vn/services"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "Bảng Giá Minibar",
                                "item": "https://anstay.com.vn/minibar"
                            }
                        ]
                    })}
                </script>

                {/* FAQPage Schema for Minibar */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Minibar tại ANSTAY có những gì?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "ANSTAY minibar cung cấp: nước ngọt (Coca, Sprite, etc), nước khoáng, cà phê, trà, nước trái cây, đồ ăn nhẹ, snacks, kẹo, chocolate và các loại đồ uống khác."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Giá minibar tại ANSTAY bao nhiêu?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Chi tiết giá tất cả các mặt hàng minibar được liệt kê trong bảng giá phía dưới. Giá có sự khác nhau tùy theo loại sản phẩm."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Làm sao để đặt hàng từ minibar?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Bạn có thể gọi front desk 24/7 hoặc sử dụng remote điều khiển trong phòng để đặt hàng. Hàng sẽ được giao tận phòng của bạn trong vòng 5-10 phút."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Có discount cho khách lưu trú lâu dài không?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Có, ANSTAY cung cấp discount cho các khách lưu trú từ 3 đêm trở lên. Liên hệ front desk để được tư vấn chi tiết."
                                }
                            }
                        ]
                    })}
                </script>
            </Helmet>
            <div className="menu-image-container">
                <div className="menu-images-wrapper">
                    <img src={menuImageUrl1} alt="Menu 1" className="menu-image" />
                    <img src={menuImageUrl2} alt="Menu 2" className="menu-image" />
                    <img src={menuImageUrl3} alt="Menu 3" className="menu-image" />
                </div>
            </div>
        </>
    );
};

export default MenuImagePage;



// import './menu-image.css';

// const MenuImagePage = () => {
//     const menuPdfUrl = '/pictures/minibar.pdf#toolbar=0&navpanes=0';

//     return (
//         <div className="menu-image-container">
//             <iframe
//                 src={menuPdfUrl}
//                 width="100%"
//                 height="100%"
//                 title="Menu PDF"
//                 style={{ border: 'none', minHeight: '600px' }}
//                 className="menu-pdf-iframe"
//             />
//         </div>
//     );
// };

// export default MenuImagePage;
