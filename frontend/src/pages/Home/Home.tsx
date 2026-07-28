import { Link } from "react-router-dom";
import { useTranslation, type LocalLanguage } from "@/localization";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CalendarCheck2,
  Car,
  Clock,
  Coffee,
  Dumbbell,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Star,
  Utensils,
  Users,
  Waves,
  Wifi,
} from "lucide-react";

import "./Home.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useScrollReveal } from "../../hooks/useScrollReveal";

import Tilt from 'react-parallax-tilt';
import { OceanBackground } from "../../components/OceanBackground/OceanBackground";
import {
  marinaHeroImages,
  marinaRoomImages,
  marinaShowcaseImages,
} from "../../data/marinaImages";

import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";

type RoomCard = {
  name: string;
  description: string;
};

type BookingField = {
  label: string;
  value: string;
  helper: string;
};

type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroArea: string;
  bookingCta: string;
  aboutCta: string;
  contactCta: string;
  bookingSummaryLabel: string;
  priceLabel: string;
  priceValue: string;
  priceCaption: string;
  bookingFields: BookingField[];
  stats: Array<{ value: string; label: string }>;
  introKicker: string;
  introTitle: string;
  introText: string;
  highlights: Array<{ title: string; description: string }>;
  amenitiesKicker: string;
  amenitiesTitle: string;
  amenitiesSubtitle: string;
  amenities: string[];
  roomsKicker: string;
  roomsTitle: string;
  roomsSubtitle: string;
  rooms: RoomCard[];
  locationKicker: string;
  locationTitle: string;
  locationText: string;
  nearby: string[];
  reviewKicker: string;
  reviewTitle: string;
  reviews: Array<{ quote: string; name: string }>;
  finalKicker: string;
  finalTitle: string;
  finalSubtitle: string;
};

const content: Record<LocalLanguage, HomeContent> = {
  vi: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "Kỳ nghỉ mới tại Bãi Cháy, Hạ Long",
    heroSubtitle:
      "Khách sạn khai trương năm 2026 tại Halong Marina, gần bãi biển công cộng, quảng trường Marina và các điểm vui chơi nổi bật của Hạ Long.",
    heroArea: "Halong Marina, Bãi Cháy",
    bookingCta: "Đặt phòng ngay",
    aboutCta: "Xem giới thiệu",
    contactCta: "Liên hệ tư vấn",
    bookingSummaryLabel: "Tóm tắt đặt phòng",
    priceLabel: "Giá tham khảo hôm nay",
    priceValue: "Từ 757.979₫",
    priceCaption: "Tổng từ 818.617₫ đã gồm thuế & phí",
    bookingFields: [
      { label: "Nhận phòng", value: "14:00 - 22:00", helper: "Có nhân viên đón tiếp" },
      { label: "Trả phòng", value: "Trước 12:00", helper: "Thủ tục nhanh gọn" },
      { label: "Khách", value: "2 - 4 khách", helper: "Studio, executive, căn hộ" },
      { label: "Bữa sáng", value: "Buffet tùy chọn", helper: "Từ 200.000₫/người" },
    ],
    stats: [
      { value: "9,9/10", label: "Đánh giá của khách" },
      { value: "20", label: "Phòng lưu trú" },
      { value: "2026", label: "Năm khai trương" },
      { value: "200m", label: "Đến bãi biển" },
    ],
    introKicker: "Lưu trú tại Marina",
    introTitle: "Sạch đẹp, giá hợp lý, thuận tiện khám phá Hạ Long",
    introText:
      "Anstay Marina Hotel Ha Long phù hợp cho cặp đôi, gia đình và nhóm bạn cần một nơi ở mới, dễ di chuyển, có bể bơi tầng thượng, tiện ích đầy đủ và đội ngũ hỗ trợ lưu trú rõ ràng từ Anstay.",
    highlights: [
      {
        title: "Gần biển và quảng trường",
        description:
          "Đi bộ nhanh đến bãi biển Hùng Thắng, quảng trường Halong Marina và các khu vui chơi ven biển.",
      },
      {
        title: "Bể bơi vô cực tầng thượng",
        description:
          "Không gian thư giãn trên cao với bể bơi sân thượng, hồ bơi có tầm nhìn và khu lounge.",
      },
      {
        title: "Nhiều hạng phòng",
        description:
          "Studio ban công, phòng executive view biển và căn hộ 2 phòng ngủ cho gia đình hoặc nhóm.",
      },
    ],
    amenitiesKicker: "Tiện nghi",
    amenitiesTitle: "Dịch vụ cần có cho một kỳ nghỉ gọn nhẹ",
    amenitiesSubtitle:
      "Các tiện ích được khách quan tâm nhất khi đặt phòng tại Anstay Marina Hotel Ha Long.",
    amenities: [
      "Bể bơi trong nhà",
      "Bể bơi vô cực tầng thượng",
      "Bãi biển công cộng",
      "Phòng gym",
      "Phòng xông hơi",
      "Nhà hàng",
      "Cà phê",
      "Bar",
      "Wi-Fi miễn phí",
      "Đậu xe miễn phí",
      "Nơi để hành lý miễn phí",
      "Dịch vụ đặt taxi",
    ],
    roomsKicker: "Hạng phòng",
    roomsTitle: "Chọn phòng theo đúng nhu cầu",
    roomsSubtitle: "8 hạng phòng tại Anstay Marina Hotel Ha Long, đều có Wi-Fi miễn phí, điều hòa, phòng tắm riêng và minibar.",
    rooms: [
      {
        name: "Phòng Deluxe 2 Giường Đơn",
        description: "1 giường đơn và 1 giường đôi nhỏ • 35 m² • Tầng 5 • Không có cửa sổ.",
      },
      {
        name: "Sea View Executive Twin",
        description: "1 giường đơn và 1 giường đôi • 40 m² • Tầng 5 • Hướng biển.",
      },
      {
        name: "Studio có ban công",
        description: "1 giường đôi • 30 m² • Tầng 3–6 • Ban công và cửa sổ cố định.",
      },
      {
        name: "Sea View Executive King",
        description: "1 giường queen • 40 m² • Tầng 4 và 6 • Hướng biển.",
      },
      {
        name: "Phòng Deluxe hai giường hướng phố",
        description: "Phòng hai giường • Hướng phố • TV • Không hút thuốc.",
      },
      {
        name: "Suite 2 Phòng Ngủ",
        description: "2 giường đôi trong 2 phòng ngủ • 60 m² • Tầng 7–8 • Không có cửa sổ.",
      },
      {
        name: "Phòng Studio với tầm nhìn biển một phần",
        description: "1 giường đôi • Tầm nhìn biển một phần • TV • Không hút thuốc.",
      },
      {
        name: "Two-Bedroom Apartment with Sea View",
        description: "2 giường queen trong 2 phòng ngủ • 63 m² • Tầng 7–8 • Hướng biển.",
      },
    ],
    locationKicker: "Vị trí",
    locationTitle: "Ở giữa nhịp vui chơi của Bãi Cháy",
    locationText:
      "Từ khách sạn, du khách dễ dàng kết nối đến bãi biển, quảng trường, khu mua sắm, du thuyền và các công viên giải trí Hạ Long.",
    nearby: [
      "Quảng trường Halong Marina: khoảng 160 m",
      "Bãi biển Hùng Thắng: khoảng 200 m",
      "Sealife Legend Cruise Hạ Long Center: khoảng 1,2 km",
      "Đảo Tuần Châu: khoảng 3,4 km",
      "Sun World Hạ Long và Dragon Park: khoảng 5 km",
      "Ga Hạ Long: khoảng 6 km",
    ],
    reviewKicker: "Đánh giá",
    reviewTitle: "Khách lưu trú thường nhắc đến",
    reviews: [
      { quote: "Giá cả phù hợp và sạch đẹp.", name: "Dương" },
      {
        quote:
          "Giường to, thiết bị đầy đủ và mới, nhân viên thân thiện, giá cả phải chăng.",
        name: "Lai Ly Van",
      },
      {
        quote:
          "Phòng sạch sẽ, thoáng mát, khách sạn khá mới, nhân viên nhiệt tình.",
        name: "THI NGUYET VU",
      },
    ],
    finalKicker: "Đặt phòng Anstay",
    finalTitle: "Sẵn sàng đặt Anstay Marina Hotel Ha Long?",
    finalSubtitle:
      "Gửi ngày lưu trú và số lượng khách để Anstay kiểm tra phòng, giá tốt và ưu đãi phù hợp.",
  },
  en: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "A fresh stay in Bai Chay, Ha Long",
    heroSubtitle:
      "Opened in 2026 in Halong Marina, close to the public beach, Marina Square and Ha Long's key leisure spots.",
    heroArea: "Halong Marina, Bai Chay",
    bookingCta: "Book now",
    aboutCta: "View about",
    contactCta: "Contact us",
    bookingSummaryLabel: "Booking summary",
    priceLabel: "Today's guide price",
    priceValue: "From 757,979₫",
    priceCaption: "Total from 818,617₫ including taxes and fees",
    bookingFields: [
      { label: "Check-in", value: "14:00 - 22:00", helper: "Hosted arrival support" },
      { label: "Check-out", value: "Before 12:00", helper: "Fast front-desk process" },
      { label: "Guests", value: "2 - 4 guests", helper: "Studios, executive rooms, apartments" },
      { label: "Breakfast", value: "Optional buffet", helper: "From 200,000₫/person" },
    ],
    stats: [
      { value: "9.9/10", label: "Guest rating" },
      { value: "20", label: "Rooms" },
      { value: "2026", label: "Opening year" },
      { value: "200m", label: "To the beach" },
    ],
    introKicker: "Stay at Marina",
    introTitle: "Clean, good value and easy for exploring Ha Long",
    introText:
      "Anstay Marina Hotel Ha Long is suited to couples, families and friends looking for a new hotel with easy access, a rooftop pool, essential facilities and clear guest support from Anstay.",
    highlights: [
      {
        title: "Near the beach and square",
        description:
          "Walk quickly to Hung Thang Beach, Halong Marina Square and nearby seaside leisure areas.",
      },
      {
        title: "Rooftop infinity pool",
        description:
          "A relaxing high-floor space with a rooftop pool, view pool and lounge area.",
      },
      {
        title: "Flexible room types",
        description:
          "Balcony studios, sea-view executive rooms and two-bedroom apartments for families or groups.",
      },
    ],
    amenitiesKicker: "Amenities",
    amenitiesTitle: "The essentials for an easy stay",
    amenitiesSubtitle:
      "Facilities guests ask about most often when booking Anstay Marina Hotel Ha Long.",
    amenities: [
      "Indoor pool",
      "Rooftop infinity pool",
      "Public beach",
      "Gym",
      "Sauna",
      "Restaurant",
      "Cafe",
      "Bar",
      "Free Wi-Fi",
      "Free parking",
      "Free luggage storage",
      "Taxi booking",
    ],
    roomsKicker: "Rooms",
    roomsTitle: "Choose the room that fits your trip",
    roomsSubtitle: "Eight room types at Anstay Marina Hotel Ha Long, all with free Wi-Fi, air conditioning, a private bathroom and minibar.",
    rooms: [
      {
        name: "Deluxe Twin Room",
        description: "1 single bed and 1 small double bed • 35 sqm • Floor 5 • No window.",
      },
      {
        name: "Sea View Executive Twin",
        description: "1 single bed and 1 double bed • 40 sqm • Floor 5 • Sea view.",
      },
      {
        name: "Studio with Balcony",
        description: "1 double bed • 30 sqm • Floors 3–6 • Balcony and fixed window.",
      },
      {
        name: "Sea View Executive King",
        description: "1 queen bed • 40 sqm • Floors 4 and 6 • Sea view.",
      },
      {
        name: "Deluxe Twin Room with City View",
        description: "Twin room • City view • TV • Non-smoking.",
      },
      {
        name: "Two-Bedroom Suite",
        description: "2 double beds in 2 bedrooms • 60 sqm • Floors 7–8 • No window.",
      },
      {
        name: "Studio with Partial Ocean View",
        description: "1 double bed • Partial ocean view • TV • Non-smoking.",
      },
      {
        name: "Two-Bedroom Apartment with Sea View",
        description: "2 queen beds in 2 bedrooms • 63 sqm • Floors 7–8 • Sea view.",
      },
    ],
    locationKicker: "Location",
    locationTitle: "In the middle of Bai Chay's leisure rhythm",
    locationText:
      "From the hotel, guests can easily connect to beaches, squares, shopping, cruises and Ha Long amusement parks.",
    nearby: [
      "Halong Marina Square: about 160 m",
      "Hung Thang Beach: about 200 m",
      "Sealife Legend Cruise Ha Long Center: about 1.2 km",
      "Tuan Chau Island: about 3.4 km",
      "Sun World Ha Long and Dragon Park: about 5 km",
      "Ha Long Station: about 6 km",
    ],
    reviewKicker: "Reviews",
    reviewTitle: "What guests often mention",
    reviews: [
      { quote: "Good price and clean rooms.", name: "Duong" },
      {
        quote:
          "Large bed, complete new equipment, friendly staff and reasonable prices.",
        name: "Lai Ly Van",
      },
      {
        quote:
          "Clean, airy room, quite a new hotel and enthusiastic staff.",
        name: "THI NGUYET VU",
      },
    ],
    finalKicker: "Anstay Booking",
    finalTitle: "Ready to book Anstay Marina Hotel Ha Long?",
    finalSubtitle:
      "Send your stay dates and guest count so Anstay can check rooms, good prices and suitable offers.",
  },
  ko: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "하롱 바이짜이의 새로운 휴식",
    heroSubtitle:
      "2026년 Halong Marina에 오픈한 호텔로 공용 해변, Marina Square, 하롱의 주요 즐길 거리와 가깝습니다.",
    heroArea: "Halong Marina, 바이짜이",
    bookingCta: "예약하기",
    aboutCta: "소개 보기",
    contactCta: "문의하기",
    bookingSummaryLabel: "예약 요약",
    priceLabel: "오늘 참고 요금",
    priceValue: "757,979₫부터",
    priceCaption: "세금 및 수수료 포함 총 818,617₫부터",
    bookingFields: [
      { label: "체크인", value: "14:00 - 22:00", helper: "직원이 도착을 도와드립니다" },
      { label: "체크아웃", value: "12:00 전", helper: "빠른 프런트 절차" },
      { label: "투숙객", value: "2 - 4명", helper: "스튜디오, executive, 아파트" },
      { label: "조식", value: "선택형 뷔페", helper: "1인 200,000₫부터" },
    ],
    stats: [
      { value: "9.9/10", label: "투숙객 평점" },
      { value: "20", label: "객실" },
      { value: "2026", label: "오픈 연도" },
      { value: "200m", label: "해변까지" },
    ],
    introKicker: "Marina에서의 숙박",
    introTitle: "깨끗하고 합리적이며 하롱 여행에 편리한 숙소",
    introText:
      "Anstay Marina Hotel Ha Long은 접근성이 좋고 루프탑 수영장, 기본 편의시설, Anstay의 명확한 투숙 지원을 원하는 커플, 가족, 친구 여행객에게 적합합니다.",
    highlights: [
      {
        title: "해변과 광장 근처",
        description:
          "Hung Thang Beach, Halong Marina Square, 주변 해변 휴식 공간까지 빠르게 이동할 수 있습니다.",
      },
      {
        title: "루프탑 인피니티 풀",
        description:
          "루프탑 수영장, 전망 수영장, 라운지 공간이 있는 고층 휴식 공간입니다.",
      },
      {
        title: "다양한 객실 타입",
        description:
          "발코니 스튜디오, 바다 전망 executive 객실, 가족과 그룹을 위한 2베드룸 아파트가 있습니다.",
      },
    ],
    amenitiesKicker: "편의시설",
    amenitiesTitle: "가볍고 편한 여행을 위한 주요 서비스",
    amenitiesSubtitle:
      "Anstay Marina Hotel Ha Long 예약 시 고객이 가장 많이 확인하는 시설입니다.",
    amenities: [
      "실내 수영장",
      "루프탑 인피니티 풀",
      "공용 해변",
      "피트니스룸",
      "사우나",
      "레스토랑",
      "카페",
      "바",
      "무료 Wi-Fi",
      "무료 주차",
      "무료 수하물 보관",
      "택시 예약",
    ],
    roomsKicker: "객실",
    roomsTitle: "여행에 맞는 객실 선택",
    roomsSubtitle: "무료 Wi-Fi, 에어컨, 전용 욕실, 미니바를 갖춘 8가지 객실 타입입니다.",
    rooms: [
      { name: "Deluxe Twin Room", description: "싱글 침대 1개와 스몰 더블 침대 1개 • 35m² • 5층 • 창문 없음." },
      { name: "Sea View Executive Twin", description: "싱글 침대 1개와 더블 침대 1개 • 40m² • 5층 • 바다 전망." },
      { name: "Studio with Balcony", description: "더블 침대 1개 • 30m² • 3–6층 • 발코니와 고정 창문." },
      { name: "Sea View Executive King", description: "퀸 침대 1개 • 40m² • 4층 및 6층 • 바다 전망." },
      { name: "Deluxe Twin Room with City View", description: "트윈룸 • 도시 전망 • TV • 금연." },
      { name: "Two-Bedroom Suite", description: "침실 2개에 더블 침대 2개 • 60m² • 7–8층 • 창문 없음." },
      { name: "Studio with Partial Ocean View", description: "더블 침대 1개 • 부분 바다 전망 • TV • 금연." },
      { name: "Two-Bedroom Apartment with Sea View", description: "침실 2개에 퀸 침대 2개 • 63m² • 7–8층 • 바다 전망." },
    ],
    locationKicker: "위치",
    locationTitle: "바이짜이 여행 동선의 중심",
    locationText:
      "호텔에서 해변, 광장, 쇼핑, 크루즈, 하롱 놀이공원까지 쉽게 이동할 수 있습니다.",
    nearby: [
      "Halong Marina Square: 약 160m",
      "Hung Thang Beach: 약 200m",
      "Sealife Legend Cruise Ha Long Center: 약 1.2km",
      "Tuan Chau Island: 약 3.4km",
      "Sun World Ha Long 및 Dragon Park: 약 5km",
      "Ha Long Station: 약 6km",
    ],
    reviewKicker: "리뷰",
    reviewTitle: "투숙객이 자주 언급한 점",
    reviews: [
      { quote: "가격이 좋고 객실이 깨끗합니다.", name: "Duong" },
      { quote: "침대가 크고 시설이 새것이며 직원이 친절하고 가격이 합리적입니다.", name: "Lai Ly Van" },
      { quote: "객실이 깨끗하고 쾌적하며 호텔이 새롭고 직원이 친절합니다.", name: "THI NGUYET VU" },
    ],
    finalKicker: "Anstay 예약",
    finalTitle: "Anstay Marina Hotel Ha Long을 예약할 준비가 되셨나요?",
    finalSubtitle:
      "숙박 날짜와 인원을 보내주시면 Anstay가 객실, 좋은 가격, 적합한 혜택을 확인해 드립니다.",
  },
  zh: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "下龙拜寨的新住宿体验",
    heroSubtitle:
      "酒店于2026年在 Halong Marina 开业，靠近公共海滩、Marina 广场和下龙主要休闲景点。",
    heroArea: "Halong Marina，拜寨",
    bookingCta: "立即预订",
    aboutCta: "查看介绍",
    contactCta: "联系咨询",
    bookingSummaryLabel: "预订摘要",
    priceLabel: "今日参考价",
    priceValue: "757,979₫起",
    priceCaption: "总价818,617₫起，含税费",
    bookingFields: [
      { label: "入住", value: "14:00 - 22:00", helper: "工作人员到店接待" },
      { label: "退房", value: "12:00前", helper: "前台快速办理" },
      { label: "住客", value: "2 - 4位", helper: "一室房、executive房、公寓" },
      { label: "早餐", value: "自助可选", helper: "200,000₫/人起" },
    ],
    stats: [
      { value: "9.9/10", label: "住客评分" },
      { value: "20", label: "客房" },
      { value: "2026", label: "开业年份" },
      { value: "200m", label: "到海滩" },
    ],
    introKicker: "入住 Marina",
    introTitle: "干净、实惠，方便探索下龙",
    introText:
      "Anstay Marina Hotel Ha Long 适合情侣、家庭和朋友入住，提供便捷位置、屋顶泳池、基础设施和 Anstay 清晰的住客支持。",
    highlights: [
      { title: "靠近海滩和广场", description: "可快速前往 Hung Thang Beach、Halong Marina Square 和附近海滨休闲区。" },
      { title: "屋顶无边泳池", description: "高层休闲空间包含屋顶泳池、景观泳池和休息区。" },
      { title: "多种房型", description: "带阳台一室房、海景 executive 房和适合家庭或团体的两卧室公寓。" },
    ],
    amenitiesKicker: "设施",
    amenitiesTitle: "轻松入住所需的主要服务",
    amenitiesSubtitle: "预订 Anstay Marina Hotel Ha Long 时住客最常关注的设施。",
    amenities: ["室内泳池", "屋顶无边泳池", "公共海滩", "健身房", "桑拿房", "餐厅", "咖啡厅", "酒吧", "免费 Wi-Fi", "免费停车", "免费行李寄存", "叫车服务"],
    roomsKicker: "房型",
    roomsTitle: "按出行需求选择房间",
    roomsSubtitle: "8种房型，均配备免费 Wi-Fi、空调、私人浴室和迷你吧。",
    rooms: [
      { name: "豪华双床房", description: "1张单人床和1张小双人床 • 35平方米 • 5楼 • 无窗。" },
      { name: "海景 Executive Twin", description: "1张单人床和1张双人床 • 40平方米 • 5楼 • 海景。" },
      { name: "带阳台一室房", description: "1张双人床 • 30平方米 • 3–6楼 • 阳台和固定窗。" },
      { name: "海景 Executive King", description: "1张 queen 床 • 40平方米 • 4楼和6楼 • 海景。" },
      { name: "城市景观豪华双床房", description: "双床房 • 城市景观 • 电视 • 禁烟。" },
      { name: "两卧室套房", description: "两间卧室各有1张双人床 • 60平方米 • 7–8楼 • 无窗。" },
      { name: "部分海景一室房", description: "1张双人床 • 部分海景 • 电视 • 禁烟。" },
      { name: "海景两卧室公寓", description: "两间卧室各有1张 queen 床 • 63平方米 • 7–8楼 • 海景。" },
    ],
    locationKicker: "位置",
    locationTitle: "位于拜寨休闲动线中心",
    locationText: "从酒店可便捷前往海滩、广场、购物区、游船和下龙主题乐园。",
    nearby: ["Halong Marina Square：约160米", "Hung Thang Beach：约200米", "Sealife Legend Cruise Ha Long Center：约1.2公里", "团洲岛：约3.4公里", "Sun World Ha Long 和 Dragon Park：约5公里", "下龙站：约6公里"],
    reviewKicker: "评价",
    reviewTitle: "住客经常提到",
    reviews: [
      { quote: "价格合适，房间干净漂亮。", name: "Duong" },
      { quote: "床很大，设备齐全且较新，员工友好，价格合理。", name: "Lai Ly Van" },
      { quote: "房间干净通风，酒店很新，员工热情。", name: "THI NGUYET VU" },
    ],
    finalKicker: "Anstay 预订",
    finalTitle: "准备预订 Anstay Marina Hotel Ha Long 吗？",
    finalSubtitle: "发送入住日期和人数，Anstay 将为您确认房间、好价和合适优惠。",
  },
  ru: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "Новый отдых в Бай Чай, Халонг",
    heroSubtitle:
      "Отель открыт в 2026 году в Halong Marina, рядом с общественным пляжем, Marina Square и главными зонами отдыха Халонга.",
    heroArea: "Halong Marina, Бай Чай",
    bookingCta: "Забронировать",
    aboutCta: "Подробнее",
    contactCta: "Связаться",
    bookingSummaryLabel: "Кратко о бронировании",
    priceLabel: "Ориентировочная цена сегодня",
    priceValue: "От 757 979₫",
    priceCaption: "Итого от 818 617₫, включая налоги и сборы",
    bookingFields: [
      { label: "Заезд", value: "14:00 - 22:00", helper: "Встреча гостя на месте" },
      { label: "Выезд", value: "До 12:00", helper: "Быстрое оформление" },
      { label: "Гости", value: "2 - 4 гостя", helper: "Студии, executive, апартаменты" },
      { label: "Завтрак", value: "Шведский стол по желанию", helper: "От 200 000₫/чел." },
    ],
    stats: [
      { value: "9.9/10", label: "Оценка гостей" },
      { value: "20", label: "Номеров" },
      { value: "2026", label: "Год открытия" },
      { value: "200m", label: "До пляжа" },
    ],
    introKicker: "Проживание в Marina",
    introTitle: "Чисто, выгодно и удобно для знакомства с Халонгом",
    introText:
      "Anstay Marina Hotel Ha Long подходит парам, семьям и друзьям, которым нужен новый отель с удобным доступом, бассейном на крыше, нужными удобствами и понятной поддержкой Anstay.",
    highlights: [
      { title: "Рядом с пляжем и площадью", description: "Быстрый доступ к Hung Thang Beach, Halong Marina Square и приморским зонам отдыха." },
      { title: "Rooftop infinity pool", description: "Высокая зона отдыха с бассейном на крыше, бассейном с видом и lounge-пространством." },
      { title: "Гибкие типы номеров", description: "Студии с балконом, executive номера с видом на море и апартаменты с 2 спальнями." },
    ],
    amenitiesKicker: "Удобства",
    amenitiesTitle: "Главные услуги для легкого отдыха",
    amenitiesSubtitle: "Удобства, о которых гости чаще всего спрашивают при бронировании.",
    amenities: ["Крытый бассейн", "Rooftop infinity pool", "Общественный пляж", "Тренажерный зал", "Сауна", "Ресторан", "Кафе", "Бар", "Бесплатный Wi-Fi", "Бесплатная парковка", "Бесплатное хранение багажа", "Заказ такси"],
    roomsKicker: "Номера",
    roomsTitle: "Выберите номер под вашу поездку",
    roomsSubtitle: "8 типов номеров с бесплатным Wi-Fi, кондиционером, собственной ванной и мини-баром.",
    rooms: [
      { name: "Deluxe Twin Room", description: "1 односпальная и 1 малая двуспальная кровать • 35 м² • 5 этаж • Без окна." },
      { name: "Sea View Executive Twin", description: "1 односпальная и 1 двуспальная кровать • 40 м² • 5 этаж • Вид на море." },
      { name: "Студия с балконом", description: "1 двуспальная кровать • 30 м² • 3–6 этажи • Балкон и фиксированное окно." },
      { name: "Sea View Executive King", description: "1 кровать queen • 40 м² • 4 и 6 этажи • Вид на море." },
      { name: "Deluxe Twin Room with City View", description: "Две кровати • Вид на город • TV • Для некурящих." },
      { name: "Люкс с 2 спальнями", description: "2 двуспальные кровати в 2 спальнях • 60 м² • 7–8 этажи • Без окна." },
      { name: "Студия с частичным видом на море", description: "1 двуспальная кровать • Частичный вид на море • TV • Для некурящих." },
      { name: "Апартаменты с 2 спальнями и видом на море", description: "2 кровати queen в 2 спальнях • 63 м² • 7–8 этажи • Вид на море." },
    ],
    locationKicker: "Расположение",
    locationTitle: "В центре отдыха Бай Чай",
    locationText: "От отеля удобно добраться до пляжа, площади, магазинов, круизов и парков развлечений Халонга.",
    nearby: ["Halong Marina Square: около 160 м", "Hung Thang Beach: около 200 м", "Sealife Legend Cruise Ha Long Center: около 1,2 км", "Остров Tuan Chau: около 3,4 км", "Sun World Ha Long и Dragon Park: около 5 км", "Станция Ha Long: около 6 км"],
    reviewKicker: "Отзывы",
    reviewTitle: "Что гости часто отмечают",
    reviews: [
      { quote: "Хорошая цена и чистые красивые номера.", name: "Duong" },
      { quote: "Большая кровать, новое оборудование, дружелюбный персонал и разумная цена.", name: "Lai Ly Van" },
      { quote: "Чистый и просторный номер, отель довольно новый, персонал отзывчивый.", name: "THI NGUYET VU" },
    ],
    finalKicker: "Бронирование Anstay",
    finalTitle: "Готовы забронировать Anstay Marina Hotel Ha Long?",
    finalSubtitle: "Отправьте даты и количество гостей, чтобы Anstay проверил номера, хорошие цены и подходящие предложения.",
  },
  hi: {
    heroEyebrow: "Anstay Marina Hotel Ha Long",
    heroTitle: "Bai Chay, Ha Long में नया stay",
    heroSubtitle:
      "2026 में Halong Marina में खुला hotel, public beach, Marina Square और Ha Long के प्रमुख leisure spots के पास।",
    heroArea: "Halong Marina, Bai Chay",
    bookingCta: "अभी बुक करें",
    aboutCta: "परिचय देखें",
    contactCta: "संपर्क करें",
    bookingSummaryLabel: "बुकिंग सारांश",
    priceLabel: "आज का indicative price",
    priceValue: "757,979₫ से",
    priceCaption: "Taxes और fees सहित total 818,617₫ से",
    bookingFields: [
      { label: "Check-in", value: "14:00 - 22:00", helper: "Arrival पर staff support" },
      { label: "Check-out", value: "12:00 से पहले", helper: "Fast front-desk process" },
      { label: "Guests", value: "2 - 4 guests", helper: "Studios, executive rooms, apartments" },
      { label: "Breakfast", value: "Optional buffet", helper: "200,000₫/person से" },
    ],
    stats: [
      { value: "9.9/10", label: "Guest rating" },
      { value: "20", label: "Rooms" },
      { value: "2026", label: "Opening year" },
      { value: "200m", label: "Beach तक" },
    ],
    introKicker: "Marina में stay",
    introTitle: "Clean, good value और Ha Long explore करने में आसान",
    introText:
      "Anstay Marina Hotel Ha Long couples, families और friends के लिए अच्छा है जिन्हें नया hotel, easy access, rooftop pool, जरूरी facilities और Anstay से clear guest support चाहिए।",
    highlights: [
      { title: "Beach और square के पास", description: "Hung Thang Beach, Halong Marina Square और nearby seaside leisure areas तक जल्दी पहुंचें।" },
      { title: "Rooftop infinity pool", description: "Rooftop pool, view pool और lounge area वाला relaxing high-floor space." },
      { title: "Flexible room types", description: "Balcony studios, sea-view executive rooms और family/group के लिए two-bedroom apartments." },
    ],
    amenitiesKicker: "Amenities",
    amenitiesTitle: "Easy stay के लिए जरूरी services",
    amenitiesSubtitle: "Anstay Marina Hotel Ha Long book करते समय guests जिन facilities के बारे में सबसे ज्यादा पूछते हैं।",
    amenities: ["Indoor pool", "Rooftop infinity pool", "Public beach", "Gym", "Sauna", "Restaurant", "Cafe", "Bar", "Free Wi-Fi", "Free parking", "Free luggage storage", "Taxi booking"],
    roomsKicker: "Rooms",
    roomsTitle: "Trip के हिसाब से room चुनें",
    roomsSubtitle: "Free Wi-Fi, air conditioning, private bathroom और minibar वाले 8 room types.",
    rooms: [
      { name: "Deluxe Twin Room", description: "1 single और 1 small double bed • 35 sqm • Floor 5 • बिना window." },
      { name: "Sea View Executive Twin", description: "1 single और 1 double bed • 40 sqm • Floor 5 • Sea view." },
      { name: "Studio with Balcony", description: "1 double bed • 30 sqm • Floors 3–6 • Balcony और fixed window." },
      { name: "Sea View Executive King", description: "1 queen bed • 40 sqm • Floors 4 और 6 • Sea view." },
      { name: "Deluxe Twin Room with City View", description: "Twin room • City view • TV • Non-smoking." },
      { name: "Two-Bedroom Suite", description: "2 bedrooms में 2 double beds • 60 sqm • Floors 7–8 • बिना window." },
      { name: "Studio with Partial Ocean View", description: "1 double bed • Partial ocean view • TV • Non-smoking." },
      { name: "Two-Bedroom Apartment with Sea View", description: "2 bedrooms में 2 queen beds • 63 sqm • Floors 7–8 • Sea view." },
    ],
    locationKicker: "Location",
    locationTitle: "Bai Chay leisure area के बीच",
    locationText: "Hotel से beaches, squares, shopping, cruises और Ha Long amusement parks तक पहुंचना आसान है।",
    nearby: ["Halong Marina Square: लगभग 160 m", "Hung Thang Beach: लगभग 200 m", "Sealife Legend Cruise Ha Long Center: लगभग 1.2 km", "Tuan Chau Island: लगभग 3.4 km", "Sun World Ha Long और Dragon Park: लगभग 5 km", "Ha Long Station: लगभग 6 km"],
    reviewKicker: "Reviews",
    reviewTitle: "Guests अक्सर क्या कहते हैं",
    reviews: [
      { quote: "Good price और clean rooms.", name: "Duong" },
      { quote: "Large bed, complete new equipment, friendly staff और reasonable prices.", name: "Lai Ly Van" },
      { quote: "Clean, airy room, hotel नया है और staff enthusiastic है.", name: "THI NGUYET VU" },
    ],
    finalKicker: "Anstay बुकिंग",
    finalTitle: "Anstay Marina Hotel Ha Long book करने के लिए ready हैं?",
    finalSubtitle: "Stay dates और guest count भेजें, Anstay rooms, good prices और suitable offers check करेगा।",
  },
};

const amenityIcons = [Waves, Waves, Waves, Dumbbell, Waves, Utensils, Coffee, Coffee, Wifi, Car, ShieldCheck, Car];

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; 'aria-labelledby'?: string; 'aria-label'?: string; id?: string; as?: React.ElementType }> = ({ children, className = '', as: Component = 'section', ...props }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <Component ref={ref} className={`${className} reveal ${isVisible ? 'active' : ''}`} {...props}>
      {children}
    </Component>
  );
};

const Home: React.FC = () => {
  const { language } = useTranslation("home");
  const c = content[language] || content.vi;
  const bookingIcons = [CalendarCheck2, Clock, Users, Coffee];
  const rateIcons = [BedDouble, CalendarCheck2, Waves];

  return (
    <div className="main-home marina-home" data-no-localize>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <OceanBackground />
        <div className="home-hero__image-slider">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            className="home-swiper-container"
          >
            {marinaHeroImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img className="home-hero__image" src={img} alt="" aria-hidden="true" fetchPriority={idx === 0 ? "high" : "auto"} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="home-hero__overlay" />
        <div className="home-hero__content home-hero__layout">
          <div className="home-hero__copy">
            <p className="home-eyebrow">{c.heroEyebrow}</p>
            <h1 id="home-hero-title">{c.heroTitle}</h1>
            <p className="home-hero__subtitle">{c.heroSubtitle}</p>
            <div className="home-hero__badges">
              <span>
                <Star size={17} fill="currentColor" aria-hidden="true" />
                {c.stats[0].value} · {c.stats[0].label}
              </span>
              <span>
                <MapPin size={17} aria-hidden="true" />
                {c.heroArea}
              </span>
              <span>
                <BadgeCheck size={17} aria-hidden="true" />
                {c.stats[2].label}: {c.stats[2].value}
              </span>
            </div>
            <div className="home-hero__actions">
              <Link to="/booking" className="home-button home-button--primary">
                <CalendarCheck2 size={19} aria-hidden="true" />
                <span>{c.bookingCta}</span>
              </Link>
              <Link to="/about" className="home-button home-button--glass">
                <span>{c.aboutCta}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="home-rate-card" aria-label={c.bookingSummaryLabel}>
            <div className="home-rate-card__score">
              <span className="home-rate-card__score-icon">
                <Star size={24} fill="currentColor" aria-hidden="true" />
              </span>
              <div className="home-rate-card__score-copy">
                <strong>{c.stats[0].value}</strong>
                <span>{c.stats[0].label}</span>
              </div>
            </div>
            <div className="home-rate-card__list">
              {c.stats.slice(1).map((stat, index) => {
                const Icon = rateIcons[index] || BadgeCheck;
                return (
                  <div className="home-rate-card__item" key={stat.label}>
                    <span className="home-rate-card__item-icon">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                );
              })}
            </div>
            <Link to="/booking" className="home-button home-button--full home-rate-card__cta">
              <CalendarCheck2 size={18} aria-hidden="true" />
              <span>{c.bookingCta}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <main className="home-main">
        <RevealSection className="home-search-strip" aria-label={c.bookingSummaryLabel}>
          <div className="home-search-strip__fields">
            {c.bookingFields.map((field, index) => {
              const Icon = bookingIcons[index] || CalendarCheck2;
              return (
                <div className="home-search-field" key={field.label}>
                  <Icon size={20} aria-hidden="true" />
                  <div>
                    <span>{field.label}</span>
                    <strong>{field.value}</strong>
                    <small>{field.helper}</small>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/booking" className="home-search-strip__cta">
            <span>{c.bookingCta}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </RevealSection>

        <RevealSection className="home-stats" aria-label="Anstay Marina Hotel Ha Long highlights">
          {c.stats.map((stat) => (
            <Tilt key={stat.label} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.2} glarePosition="all" glareBorderRadius="var(--radius-lg)">
              <article className="home-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            </Tilt>
          ))}
        </RevealSection>

        <RevealSection className="home-section home-intro" aria-labelledby="home-intro-title">
          <div className="home-intro__copy">
            <p className="home-section-kicker">{c.introKicker}</p>
            <h2 id="home-intro-title">{c.introTitle}</h2>
            <p>{c.introText}</p>
            <div className="home-highlight-list">
              {c.highlights.map((item, index) => {
                const Icon = [MapPin, Waves, BedDouble][index] || BadgeCheck;
                return (
                  <article className="home-highlight-item" key={item.title}>
                    <span>
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="home-intro__media">
            <img src={marinaShowcaseImages.intro} alt="Phòng Studio Anstay Marina Hotel Ha Long" loading="lazy" />
          </div>
        </RevealSection>

        <RevealSection className="home-section home-amenities" aria-labelledby="home-amenities-title">
          <div className="home-section-heading">
            <p className="home-section-kicker">{c.amenitiesKicker}</p>
            <h2 id="home-amenities-title">{c.amenitiesTitle}</h2>
            <p>{c.amenitiesSubtitle}</p>
          </div>
          <div className="home-amenities-grid">
            {c.amenities.map((amenity, index) => {
              const Icon = amenityIcons[index] || BadgeCheck;
              return (
                <Tilt key={amenity} tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="var(--radius-md)">
                  <article className="home-amenity-card">
                    <Icon size={21} aria-hidden="true" />
                    <span>{amenity}</span>
                  </article>
                </Tilt>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection className="home-section home-rooms" aria-labelledby="home-rooms-title">
          <div className="home-section-heading">
            <p className="home-section-kicker">{c.roomsKicker}</p>
            <h2 id="home-rooms-title">{c.roomsTitle}</h2>
            <p>{c.roomsSubtitle}</p>
          </div>
          <div className="home-room-grid">
            {c.rooms.map((room, index) => {
              const image = marinaRoomImages[index % marinaRoomImages.length];
              return (
                <Tilt key={room.name} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.25} glareBorderRadius="var(--radius-lg)">
                  <article className="home-room-card">
                    <img src={image} alt={room.name} loading="lazy" />
                    <div className="home-room-card__body">
                      <span>0{index + 1}</span>
                      <h3>{room.name}</h3>
                      <p>{room.description}</p>
                      <Link to="/booking">
                        {c.bookingCta}
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Tilt>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection className="home-section home-location" aria-labelledby="home-location-title">
          <div className="home-location__media">
            <img src={marinaShowcaseImages.location} alt="Căn hộ hai phòng ngủ hướng biển tại Anstay Marina Hotel Ha Long" loading="lazy" />
          </div>
          <div className="home-location__copy">
            <p className="home-section-kicker">{c.locationKicker}</p>
            <h2 id="home-location-title">{c.locationTitle}</h2>
            <p>{c.locationText}</p>
            <div className="home-nearby-list">
              {c.nearby.map((item) => (
                <article className="home-nearby-item" key={item}>
                  <MapPin size={18} aria-hidden="true" />
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="home-section home-reviews" aria-labelledby="home-reviews-title">
          <div className="home-section-heading">
            <p className="home-section-kicker">{c.reviewKicker}</p>
            <h2 id="home-reviews-title">{c.reviewTitle}</h2>
          </div>
          <div className="home-review-grid">
            {c.reviews.map((review) => (
              <article className="home-review-card" key={review.name}>
                <div className="home-review-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>{review.quote}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="home-final-cta" aria-labelledby="home-final-title">
          <div>
            <p className="home-section-kicker">{c.finalKicker}</p>
            <h2 id="home-final-title">{c.finalTitle}</h2>
            <p>{c.finalSubtitle}</p>
          </div>
          <div className="home-final-cta__actions">
            <Link to="/booking" className="home-button home-button--primary">
              <CalendarCheck2 size={19} aria-hidden="true" />
              <span>{c.bookingCta}</span>
            </Link>
            <Link to="/contact" className="home-button home-button--outline">
              <PhoneCall size={19} aria-hidden="true" />
              <span>{c.contactCta}</span>
            </Link>
          </div>
        </RevealSection>
      </main>

      <ScrollToTopButton showAt={1000} />
    </div>
  );
};

export default Home;
