
import React, { useEffect, useRef, useState, useMemo } from 'react';
import './Experience.css';
import { useTranslation } from "@/localization";

const TARGET_WIDTH = 400;
const TARGET_HEIGHT = 225;

const convertResolution = (src: string) => {
    // Cloudinary URL: chèn transform để đổi độ phân giải + tối ưu
    if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
        return src.replace(
            '/upload/',
            `/upload/w_${TARGET_WIDTH},h_${TARGET_HEIGHT},c_fill,f_auto,q_auto/`
        );
    }

    // Ảnh local giữ nguyên (độ phân giải xử lý bằng CSS hoặc file gốc)
    return src;
};

const getServices = (t: any) => [
    {
        title: t('home.servicepeak.title1', 'Nhà hàng'),
        description:
            t('home.servicepeak.desc1', 'Đánh thức các giác quan của bạn với vẻ vàng lựa chọn ẩm thực tinh hoa từ nguồn nguyên liệu đặc sản địa phương theo mùa, chắc chắn đó sẽ là những trải nghiệm ẩm thực hoàn hảo và đáng nhớ của bạn tại à la carte halong bay'),
        image: convertResolution('https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252710/service_peak_1_oq1bdn.jpg'),
        reverse: false,
    },
    {
        title: t('home.servicepeak.title2', 'Phòng hội nghị'),
        description:
            t('home.servicepeak.desc2', 'à la carte halong bay là địa điểm hoàn hảo để tổ chức sự kiện và cuộc họp sang trọng có tầm nhìn tuyệt vời ra vịnh. Với bản phòng thiết và hệ nghi cao cấp, riêng rãi, hệ thống âm thanh, ánh sáng hiện đại, thực đơn tiệc đa dạng và phong cách phục vụ chuyên nghiệp, chúng tôi sẽ mang đến cho bạn và quý khách những trải nghiệm khó quên.'),
        image: convertResolution('https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252709/service_peak_2_ngrkpl.jpg'),
        reverse: true,
    },
    {
        title: t('home.servicepeak.title3', 'Cà phê 60'),
        description:
            t('home.servicepeak.desc3', 'Thiên đường cho các tín đồ cà phê với nguyên liệu được tuyển chọn kĩ lưỡng cùng sự sáng tạo trong cách pha chế tạo nên những hương vị độc đáo, khó quên qua chiếc phễu nghiêng góc 60 độ.'),
        image: convertResolution(
            'https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252711/service_peak_3_es1cmu.jpg'
        ),
        reverse: false,
    },
    {
        title: t('home.servicepeak.title4', 'Spa và giải trí'),
        description:
            t('home.servicepeak.desc4', 'Thư giãn và tái tạo năng lượng tại khu spa đẳng cấp với các liệu trình chăm sóc sức khỏe và làm đẹp chuyên nghiệp, cùng các tiện ích giải trí đa dạng như bể bơi vô cực, phòng gym hiện đại, khu vui chơi trẻ em và nhiều hơn nữa.'),
        image: convertResolution('https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252711/service_peak_4_iewgt2.jpg'),
        reverse: true,
    },
    {
        title: t('home.servicepeak.title5', 'Sky Pub'),
        description:
            t('home.servicepeak.desc5', 'Nâng tầm trải nghiệm giải trí của bạn tại Sky Pub, nơi bạn có thể thưởng thức những ly cocktail sáng tạo và ngắm nhìn toàn cảnh vịnh Hạ Long tuyệt đẹp từ tầng cao nhất của khách sạn.'),
        image: convertResolution('https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252710/service_peak_5_kgrt2l.jpg'),
        reverse: false,
    },
    {
        title: t('home.servicepeak.title6', 'Kem Lab'),
        description:
            t('home.servicepeak.desc6', 'Thưởng thức những hương vị kem/pictures/s độc đáo và sáng tạo tại Kem Lab, nơi chúng tôi kết hợp nguyên liệu tươi ngon với kỹ thuật làm kem hiện đại để mang đến cho bạn trải nghiệm ngọt ngào khó quên.'),
        image: convertResolution('https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252709/service_peak_6_uvomxz.jpg'),
        reverse: true,
    },
];

const SLIDES_TO_SHOW = 2;
const AUTO_SLIDE_INTERVAL = 4000; // ms

const Experience = () => {
    const { t } = useTranslation('home');
    const services = useMemo(() => getServices(t), [t]);
    const [current, setCurrent] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + SLIDES_TO_SHOW) % services.length);
        }, AUTO_SLIDE_INTERVAL);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [current]);

    // Lấy các dịch vụ cho slide hiện tại
    const getCurrentServices = () => {
        const arr = [];
        for (let i = 0; i < SLIDES_TO_SHOW; i++) {
            arr.push(services[(current + i) % services.length]);
        }
        return arr;
    };

    // Nút chuyển slide thủ công (nếu muốn)
    const prevSlide = () => {
        setCurrent((prev) => (prev - SLIDES_TO_SHOW + services.length) % services.length);
    };
    const nextSlide = () => {
        setCurrent((prev) => (prev + SLIDES_TO_SHOW) % services.length);
    };

    const openModal = (image: string) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="experience-container">
            <h2 className="experience-title">{t('home.servicepeak.title', 'DỊCH VỤ ĐẲNG CẤP')}</h2>
            <div className="experience-list">
                {getCurrentServices().map((service, idx) => (
                    <div
                        className={`experience-item ${service.reverse ? 'reverse' : ''}`}
                        key={service.title}
                    >
                        <div className="experience-text">
                            <h2>{service.title}</h2>
                            <p>{service.description}</p>
                            <button
                                className="experience-btn"
                                onClick={() => openModal(service.image)}
                            >
                                Xem
                            </button>
                        </div>
                        <div className="experience-img">
                            <img src={service.image} alt={service.title} loading="lazy" />
                        </div>
                    </div>
                ))}
            </div>
            {/* <div className="experience-slider-controls">
                <button onClick={prevSlide} className="slider-arrow">&#8592;</button>
                <button onClick={nextSlide} className="slider-arrow">&#8594;</button>
            </div> */}

            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✕</button>
                        <img src={selectedImage} alt="Service detail" loading="lazy" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experience;
