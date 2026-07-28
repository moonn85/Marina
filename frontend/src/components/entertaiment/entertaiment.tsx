import React, { useMemo } from 'react';
import './entertaiment.css';
import { useTranslation } from "@/localization";

interface Entertainment {
    id: number;
    title: string;
    description: string;
    image: string;
    colors?: string[];
}

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
const EntertainmentSection: React.FC = () => {
    const { t } = useTranslation('home');
    const entertainments: Entertainment[] = useMemo(() => [
        {
            id: 1,
            title: t('home.entertainment.title1', 'Kid\'s Oasis'),
            description: t('home.entertainment.desc1', "Kid’s Oasis là khu vui chơi dành riêng cho trẻ em – nơi các bé được thỏa sức khám phá, vận động và sáng tạo trong một không gian an toàn, sinh động và đầy màu sắc."),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252692/entertainment1_vdipxn.jpg"),
            colors: ['#4A90E2', '#8B9DC3', '#FFD700']
        },
        {
            id: 2,
            title: t('home.entertainment.title2', 'Bể Jacuzzi'),
            description: t('home.entertainment.desc2', 'Bể Jacuzzi là không gian thư giãn lý tưởng, nơi bạn có thể tận hưởng cảm giác ngâm mình trong làn nước ấm cùng hệ thống sục thủy lực hiện đại.'),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774254141/entertainment2_n0uyem.jpg"),
            colors: ['#4A90E2', '#E8B4A8', '#FFD700']
        },
        {
            id: 3,
            title: t('home.entertainment.title3', 'OnFit Gym'),
            description: t('home.entertainment.desc3', 'Phòng gym được trang bị đầy đủ máy cardio, khu tạ và thiết bị tập luyện đa chức năng, phù hợp cho cả người mới bắt đầu lẫn người tập chuyên sâu,Không gian rộng rãi, thoáng đãng '),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252694/entertainment3_krn0j5.jpg"),
            colors: ['#4A90E2', '#8B9DC3', '#00A878']
        },
        {
            id: 4,
            title: t('home.entertainment.title4', 'Bể bơi vô cực & Bể bơi bốn mùa'),
            description: t('home.entertainment.desc4', 'À La Carte Hạ Long Bay, có 2 hồ bơi được cấp hệ bơi vô cực hồ bơi được ngồi tại tầng 40, gây ấn tượng mạnh với du khách bởi tầm nhìn toàn cảnh vịnh Hạ Long tuyệt đẹp.'),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252692/entertainment4_irwqh9.jpg"),
            colors: ['#4A90E2', '#E8B4A8', '#8B9DC3']
        },
        {
            id: 5,
            title: t('home.entertainment.title5', 'Spice Spa'),
            description: t('home.entertainment.desc5', 'Không gian trị liệu cao cấp, nơi cơ thể và tâm trí được tái tạo qua những liệu pháp chăm sóc chuyên sâu kết hợp cùng hương liệu tự nhiên.'),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252711/service_peak_4_iewgt2.jpg"),
            colors: ['#FF6B9D', '#E8B4A8', '#8B9DC3']
        },
        {
            id: 6,
            title: t('home.entertainment.title6', 'Dịch vụ thuê xe đạp'),
            description: t('home.entertainment.desc6', 'Bạn có thể tự do dạo quanh những con đường ven biển, khám phá các góc phố địa phương hay đơn giản là tận hưởng không khí trong lành vào buổi sáng sớm hoặc chiều muộn.'),
            image: convertResolution("https://res.cloudinary.com/drpqrn5jz/image/upload/v1774252693/entertainment6_d9wjog.jpg"),
            colors: ['#4A90E2', '#8B9DC3', '#00A878']
        }
    ], [t]);

    return (
        <div className="entertaiment-section">
            <h2 className="entertaiment-title">{t('home.entertainment.title', 'Giải trí')}</h2>
            <div className="entertaiment-grid">
                {entertainments.map((item) => (
                    <div key={item.id} className="entertaiment-card">
                        <div className="card-image">
                            {item.image ? (
                                <img src={item.image} alt={item.title} loading="lazy" />
                            ) : (
                                <div className="image-placeholder"></div>
                            )}
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-description">{item.description}</p>
                            <div className="card-indicators">
                                {/* {item.colors && item.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="indicator-dot"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                ))} */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EntertainmentSection;

