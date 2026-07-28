import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation, type LocalLanguage } from '@/localization';
import {
    BadgeCheck,
    BedDouble,
    Bell,
    Building2,
    CalendarCheck2,
    Car,
    ChevronDown,
    ConciergeBell,
    Dumbbell,
    LucideIcon,
    MapPin,
    PhoneCall,
    ShieldCheck,
    Sparkles,
    Utensils,
    WalletCards,
    Waves,
    Wifi,
} from 'lucide-react';
import './about.css';
import {
    marinaAboutRoomImages,
    marinaShowcaseImages,
} from '../../data/marinaImages';

interface AboutProps {
    className?: string;
}

type IconItem = {
    icon: LucideIcon;
    name: string;
};

type FeatureItem = {
    icon: LucideIcon;
    title: string;
    description: string;
};

type RoomItem = {
    name: string;
    details: string;
};

type FaqItem = {
    id: string;
    q: string;
    a: string;
};

type PageContent = {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    heroEyebrow: string;
    heroTitle: string;
    heroManaged: string;
    heroLocation: string;
    bookingCta: string;
    contactCta: string;
    introKicker: string;
    introTitle: string;
    introText: string;
    introPoints: string[];
    serviceText: string;
    factsTitle: string;
    factsSubtitle: string;
    facts: string[];
    amenitiesKicker: string;
    amenitiesTitle: string;
    amenitiesSubtitle: string;
    amenities: string[];
    highlightsKicker: string;
    highlightsTitle: string;
    features: Omit<FeatureItem, 'icon'>[];
    roomsKicker: string;
    roomsTitle: string;
    roomsSubtitle: string;
    rooms: RoomItem[];
    locationKicker: string;
    locationTitle: string;
    locationSubtitle: string;
    locationItems: string[];
    policyKicker: string;
    policyTitle: string;
    policies: string[];
    bannerText: string;
    faqKicker: string;
    faqTitle: string;
    faqSubtitle: string;
    faqs: Omit<FaqItem, 'id'>[];
    finalKicker: string;
    finalTitle: string;
    finalSubtitle: string;
};

const SEO_URL = 'https://anstay.com.vn/about';
const SEO_IMAGE = 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_75/v1763450336/halong-bay-tour_mpTU2_t0fcmv.jpg';

const content: Record<LocalLanguage, PageContent> = {
    vi: {
        seoTitle: 'Giới thiệu Anstay Marina Hotel Ha Long | Khách sạn Bãi Cháy',
        seoDescription: 'Anstay Marina Hotel Ha Long khai trương năm 2025 tại Bãi Cháy, Hạ Long, gần Halong Marina, bãi biển công cộng, hồ bơi vô cực tầng thượng và các hạng phòng linh hoạt.',
        seoKeywords: 'Anstay Marina Hotel Ha Long, khách sạn Bãi Cháy, khách sạn Hạ Long, Halong Marina, đặt phòng Anstay',
        heroEyebrow: 'Khai trương năm 2025',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: 'Không gian lưu trú hiện đại tại Bãi Cháy, Hạ Long',
        heroLocation: '5 Maria Square, khu phố đi bộ, TP. Hạ Long, Quảng Ninh',
        bookingCta: 'Đặt phòng ngay',
        contactCta: 'Liên hệ tư vấn',
        introKicker: 'Giới thiệu',
        introTitle: 'Khách sạn mới gần biển, thuận tiện cho kỳ nghỉ Hạ Long',
        introText: 'Anstay Marina Hotel Ha Long nằm tại khu Halong Marina, gần bãi biển Hùng Thắng, quảng trường Marina và các điểm vui chơi của Bãi Cháy. Khách sạn phù hợp cho cặp đôi, gia đình và nhóm bạn cần phòng sạch đẹp, giá hợp lý, dễ di chuyển và có dịch vụ hỗ trợ lưu trú rõ ràng.',
        introPoints: ['Điểm đánh giá 8,9/10 từ khách lưu trú', 'Bể bơi vô cực tầng thượng và bãi biển công cộng gần kề', 'Phòng studio, phòng view biển và căn hộ 2 phòng ngủ'],
        serviceText: 'Hỗ trợ khách lưu trú bởi đội ngũ Anstay',
        factsTitle: 'Thông tin nhanh',
        factsSubtitle: 'Các thông tin quan trọng trước khi đặt phòng',
        facts: ['Khai trương: 2025', 'Tân trang: 2026', 'Số phòng: 40', 'Điện thoại: +84 384 945 614', 'Khu vực: Bãi Cháy, Hạ Long, Quảng Ninh', 'Nhận phòng: 14:00 - 22:00', 'Trả phòng: trước 12:00', 'Lễ tân: 07:00 - 22:00 hằng ngày'],
        amenitiesKicker: 'Tiện nghi',
        amenitiesTitle: 'Tiện nghi & dịch vụ nổi bật',
        amenitiesSubtitle: 'Các tiện ích được khách lưu trú quan tâm nhiều nhất',
        amenities: ['Bể bơi trong nhà', 'Bể bơi vô cực trên tầng thượng', 'Bãi biển công cộng', 'Phòng xông hơi', 'Phòng gym', 'Chỗ đậu xe công cộng miễn phí', 'Nơi để hành lý miễn phí', 'Bar', 'Nhà hàng', 'Cà phê', 'Karaoke', 'Dịch vụ đặt taxi', 'Thuê xe và thuê xe đạp', 'Phòng họp', 'Câu lạc bộ trẻ em', 'Wi-Fi khu vực chung miễn phí'],
        highlightsKicker: 'Điểm nổi bật',
        highlightsTitle: 'Vì sao nên chọn Anstay Marina Hotel Ha Long?',
        features: [
            { title: 'Vị trí dễ di chuyển', description: 'Từ khách sạn có thể đi bộ đến quảng trường Halong Marina, bãi biển Hùng Thắng và các khu vui chơi ven biển.' },
            { title: 'Giá tốt, phòng sạch', description: 'Khách đánh giá cao mức giá hợp lý, phòng mới, sạch đẹp và phù hợp cho kỳ nghỉ ngắn ngày tại Hạ Long.' },
            { title: 'Hồ bơi tầng thượng', description: 'Bể bơi sân thượng, hồ bơi vô cực và khu vực thư giãn tạo điểm nhấn cho trải nghiệm nghỉ dưỡng.' },
            { title: 'Nhiều hạng phòng', description: 'Có studio ban công, phòng executive view biển và căn hộ 2 phòng ngủ cho nhóm hoặc gia đình.' },
        ],
        roomsKicker: 'Hạng phòng',
        roomsTitle: 'Các lựa chọn phòng phổ biến',
        roomsSubtitle: 'Thông tin tóm tắt theo cấu hình phòng đang bán',
        rooms: [
            { name: 'Studio có ban công', details: '1 giường đôi, khoảng 30 m2, tầng 3-6, có ban công, Wi-Fi miễn phí.' },
            { name: 'Sea View Executive King', details: '1 giường queen, khoảng 40 m2, phù hợp cho 2 khách, Wi-Fi miễn phí.' },
            { name: 'Sea View Executive Twin', details: '1 giường đơn và 1 giường đôi, khoảng 40 m2, phù hợp bạn bè hoặc gia đình nhỏ.' },
            { name: 'Suite 2 phòng ngủ nhìn ra thành phố', details: '2 phòng ngủ, khoảng 60 m2, sức chứa đến 4 khách.' },
            { name: 'Two-Bedroom Apartment with Sea View', details: '2 giường queen, khoảng 63 m2, phù hợp gia đình hoặc nhóm 4 khách.' },
        ],
        locationKicker: 'Vị trí',
        locationTitle: 'Xung quanh khách sạn',
        locationSubtitle: 'Các điểm đến và kết nối giao thông đáng chú ý',
        locationItems: ['Golfzon Ha Long: khoảng 130 m', 'Quảng trường Halong Marina: khoảng 160 m', 'Bãi biển Hùng Thắng: khoảng 200 m', 'Bãi biển BIM Group Hạ Long: khoảng 220 m', 'Nhạc nước Halo Bay Show: khoảng 840 m', 'Sealife Legend Cruise Hạ Long Center: khoảng 1,2 km', 'Đảo Tuần Châu: khoảng 3,4 km', 'Sun World Hạ Long và Dragon Park: khoảng 5 km', 'Ga Hạ Long: khoảng 6 km', 'Sân bay Cát Bi: khoảng 39,9 km', 'Sân bay Vân Đồn: khoảng 66 km'],
        policyKicker: 'Chính sách',
        policyTitle: 'Thông tin lưu trú cần biết',
        policies: ['Chủ nhà hoặc nhân viên sẽ đón tiếp khách khi đến nơi.', 'Vui lòng liên hệ trước một ngày để được hướng dẫn nhận phòng và cung cấp giấy tờ tùy thân, giờ đến dự kiến hoặc thông tin chuyến bay nếu cần.', 'Trẻ em thuộc mọi độ tuổi đều được chào đón. Phí giường phụ hoặc cũi phụ thuộc vào từng hạng phòng.', 'Bữa sáng buffet gồm món châu Á và ẩm thực địa phương, phục vụ 06:00 - 10:00. Người lớn khoảng 200.000 VND/người, trẻ em 17 tuổi trở xuống khoảng 180.000 VND/người.', 'Có yêu cầu đặt cọc 1.000.000 VND; hoàn cọc vào ngày trả phòng theo chính sách chỗ nghỉ.', 'Không được mang theo thú cưng hoặc động vật hỗ trợ.', 'Khách chính nhận phòng cần từ 18 tuổi trở lên.'],
        bannerText: 'Đặt trực tiếp qua Anstay để được hỗ trợ nhanh về phòng, view, bữa sáng, yêu cầu nhận phòng và các phát sinh trong quá trình lưu trú.',
        faqKicker: 'FAQ',
        faqTitle: 'Câu hỏi thường gặp',
        faqSubtitle: 'Thông tin hữu ích khi đặt phòng tại Anstay Marina Hotel Ha Long',
        faqs: [
            { q: 'Giờ nhận phòng và trả phòng là khi nào?', a: 'Giờ nhận phòng từ 14:00 đến 22:00. Giờ trả phòng trước 12:00.' },
            { q: 'Khách sạn có hồ bơi không?', a: 'Có. Khách sạn có bể bơi trong nhà, bể bơi sân thượng, hồ bơi vô cực và khu vực bể bơi có tầm nhìn.' },
            { q: 'Có được mang theo thú cưng không?', a: 'Không. Chỗ nghỉ không cho phép mang theo thú cưng hoặc động vật hỗ trợ.' },
            { q: 'Khách sạn có phục vụ bữa sáng không?', a: 'Có. Bữa sáng buffet phục vụ 06:00 - 10:00, gồm món châu Á và ẩm thực địa phương. Có thể phát sinh phí tùy gói phòng.' },
            { q: 'Từ sân bay đến khách sạn mất bao xa?', a: 'Sân bay Cát Bi cách khoảng 39,9 km và sân bay Vân Đồn cách khoảng 66 km.' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: 'Sẵn sàng nghỉ tại Anstay Marina Hotel Ha Long?',
        finalSubtitle: 'Gửi ngày lưu trú và số lượng khách để Anstay kiểm tra phòng, giá và ưu đãi phù hợp.',
    },
    en: {
        seoTitle: 'About Anstay Marina Hotel Ha Long | Bai Chay Hotel',
        seoDescription: 'Anstay Marina Hotel Ha Long opened in 2025 in Bai Chay, Ha Long, near Halong Marina, the public beach, rooftop infinity pool and flexible room types.',
        seoKeywords: 'Anstay Marina Hotel Ha Long, Bai Chay hotel, Ha Long hotel, Halong Marina, Anstay booking',
        heroEyebrow: 'Opened in 2025',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: 'A modern stay in Bai Chay, Ha Long',
        heroLocation: '5 Maria Square, walking street area, Ha Long City, Quang Ninh',
        bookingCta: 'Book now',
        contactCta: 'Contact us',
        introKicker: 'About',
        introTitle: 'A new seaside hotel for an easy Ha Long stay',
        introText: 'Anstay Marina Hotel Ha Long is located in the Halong Marina area, close to Hung Thang Beach, Marina Square and Bai Chay entertainment spots. It is suited to couples, families and friends looking for clean rooms, fair prices, easy access and clear guest support.',
        introPoints: ['Guest rating 8.9/10', 'Rooftop infinity pool and nearby public beach', 'Studios, sea-view rooms and two-bedroom apartments'],
        serviceText: 'Guest support by the Anstay team',
        factsTitle: 'Quick facts',
        factsSubtitle: 'Key details before booking',
        facts: ['Opened: 2025', 'Renovated: 2026', 'Rooms: 40', 'Phone: +84 384 945 614', 'Area: Bai Chay, Ha Long, Quang Ninh', 'Check-in: 14:00 - 22:00', 'Check-out: before 12:00', 'Front desk: 07:00 - 22:00 daily'],
        amenitiesKicker: 'Amenities',
        amenitiesTitle: 'Amenities & services',
        amenitiesSubtitle: 'The facilities guests ask about most often',
        amenities: ['Indoor pool', 'Rooftop infinity pool', 'Public beach', 'Sauna', 'Gym', 'Free public parking', 'Free luggage storage', 'Bar', 'Restaurant', 'Cafe', 'Karaoke', 'Taxi booking', 'Car and bicycle rental', 'Meeting room', 'Kids club', 'Free Wi-Fi in public areas'],
        highlightsKicker: 'Highlights',
        highlightsTitle: 'Why choose Anstay Marina Hotel Ha Long?',
        features: [
            { title: 'Easy location', description: 'Walk to Halong Marina Square, Hung Thang Beach and nearby seaside leisure areas.' },
            { title: 'Good value, clean rooms', description: 'Guests frequently mention fair pricing, new rooms and a clean stay for short Ha Long trips.' },
            { title: 'Rooftop pool', description: 'The rooftop pool, infinity pool and lounge areas add a resort feel to the stay.' },
            { title: 'Flexible room types', description: 'Choose from balcony studios, sea-view executive rooms and two-bedroom apartments.' },
        ],
        roomsKicker: 'Rooms',
        roomsTitle: 'Popular room choices',
        roomsSubtitle: 'A short overview of available room configurations',
        rooms: [
            { name: 'Studio with Balcony', details: '1 double bed, about 30 sqm, floors 3-6, balcony and free Wi-Fi.' },
            { name: 'Sea View Executive King', details: '1 queen bed, about 40 sqm, suitable for 2 guests, free Wi-Fi.' },
            { name: 'Sea View Executive Twin', details: '1 single bed and 1 double bed, about 40 sqm, suitable for friends or a small family.' },
            { name: 'Two-Bedroom City View Suite', details: '2 bedrooms, about 60 sqm, suitable for up to 4 guests.' },
            { name: 'Two-Bedroom Apartment with Sea View', details: '2 queen beds, about 63 sqm, suitable for families or 4-person groups.' },
        ],
        locationKicker: 'Location',
        locationTitle: 'Around the hotel',
        locationSubtitle: 'Nearby places and transport connections',
        locationItems: ['Golfzon Ha Long: about 130 m', 'Halong Marina Square: about 160 m', 'Hung Thang Beach: about 200 m', 'BIM Group Ha Long Beach: about 220 m', 'Halo Bay Show: about 840 m', 'Sealife Legend Cruise Ha Long Center: about 1.2 km', 'Tuan Chau Island: about 3.4 km', 'Sun World Ha Long and Dragon Park: about 5 km', 'Ha Long Station: about 6 km', 'Cat Bi Airport: about 39.9 km', 'Van Don Airport: about 66 km'],
        policyKicker: 'Policies',
        policyTitle: 'Stay information',
        policies: ['The host or staff will welcome guests on arrival.', 'Please contact the property one day before arrival for check-in instructions and provide ID, estimated arrival time or flight details when needed.', 'Children of all ages are welcome. Extra bed or crib fees depend on the room type.', 'Buffet breakfast includes Asian and local cuisine, served from 06:00 to 10:00. Adults are about VND 200,000 per person; children aged 17 and under are about VND 180,000 per person.', 'A VND 1,000,000 deposit is required and refunded on check-out according to property policy.', 'Pets and service animals are not allowed.', 'The main guest checking in must be at least 18 years old.'],
        bannerText: 'Book directly through Anstay for faster support with rooms, views, breakfast, check-in requests and stay-related needs.',
        faqKicker: 'FAQ',
        faqTitle: 'Frequently asked questions',
        faqSubtitle: 'Useful information when booking Anstay Marina Hotel Ha Long',
        faqs: [
            { q: 'What are the check-in and check-out times?', a: 'Check-in is from 14:00 to 22:00. Check-out is before 12:00.' },
            { q: 'Does the hotel have a swimming pool?', a: 'Yes. The hotel has an indoor pool, rooftop pool, infinity pool and pool area with a view.' },
            { q: 'Are pets allowed?', a: 'No. Pets and service animals are not allowed.' },
            { q: 'Is breakfast available?', a: 'Yes. Buffet breakfast is served from 06:00 to 10:00 with Asian and local dishes. Fees may apply depending on the room package.' },
            { q: 'How far is the hotel from the airport?', a: 'Cat Bi Airport is about 39.9 km away and Van Don Airport is about 66 km away.' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: 'Ready to stay at Anstay Marina Hotel Ha Long?',
        finalSubtitle: 'Send your dates and guest count so Anstay can check rooms, prices and suitable offers.',
    },
    ko: {
        seoTitle: 'Anstay Marina Hotel Ha Long 소개 | 바이짜이 호텔',
        seoDescription: 'Anstay Marina Hotel Ha Long은 2025년 바이짜이 하롱에 오픈한 숙소로, 하롱 마리나, 공용 해변, 루프탑 인피니티 풀과 다양한 객실을 제공합니다.',
        seoKeywords: 'Anstay Marina Hotel Ha Long, 바이짜이 호텔, 하롱 호텔, 하롱 마리나, Anstay 예약',
        heroEyebrow: '2025년 오픈',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: '하롱 바이짜이의 현대적인 숙소',
        heroLocation: '5 Maria Square, 보행 거리 구역, 하롱시, 꽝닌',
        bookingCta: '예약하기',
        contactCta: '문의하기',
        introKicker: '소개',
        introTitle: '하롱 여행에 편리한 신축 해변 호텔',
        introText: 'Anstay Marina Hotel Ha Long은 하롱 마리나 지역에 위치하며 훙탕 해변, 마리나 광장, 바이짜이의 즐길 거리와 가깝습니다. 깨끗한 객실, 합리적인 가격, 편리한 이동, 명확한 투숙 지원을 원하는 커플, 가족, 친구 여행객에게 적합합니다.',
        introPoints: ['투숙객 평점 8.9/10', '루프탑 인피니티 풀과 가까운 공용 해변', '스튜디오, 바다 전망 객실, 2베드룸 아파트'],
        serviceText: 'Anstay 팀의 투숙 지원',
        factsTitle: '기본 정보',
        factsSubtitle: '예약 전 확인할 주요 정보',
        facts: ['오픈: 2025년', '리노베이션: 2026년', '객실 수: 40개', '전화: +84 384 945 614', '지역: 바이짜이, 하롱, 꽝닌', '체크인: 14:00 - 22:00', '체크아웃: 12:00 전', '프런트: 매일 07:00 - 22:00'],
        amenitiesKicker: '편의시설',
        amenitiesTitle: '주요 시설 및 서비스',
        amenitiesSubtitle: '투숙객이 가장 많이 확인하는 시설',
        amenities: ['실내 수영장', '루프탑 인피니티 풀', '공용 해변', '사우나', '피트니스룸', '무료 공용 주차장', '무료 수하물 보관', '바', '레스토랑', '카페', '노래방', '택시 예약', '차량 및 자전거 대여', '회의실', '키즈 클럽', '공용 구역 무료 Wi-Fi'],
        highlightsKicker: '하이라이트',
        highlightsTitle: 'Anstay Marina Hotel Ha Long을 선택하는 이유',
        features: [
            { title: '편리한 위치', description: '하롱 마리나 광장, 훙탕 해변, 주변 해변 휴식 공간까지 도보 이동이 편리합니다.' },
            { title: '합리적인 가격과 깨끗한 객실', description: '투숙객들은 합리적인 가격, 새 객실, 깨끗한 환경을 자주 언급합니다.' },
            { title: '루프탑 수영장', description: '루프탑 풀, 인피니티 풀, 휴식 공간이 리조트 같은 분위기를 더합니다.' },
            { title: '다양한 객실 타입', description: '발코니 스튜디오, 바다 전망 executive 객실, 2베드룸 아파트를 선택할 수 있습니다.' },
        ],
        roomsKicker: '객실',
        roomsTitle: '인기 객실 옵션',
        roomsSubtitle: '판매 중인 객실 구성 요약',
        rooms: [
            { name: '발코니 스튜디오', details: '더블 침대 1개, 약 30m2, 3-6층, 발코니와 무료 Wi-Fi.' },
            { name: 'Sea View Executive King', details: '퀸 침대 1개, 약 40m2, 2인 투숙에 적합, 무료 Wi-Fi.' },
            { name: 'Sea View Executive Twin', details: '싱글 침대 1개와 더블 침대 1개, 약 40m2, 친구 또는 소가족에게 적합.' },
            { name: '2베드룸 시티뷰 스위트', details: '침실 2개, 약 60m2, 최대 4인 투숙 가능.' },
            { name: '바다 전망 2베드룸 아파트', details: '퀸 침대 2개, 약 63m2, 가족 또는 4인 그룹에 적합.' },
        ],
        locationKicker: '위치',
        locationTitle: '호텔 주변',
        locationSubtitle: '주변 명소와 교통 연결',
        locationItems: ['Golfzon Ha Long: 약 130m', 'Halong Marina Square: 약 160m', 'Hung Thang Beach: 약 200m', 'BIM Group Ha Long Beach: 약 220m', 'Halo Bay Show: 약 840m', 'Sealife Legend Cruise Ha Long Center: 약 1.2km', 'Tuan Chau Island: 약 3.4km', 'Sun World Ha Long 및 Dragon Park: 약 5km', 'Ha Long Station: 약 6km', 'Cat Bi Airport: 약 39.9km', 'Van Don Airport: 약 66km'],
        policyKicker: '정책',
        policyTitle: '투숙 전 알아둘 정보',
        policies: ['호스트 또는 직원이 도착 시 고객을 맞이합니다.', '도착 하루 전 숙소에 연락해 체크인 안내를 받고, 필요 시 신분증, 도착 예정 시간 또는 항공 정보를 제공해 주세요.', '모든 연령의 어린이가 투숙 가능합니다. 엑스트라 베드나 유아 침대 요금은 객실 타입에 따라 다릅니다.', '조식 뷔페는 아시아식 및 현지 음식으로 06:00 - 10:00에 제공됩니다. 성인은 1인 약 200,000 VND, 만 17세 이하 어린이는 약 180,000 VND입니다.', '1,000,000 VND 보증금이 필요하며, 숙소 정책에 따라 체크아웃일에 환불됩니다.', '반려동물 및 보조동물은 동반할 수 없습니다.', '대표 투숙객은 만 18세 이상이어야 합니다.'],
        bannerText: 'Anstay를 통해 직접 예약하면 객실, 전망, 조식, 체크인 요청 및 투숙 중 필요한 사항을 더 빠르게 지원받을 수 있습니다.',
        faqKicker: 'FAQ',
        faqTitle: '자주 묻는 질문',
        faqSubtitle: 'Anstay Marina Hotel Ha Long 예약 시 유용한 정보',
        faqs: [
            { q: '체크인과 체크아웃 시간은 언제인가요?', a: '체크인은 14:00부터 22:00까지이며, 체크아웃은 12:00 전입니다.' },
            { q: '호텔에 수영장이 있나요?', a: '네. 실내 수영장, 루프탑 수영장, 인피니티 풀과 전망이 있는 수영장 공간이 있습니다.' },
            { q: '반려동물 동반이 가능한가요?', a: '아니요. 반려동물 및 보조동물은 동반할 수 없습니다.' },
            { q: '조식이 제공되나요?', a: '네. 06:00 - 10:00에 아시아식 및 현지 음식 조식 뷔페가 제공됩니다. 객실 패키지에 따라 요금이 발생할 수 있습니다.' },
            { q: '공항에서 호텔까지 거리는 얼마나 되나요?', a: '깟비 공항은 약 39.9km, 번돈 공항은 약 66km 떨어져 있습니다.' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: 'Anstay Marina Hotel Ha Long에서 머물 준비가 되셨나요?',
        finalSubtitle: '투숙 날짜와 인원을 보내주시면 Anstay가 객실, 가격, 적합한 혜택을 확인해 드립니다.',
    },
    zh: {
        seoTitle: '安斯泰下龙码头酒店介绍 | 拜寨酒店',
        seoDescription: 'Anstay Marina Hotel Ha Long 于2025年在下龙拜寨开业，靠近下龙码头、公共海滩，设有屋顶无边泳池和多种房型。',
        seoKeywords: 'Anstay Marina Hotel Ha Long, 拜寨酒店, 下龙酒店, 下龙码头, 安斯泰预订',
        heroEyebrow: '2025年开业',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: '下龙拜寨的现代住宿空间',
        heroLocation: '越南广宁省下龙市步行街区 Maria Square 5号',
        bookingCta: '立即预订',
        contactCta: '联系咨询',
        introKicker: '介绍',
        introTitle: '靠近海边的新酒店，适合轻松游览下龙',
        introText: 'Anstay Marina Hotel Ha Long 位于下龙码头区域，靠近雄胜海滩、Marina 广场和拜寨娱乐区。酒店适合情侣、家庭和朋友出行，提供干净客房、合理价格、便利交通和清晰的入住支持。',
        introPoints: ['住客评分 8.9/10', '屋顶无边泳池和附近公共海滩', '一室房、海景房和两卧室公寓'],
        serviceText: '由 Anstay 团队提供入住支持',
        factsTitle: '快速信息',
        factsSubtitle: '预订前需要了解的重点信息',
        facts: ['开业：2025年', '翻新：2026年', '房间数：40间', '电话：+84 384 945 614', '区域：广宁省下龙市拜寨', '入住：14:00 - 22:00', '退房：12:00前', '前台：每天 07:00 - 22:00'],
        amenitiesKicker: '设施',
        amenitiesTitle: '主要设施与服务',
        amenitiesSubtitle: '住客最常关注的便利设施',
        amenities: ['室内泳池', '屋顶无边泳池', '公共海滩', '桑拿房', '健身房', '免费公共停车', '免费行李寄存', '酒吧', '餐厅', '咖啡厅', '卡拉OK', '叫车服务', '租车和自行车租赁', '会议室', '儿童俱乐部', '公共区域免费 Wi-Fi'],
        highlightsKicker: '亮点',
        highlightsTitle: '为什么选择 Anstay Marina Hotel Ha Long？',
        features: [
            { title: '出行方便', description: '可步行前往 Halong Marina 广场、雄胜海滩和附近的海滨休闲区域。' },
            { title: '性价比高，房间干净', description: '住客常提到价格合理、房间较新、整体干净，适合下龙短途旅行。' },
            { title: '屋顶泳池', description: '屋顶泳池、无边泳池和休息区为入住增添度假感。' },
            { title: '房型灵活', description: '可选择带阳台一室房、海景行政房和两卧室公寓。' },
        ],
        roomsKicker: '房型',
        roomsTitle: '热门房型选择',
        roomsSubtitle: '当前房型配置简要说明',
        rooms: [
            { name: '带阳台一室房', details: '1张双人床，约30平方米，3-6层，带阳台和免费 Wi-Fi。' },
            { name: '海景行政大床房', details: '1张 queen 床，约40平方米，适合2位客人，免费 Wi-Fi。' },
            { name: '海景行政双床房', details: '1张单人床和1张双人床，约40平方米，适合朋友或小家庭。' },
            { name: '两卧室城市景观套房', details: '2间卧室，约60平方米，最多可住4位客人。' },
            { name: '两卧室海景公寓', details: '2张 queen 床，约63平方米，适合家庭或4人小组。' },
        ],
        locationKicker: '位置',
        locationTitle: '酒店周边',
        locationSubtitle: '附近景点与交通连接',
        locationItems: ['Golfzon Ha Long：约130米', 'Halong Marina 广场：约160米', '雄胜海滩：约200米', 'BIM Group 下龙海滩：约220米', 'Halo Bay Show：约840米', 'Sealife Legend Cruise Ha Long Center：约1.2公里', '团洲岛：约3.4公里', 'Sun World Ha Long 和 Dragon Park：约5公里', '下龙火车站：约6公里', '吉碑机场：约39.9公里', '云屯机场：约66公里'],
        policyKicker: '政策',
        policyTitle: '入住须知',
        policies: ['房东或工作人员将在客人抵达时接待。', '请在抵达前一天联系住宿方获取入住指引，并按需提供身份证件、预计抵达时间或航班信息。', '欢迎所有年龄儿童入住。加床或婴儿床费用视房型而定。', '自助早餐含亚洲和当地菜式，供应时间为06:00 - 10:00。成人约200,000越南盾/人，17岁及以下儿童约180,000越南盾/人。', '需支付1,000,000越南盾押金，并按住宿政策于退房日退还。', '不允许携带宠物或服务动物。', '主要入住客人需年满18岁。'],
        bannerText: '通过 Anstay 直接预订，可更快获得房型、景观、早餐、入住要求和住店期间问题的协助。',
        faqKicker: 'FAQ',
        faqTitle: '常见问题',
        faqSubtitle: '预订 Anstay Marina Hotel Ha Long 时的实用信息',
        faqs: [
            { q: '入住和退房时间是什么时候？', a: '入住时间为14:00至22:00，退房时间为12:00前。' },
            { q: '酒店有游泳池吗？', a: '有。酒店设有室内泳池、屋顶泳池、无边泳池和带景观的泳池区域。' },
            { q: '可以携带宠物吗？', a: '不可以。住宿不允许携带宠物或服务动物。' },
            { q: '酒店提供早餐吗？', a: '提供。自助早餐供应时间为06:00 - 10:00，包含亚洲和当地菜式，具体费用取决于房型套餐。' },
            { q: '从机场到酒店有多远？', a: '吉碑机场约39.9公里，云屯机场约66公里。' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: '准备入住 Anstay Marina Hotel Ha Long 吗？',
        finalSubtitle: '发送入住日期和人数，Anstay 将为您确认房间、价格和合适优惠。',
    },
    ru: {
        seoTitle: 'Об Anstay Marina Hotel Ha Long | Отель в Бай Чай',
        seoDescription: 'Anstay Marina Hotel Ha Long открылся в 2025 году в Бай Чай, Халонг, рядом с Halong Marina, общественным пляжем, rooftop infinity pool и гибкими типами номеров.',
        seoKeywords: 'Anstay Marina Hotel Ha Long, отель Бай Чай, отель Халонг, Halong Marina, бронирование Anstay',
        heroEyebrow: 'Открыт в 2025 году',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: 'Современное размещение в Бай Чай, Халонг',
        heroLocation: '5 Maria Square, район пешеходной улицы, город Халонг, Куангнинь',
        bookingCta: 'Забронировать',
        contactCta: 'Связаться',
        introKicker: 'Об отеле',
        introTitle: 'Новый отель у моря для удобного отдыха в Халонге',
        introText: 'Anstay Marina Hotel Ha Long расположен в районе Halong Marina, рядом с пляжем Hung Thang, площадью Marina и развлечениями Бай Чай. Отель подходит парам, семьям и друзьям, которым нужны чистые номера, разумная цена, удобное расположение и понятная поддержка во время проживания.',
        introPoints: ['Оценка гостей 8,9/10', 'Rooftop infinity pool и общественный пляж рядом', 'Студии, номера с видом на море и апартаменты с 2 спальнями'],
        serviceText: 'Поддержка гостей командой Anstay',
        factsTitle: 'Краткая информация',
        factsSubtitle: 'Главное перед бронированием',
        facts: ['Открыт: 2025', 'Реновация: 2026', 'Номеров: 40', 'Телефон: +84 384 945 614', 'Район: Бай Чай, Халонг, Куангнинь', 'Заезд: 14:00 - 22:00', 'Выезд: до 12:00', 'Стойка регистрации: ежедневно 07:00 - 22:00'],
        amenitiesKicker: 'Удобства',
        amenitiesTitle: 'Удобства и услуги',
        amenitiesSubtitle: 'Самые востребованные удобства у гостей',
        amenities: ['Крытый бассейн', 'Rooftop infinity pool', 'Общественный пляж', 'Сауна', 'Тренажерный зал', 'Бесплатная общественная парковка', 'Бесплатное хранение багажа', 'Бар', 'Ресторан', 'Кафе', 'Караоке', 'Заказ такси', 'Аренда автомобиля и велосипеда', 'Переговорная комната', 'Детский клуб', 'Бесплатный Wi-Fi в общественных зонах'],
        highlightsKicker: 'Преимущества',
        highlightsTitle: 'Почему стоит выбрать Anstay Marina Hotel Ha Long?',
        features: [
            { title: 'Удобная локация', description: 'Можно пешком дойти до Halong Marina Square, пляжа Hung Thang и ближайших приморских зон отдыха.' },
            { title: 'Хорошая цена и чистые номера', description: 'Гости часто отмечают разумную стоимость, новые номера и чистоту для короткой поездки в Халонг.' },
            { title: 'Бассейн на крыше', description: 'Rooftop pool, infinity pool и зоны отдыха добавляют проживанию курортное ощущение.' },
            { title: 'Гибкие типы номеров', description: 'Доступны студии с балконом, executive номера с видом на море и апартаменты с 2 спальнями.' },
        ],
        roomsKicker: 'Номера',
        roomsTitle: 'Популярные варианты размещения',
        roomsSubtitle: 'Краткий обзор конфигураций номеров',
        rooms: [
            { name: 'Студия с балконом', details: '1 двуспальная кровать, около 30 м2, этажи 3-6, балкон и бесплатный Wi-Fi.' },
            { name: 'Sea View Executive King', details: '1 кровать queen, около 40 м2, подходит для 2 гостей, бесплатный Wi-Fi.' },
            { name: 'Sea View Executive Twin', details: '1 односпальная и 1 двуспальная кровать, около 40 м2, подходит друзьям или небольшой семье.' },
            { name: 'Люкс с 2 спальнями и видом на город', details: '2 спальни, около 60 м2, размещение до 4 гостей.' },
            { name: 'Апартаменты с 2 спальнями и видом на море', details: '2 кровати queen, около 63 м2, подходят семье или группе из 4 гостей.' },
        ],
        locationKicker: 'Расположение',
        locationTitle: 'Рядом с отелем',
        locationSubtitle: 'Места поблизости и транспорт',
        locationItems: ['Golfzon Ha Long: около 130 м', 'Halong Marina Square: около 160 м', 'Пляж Hung Thang: около 200 м', 'BIM Group Ha Long Beach: около 220 м', 'Halo Bay Show: около 840 м', 'Sealife Legend Cruise Ha Long Center: около 1,2 км', 'Остров Tuan Chau: около 3,4 км', 'Sun World Ha Long и Dragon Park: около 5 км', 'Станция Ha Long: около 6 км', 'Аэропорт Cat Bi: около 39,9 км', 'Аэропорт Van Don: около 66 км'],
        policyKicker: 'Правила',
        policyTitle: 'Что нужно знать о проживании',
        policies: ['Хозяин или сотрудник встретит гостей по прибытии.', 'Пожалуйста, свяжитесь с объектом за день до приезда для инструкций по заезду и при необходимости предоставьте документ, время прибытия или данные рейса.', 'Дети любого возраста приветствуются. Стоимость дополнительной кровати или детской кроватки зависит от типа номера.', 'Завтрак buffet включает азиатскую и местную кухню, подается с 06:00 до 10:00. Взрослый около 200 000 VND, дети до 17 лет около 180 000 VND.', 'Требуется депозит 1 000 000 VND, возврат в день выезда согласно правилам объекта.', 'Домашние животные и животные-помощники не допускаются.', 'Главному гостю при заезде должно быть не менее 18 лет.'],
        bannerText: 'Бронируйте напрямую через Anstay, чтобы быстрее получить помощь с номером, видом, завтраком, заездом и вопросами во время проживания.',
        faqKicker: 'FAQ',
        faqTitle: 'Частые вопросы',
        faqSubtitle: 'Полезная информация при бронировании Anstay Marina Hotel Ha Long',
        faqs: [
            { q: 'Когда заезд и выезд?', a: 'Заезд с 14:00 до 22:00. Выезд до 12:00.' },
            { q: 'Есть ли в отеле бассейн?', a: 'Да. Есть крытый бассейн, бассейн на крыше, infinity pool и зона бассейна с видом.' },
            { q: 'Можно ли с домашними животными?', a: 'Нет. Домашние животные и животные-помощники не допускаются.' },
            { q: 'Есть ли завтрак?', a: 'Да. Завтрак buffet подается с 06:00 до 10:00 и включает азиатские и местные блюда. Стоимость зависит от пакета номера.' },
            { q: 'Как далеко отель от аэропорта?', a: 'Аэропорт Cat Bi находится примерно в 39,9 км, аэропорт Van Don - примерно в 66 км.' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: 'Готовы остановиться в Anstay Marina Hotel Ha Long?',
        finalSubtitle: 'Отправьте даты и количество гостей, чтобы Anstay проверил номера, цены и подходящие предложения.',
    },
    hi: {
        seoTitle: 'Anstay Marina Hotel Ha Long परिचय | Bai Chay होटल',
        seoDescription: 'Anstay Marina Hotel Ha Long 2025 में Bai Chay, Ha Long में खुला, Halong Marina, public beach, rooftop infinity pool और flexible room types के पास स्थित है।',
        seoKeywords: 'Anstay Marina Hotel Ha Long, Bai Chay hotel, Ha Long hotel, Halong Marina, Anstay booking',
        heroEyebrow: '2025 में खुला',
        heroTitle: 'Anstay Marina Hotel Ha Long',
        heroManaged: 'Bai Chay, Ha Long में आधुनिक ठहराव',
        heroLocation: '5 Maria Square, walking street area, Ha Long City, Quang Ninh',
        bookingCta: 'अभी बुक करें',
        contactCta: 'संपर्क करें',
        introKicker: 'परिचय',
        introTitle: 'Ha Long में आसान छुट्टी के लिए नया seaside hotel',
        introText: 'Anstay Marina Hotel Ha Long, Halong Marina area में स्थित है और Hung Thang Beach, Marina Square तथा Bai Chay entertainment spots के पास है। यह couples, families और friends के लिए उपयुक्त है जिन्हें साफ कमरे, उचित कीमत, आसान आवाजाही और स्पष्ट guest support चाहिए।',
        introPoints: ['Guest rating 8.9/10', 'Rooftop infinity pool और पास में public beach', 'Studios, sea-view rooms और two-bedroom apartments'],
        serviceText: 'Anstay team द्वारा guest support',
        factsTitle: 'त्वरित जानकारी',
        factsSubtitle: 'बुकिंग से पहले जरूरी बातें',
        facts: ['Opened: 2025', 'Renovated: 2026', 'Rooms: 40', 'Phone: +84 384 945 614', 'Area: Bai Chay, Ha Long, Quang Ninh', 'Check-in: 14:00 - 22:00', 'Check-out: 12:00 से पहले', 'Front desk: रोज 07:00 - 22:00'],
        amenitiesKicker: 'सुविधाएं',
        amenitiesTitle: 'मुख्य सुविधाएं और सेवाएं',
        amenitiesSubtitle: 'वे सुविधाएं जिनके बारे में guest सबसे ज्यादा पूछते हैं',
        amenities: ['Indoor pool', 'Rooftop infinity pool', 'Public beach', 'Sauna', 'Gym', 'Free public parking', 'Free luggage storage', 'Bar', 'Restaurant', 'Cafe', 'Karaoke', 'Taxi booking', 'Car और bicycle rental', 'Meeting room', 'Kids club', 'Public areas में free Wi-Fi'],
        highlightsKicker: 'मुख्य बातें',
        highlightsTitle: 'Anstay Marina Hotel Ha Long क्यों चुनें?',
        features: [
            { title: 'आसान location', description: 'Halong Marina Square, Hung Thang Beach और nearby seaside leisure areas तक पैदल जाना आसान है।' },
            { title: 'अच्छी कीमत, साफ कमरे', description: 'Guests fair pricing, नए rooms और short Ha Long trips के लिए clean stay की तारीफ करते हैं।' },
            { title: 'Rooftop pool', description: 'Rooftop pool, infinity pool और lounge areas stay को resort feel देते हैं।' },
            { title: 'Flexible room types', description: 'Balcony studios, sea-view executive rooms और two-bedroom apartments उपलब्ध हैं।' },
        ],
        roomsKicker: 'Rooms',
        roomsTitle: 'लोकप्रिय room choices',
        roomsSubtitle: 'Available room configurations का छोटा overview',
        rooms: [
            { name: 'Studio with Balcony', details: '1 double bed, लगभग 30 sqm, floors 3-6, balcony और free Wi-Fi.' },
            { name: 'Sea View Executive King', details: '1 queen bed, लगभग 40 sqm, 2 guests के लिए उपयुक्त, free Wi-Fi.' },
            { name: 'Sea View Executive Twin', details: '1 single bed और 1 double bed, लगभग 40 sqm, friends या small family के लिए उपयुक्त.' },
            { name: 'Two-Bedroom City View Suite', details: '2 bedrooms, लगभग 60 sqm, 4 guests तक के लिए उपयुक्त.' },
            { name: 'Two-Bedroom Apartment with Sea View', details: '2 queen beds, लगभग 63 sqm, family या 4-person group के लिए उपयुक्त.' },
        ],
        locationKicker: 'Location',
        locationTitle: 'Hotel के आसपास',
        locationSubtitle: 'Nearby places और transport connections',
        locationItems: ['Golfzon Ha Long: लगभग 130 m', 'Halong Marina Square: लगभग 160 m', 'Hung Thang Beach: लगभग 200 m', 'BIM Group Ha Long Beach: लगभग 220 m', 'Halo Bay Show: लगभग 840 m', 'Sealife Legend Cruise Ha Long Center: लगभग 1.2 km', 'Tuan Chau Island: लगभग 3.4 km', 'Sun World Ha Long और Dragon Park: लगभग 5 km', 'Ha Long Station: लगभग 6 km', 'Cat Bi Airport: लगभग 39.9 km', 'Van Don Airport: लगभग 66 km'],
        policyKicker: 'Policies',
        policyTitle: 'Stay information',
        policies: ['Host या staff arrival पर guests का स्वागत करेंगे।', 'Check-in instructions के लिए arrival से एक दिन पहले property से संपर्क करें और जरूरत होने पर ID, expected arrival time या flight details दें।', 'हर उम्र के बच्चे welcome हैं। Extra bed या crib fees room type पर निर्भर करती है।', 'Buffet breakfast में Asian और local cuisine होता है, 06:00 से 10:00 तक served. Adults लगभग VND 200,000/person, 17 साल और उससे कम बच्चों के लिए लगभग VND 180,000/person.', 'VND 1,000,000 deposit required है और property policy के अनुसार check-out day पर refund होता है।', 'Pets और service animals allowed नहीं हैं।', 'Main check-in guest कम से कम 18 साल का होना चाहिए।'],
        bannerText: 'Anstay से direct booking करने पर rooms, views, breakfast, check-in requests और stay needs पर तेज support मिलता है।',
        faqKicker: 'FAQ',
        faqTitle: 'अक्सर पूछे जाने वाले सवाल',
        faqSubtitle: 'Anstay Marina Hotel Ha Long book करते समय उपयोगी जानकारी',
        faqs: [
            { q: 'Check-in और check-out time क्या है?', a: 'Check-in 14:00 से 22:00 तक है। Check-out 12:00 से पहले है।' },
            { q: 'क्या hotel में swimming pool है?', a: 'हाँ। Hotel में indoor pool, rooftop pool, infinity pool और view वाला pool area है।' },
            { q: 'क्या pets allowed हैं?', a: 'नहीं। Pets और service animals allowed नहीं हैं।' },
            { q: 'क्या breakfast available है?', a: 'हाँ। Buffet breakfast 06:00 - 10:00 तक served होता है, जिसमें Asian और local dishes हैं। Room package के अनुसार fee लग सकती है।' },
            { q: 'Airport से hotel कितनी दूर है?', a: 'Cat Bi Airport लगभग 39.9 km और Van Don Airport लगभग 66 km दूर है।' },
        ],
        finalKicker: 'Anstay Booking',
        finalTitle: 'Anstay Marina Hotel Ha Long में stay करने के लिए ready हैं?',
        finalSubtitle: 'Dates और guest count भेजें, Anstay rooms, prices और suitable offers check करेगा।',
    },
};

const amenityIcons: LucideIcon[] = [
    Waves,
    Waves,
    Waves,
    Sparkles,
    Dumbbell,
    Car,
    Bell,
    ConciergeBell,
    Utensils,
    Building2,
    Sparkles,
    Car,
    Car,
    Building2,
    BedDouble,
    Wifi,
];

const featureIcons: LucideIcon[] = [MapPin, WalletCards, Waves, BedDouble];

const About: React.FC<AboutProps> = ({ className }) => {
    const { language } = useTranslation();
    const [openFaqId, setOpenFaqId] = useState<string>('faq-0');
    const c = content[language] || content.vi;
    const bookingCtaPath = '/booking';
    const contactCtaPath = '/contact';
    const amenities: IconItem[] = c.amenities.map((name, index) => ({
        icon: amenityIcons[index] || BadgeCheck,
        name,
    }));
    const features: FeatureItem[] = c.features.map((feature, index) => ({
        icon: featureIcons[index] || BadgeCheck,
        ...feature,
    }));
    const faqs: FaqItem[] = c.faqs.map((faq, index) => ({
        id: `faq-${index}`,
        ...faq,
    }));

    const toggleFaq = (id: string) => {
        setOpenFaqId(currentId => (currentId === id ? '' : id));
    };

    return (
        <div className={`about-container ${className || ''}`} data-no-localize>
            <Helmet>
                <title>{c.seoTitle}</title>
                <meta name="description" content={c.seoDescription} />
                <meta name="keywords" content={c.seoKeywords} />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <meta name="author" content="ANSTAY" />
                <meta name="geo.position" content="20.9590;107.0436" />
                <meta name="geo.region" content="VN-QN" />
                <meta name="geo.placename" content="Hạ Long, Quảng Ninh, Việt Nam" />
                <meta property="og:locale" content={language === 'vi' ? 'vi_VN' : 'en_US'} />
                <meta property="og:title" content={c.seoTitle} />
                <meta property="og:description" content={c.seoDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SEO_URL} />
                <meta property="og:site_name" content="ANSTAY" />
                <meta property="og:image" content={SEO_IMAGE} />
                <meta property="og:image:alt" content="Anstay Marina Hotel Ha Long" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={c.seoTitle} />
                <meta name="twitter:description" content={c.seoDescription} />
                <meta name="twitter:image" content={SEO_IMAGE} />
                <link rel="canonical" href={SEO_URL} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Hotel',
                        name: 'Anstay Marina Hotel Ha Long',
                        image: SEO_IMAGE,
                        description: c.seoDescription,
                        url: SEO_URL,
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: '5 Maria Square, Khu phố đi',
                            addressLocality: 'Hạ Long',
                            addressRegion: 'Quảng Ninh',
                            postalCode: '01100',
                            addressCountry: 'VN',
                        },
                        telephone: '+84-384-945-614',
                        priceRange: '$$',
                        starRating: {
                            '@type': 'Rating',
                            ratingValue: '8.9',
                        },
                        amenityFeature: c.amenities.map(amenity => ({
                            '@type': 'LocationFeatureSpecification',
                            name: amenity,
                        })),
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.q,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.a,
                            },
                        })),
                    })}
                </script>
            </Helmet>

            <section className="about-hero" aria-labelledby="about-hero-title">
                <img className="about-hero__image" src={marinaShowcaseImages.hero} alt="" aria-hidden="true" loading="eager" decoding="async" />
                <div className="about-hero__overlay" />
                <div className="about-hero__inner">
                    <p className="about-eyebrow">{c.heroEyebrow}</p>
                    <h1 id="about-hero-title">{c.heroTitle}</h1>
                    <p className="about-hero__managed">{c.heroManaged}</p>
                    <p className="about-hero__location">
                        <MapPin size={20} aria-hidden="true" />
                        <span>{c.heroLocation}</span>
                    </p>
                    <div className="about-hero__actions">
                        <Link to={bookingCtaPath} className="about-button about-button--primary" aria-label={c.bookingCta}>
                            <CalendarCheck2 size={19} aria-hidden="true" />
                            <span>{c.bookingCta}</span>
                        </Link>
                        <Link to={contactCtaPath} className="about-button about-button--glass" aria-label={c.contactCta}>
                            <PhoneCall size={19} aria-hidden="true" />
                            <span>{c.contactCta}</span>
                        </Link>
                    </div>
                </div>
            </section>

            <main className="about-content">
                <section className="about-section about-intro" aria-labelledby="about-intro-title">
                    <div className="about-intro__copy">
                        <p className="about-section-kicker">{c.introKicker}</p>
                        <h2 id="about-intro-title">{c.introTitle}</h2>
                        <p className="about-intro__text">{c.introText}</p>

                        <div className="about-intro__points">
                            {c.introPoints.map((point, index) => {
                                const Icon = [BadgeCheck, Waves, BedDouble][index] || BadgeCheck;
                                return (
                                    <div className="about-intro__point" key={point}>
                                        <span>
                                            <Icon size={20} aria-hidden="true" />
                                        </span>
                                        <p>{point}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="about-intro__media">
                        <img
                            src={marinaShowcaseImages.intro}
                            alt="Phòng Studio Anstay Marina Hotel Ha Long"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="about-intro__media-card" aria-label={c.serviceText}>
                            <ConciergeBell size={22} aria-hidden="true" />
                            <span>{c.serviceText}</span>
                        </div>
                    </div>
                </section>

                <section className="about-section about-facts" aria-labelledby="about-facts-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.introKicker}</p>
                        <h2 id="about-facts-title">{c.factsTitle}</h2>
                        <p>{c.factsSubtitle}</p>
                    </div>
                    <div className="facts-grid">
                        {c.facts.map((fact) => (
                            <article className="fact-card" key={fact}>
                                <BadgeCheck size={20} aria-hidden="true" />
                                <span>{fact}</span>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section about-amenities" aria-labelledby="about-amenities-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.amenitiesKicker}</p>
                        <h2 id="about-amenities-title">{c.amenitiesTitle}</h2>
                        <p>{c.amenitiesSubtitle}</p>
                    </div>
                    <div className="amenities-grid">
                        {amenities.map(({ icon: Icon, name }) => (
                            <article className="amenity-card" key={name}>
                                <div className="amenity-card__icon">
                                    <Icon size={22} aria-hidden="true" />
                                </div>
                                <h3>{name}</h3>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section about-highlights" aria-labelledby="about-highlights-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.highlightsKicker}</p>
                        <h2 id="about-highlights-title">{c.highlightsTitle}</h2>
                    </div>
                    <div className="features-grid">
                        {features.map(({ icon: Icon, title, description }) => (
                            <article className="feature-card" key={title}>
                                <div className="feature-card__icon">
                                    <Icon size={26} aria-hidden="true" />
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section about-rooms" aria-labelledby="about-rooms-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.roomsKicker}</p>
                        <h2 id="about-rooms-title">{c.roomsTitle}</h2>
                        <p>{c.roomsSubtitle}</p>
                    </div>
                    <div className="rooms-grid">
                        {c.rooms.map((room, index) => (
                            <article className="room-card" key={room.name}>
                                <img
                                    src={marinaAboutRoomImages[index % marinaAboutRoomImages.length]}
                                    alt={room.name}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="room-card__body">
                                    <BedDouble size={24} aria-hidden="true" />
                                    <h3>{room.name}</h3>
                                    <p>{room.details}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-banner" aria-label={c.locationTitle}>
                    <img src={marinaShowcaseImages.banner} alt="Suite hai phòng ngủ tại Anstay Marina Hotel Ha Long" loading="lazy" decoding="async" />
                    <div className="about-banner__content">
                        <BadgeCheck size={22} aria-hidden="true" />
                        <span>{c.bannerText}</span>
                    </div>
                </section>

                <section className="about-section about-location" aria-labelledby="about-location-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.locationKicker}</p>
                        <h2 id="about-location-title">{c.locationTitle}</h2>
                        <p>{c.locationSubtitle}</p>
                    </div>
                    <div className="location-list">
                        {c.locationItems.map((item) => (
                            <article className="location-item" key={item}>
                                <MapPin size={19} aria-hidden="true" />
                                <span>{item}</span>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section about-policy" aria-labelledby="about-policy-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.policyKicker}</p>
                        <h2 id="about-policy-title">{c.policyTitle}</h2>
                    </div>
                    <div className="policy-list">
                        {c.policies.map((policy) => (
                            <article className="policy-item" key={policy}>
                                <ShieldCheck size={20} aria-hidden="true" />
                                <p>{policy}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-section faq-section" aria-labelledby="faq-title">
                    <div className="about-section-heading">
                        <p className="about-section-kicker">{c.faqKicker}</p>
                        <h2 id="faq-title">{c.faqTitle}</h2>
                        <p>{c.faqSubtitle}</p>
                    </div>

                    <div className="faq-list">
                        {faqs.map(faq => {
                            const isOpen = openFaqId === faq.id;

                            return (
                                <article className={`faq-card ${isOpen ? 'is-open' : ''}`} key={faq.id}>
                                    <h3>
                                        <button
                                            id={`${faq.id}-question`}
                                            type="button"
                                            className="faq-question"
                                            aria-expanded={isOpen}
                                            aria-controls={`${faq.id}-answer`}
                                            onClick={() => toggleFaq(faq.id)}
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown size={20} aria-hidden="true" />
                                        </button>
                                    </h3>

                                    <div
                                        id={`${faq.id}-answer`}
                                        className="faq-answer"
                                        role="region"
                                        aria-labelledby={`${faq.id}-question`}
                                        aria-hidden={!isOpen}
                                    >
                                        <p>{faq.a}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="about-final-cta" aria-labelledby="about-final-cta-title">
                    <div>
                        <p className="about-section-kicker">{c.finalKicker}</p>
                        <h2 id="about-final-cta-title">{c.finalTitle}</h2>
                        <p>{c.finalSubtitle}</p>
                    </div>
                    <div className="about-final-cta__actions">
                        <Link to={bookingCtaPath} className="about-button about-button--sand" aria-label={c.bookingCta}>
                            <CalendarCheck2 size={19} aria-hidden="true" />
                            <span>{c.bookingCta}</span>
                        </Link>
                        <Link to={contactCtaPath} className="about-button about-button--outline" aria-label={c.contactCta}>
                            <PhoneCall size={19} aria-hidden="true" />
                            <span>{c.contactCta}</span>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
