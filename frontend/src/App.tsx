import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Navigate, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./App.css";
// Import các component cần thiết ngay (critical)
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop/SrcollToTop";
import { AuthProvider } from "./Context/AuthContext";

// Lazy load các component không critical
const CheckoutPage = lazy(() => import("./components/checkout/CheckoutPage"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const MinibarQR = lazy(() => import("./pages/minibar/MinibarQR"));
const MenuImage = lazy(() => import("./pages/minibar/MenuImage"));
const MarinaHotelPage = lazy(() => import("./pages/MarinaHotelPage/MarinaHotelPage"));
const Checkin = lazy(() => import("./components/FormQr/Checkin"));

// Lazy load các pages
const Home = lazy(() => import("./pages/Home/Home"));
const Apartment = lazy(() => import("./components/Apartment/Apartment"));
const ApartmentDetail = lazy(() => import("./components/ApartmentDetail/ApartmentDetail"));
const Help = lazy(() => import("./components/Help/Help"));
const AboutUs = lazy(() => import("./components/AboutUs/AboutUs"));
const AboutCP = lazy(() => import("./components/AboutList/AboutCP/AboutCP"));
const AboutGCP = lazy(() => import("./components/AboutList/AboutGCP/AboutGCP"));
const OurStory = lazy(() => import("./components/AboutList/OurStory/OurStory"));
const ExploExper = lazy(() => import("./components/ExploExper/ExploExper"));
const ExploSub = lazy(() => import("./components/ExploExperSub/ExploSub"));
const DashBroad = lazy(() => import("./components/DashBroad/DashBroad"));
const Culture = lazy(() => import("./components/AboutList/Aboutculture/Culture"));
const Support = lazy(() => import("./components/Support/Support"));
const HidenPage = lazy(() => import("./pages/HidenPage/HidenPage"));
const SearchResults = lazy(() => import("./pages/SearchResults/SearchResults"));
const ApartmentList = lazy(() => import("./pages/ApartmentList/ApartmentList"));
const BookingPage = lazy(() => import("./components/BookingPage/BookingPage"));
const ApartmentRoom = lazy(() => import("./pages/ApartmentRoom/ApartmentRoom"));
const BaoMat = lazy(() => import("./pages/ChinhSach/BaoMat/BaoMat"));
const ChamSoc = lazy(() => import("./pages/ChinhSach/ChamSoc/ChamSoc"));
const HopTac = lazy(() => import("./pages/ChinhSach/HopTac/HopTac"));
const Policy = lazy(() => import("./components/Policy/Policy"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const About = lazy(() => import("./pages/About/about"));
const Booking = lazy(() => import("./components/bookroom/bookroom"));
const CustomItinerary = lazy(() => import("./pages/CustomItinerary/CustomItinerary"));
const MeVaBe = lazy(() => import("./pages/MeVaBe/MeVaBe"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Loading Component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>Đang tải...</div>
  </div>
);

// SEO Meta Tags Component
type SeoMeta = {
  title: string;
  description: string;
  keywords: string;
};

function SEOMeta() {
  const location = useLocation();

  const getMeta = () => {
    const path = location.pathname;

    const metaMap: Record<string, SeoMeta> = {
      '/': {
        title: 'Anstay Marina Hotel Ha Long - Trang web chính thức',
        description: 'Đặt phòng Anstay Marina Hotel Ha Long tại Bãi Cháy, Hạ Long. Khách sạn khai trương năm 2025, gần Halong Marina, bãi biển công cộng và bể bơi vô cực tầng thượng.',
        keywords: 'Anstay Marina Hotel Ha Long, khách sạn Bãi Cháy, khách sạn Hạ Long, Halong Marina, đặt phòng Anstay'
      },

      '/booking': {
        title: 'Đặt phòng ANSTAY Hạ Long - Trang web chính thức',
        description: 'Đặt phòng trực tiếp tại trang web chính thức của ANSTAY Hạ Long để nhận giá tốt và ưu đãi mới nhất.',
        keywords: 'đặt phòng anstay, trang web chính thức, booking anstay, khách sạn hạ long'
      },
      '/marina-hotel': {
        title: 'Anstay Marina Hotel Ha Long - Trang web chính thức',
        description: 'Thông tin nhận phòng và lưu trú tại Anstay Marina Hotel Ha Long trên trang web chính thức của ANSTAY.',
        keywords: 'Anstay Marina Hotel Ha Long, trang web chính thức, nhận phòng marina hotel'
      },
      '/checkin': {
        title: 'ANSTAY Online Check-in - Trang web chính thức',
        description: 'Chọn khách sạn đang ở và điền thông tin nhận phòng ANSTAY.',
        keywords: 'ANSTAY check in, check-in online, Anstay Marina Hotel, Anstay Residence A La Carte'
      },
      '/about': {
        title: 'Giới thiệu Anstay Marina Hotel Ha Long | Khách sạn Bãi Cháy',
        description: 'Anstay Marina Hotel Ha Long khai trương năm 2025 tại Bãi Cháy, Hạ Long, gần Halong Marina, bãi biển công cộng và bể bơi vô cực tầng thượng.',
        keywords: 'Anstay Marina Hotel Ha Long, khách sạn Bãi Cháy, khách sạn Hạ Long, Halong Marina, đặt phòng Anstay'
      },
      '/about-us/company': {
        title: 'Thông tin doanh nghiệp ANSTAY | Công ty TNHH Thương mại Dịch vụ ANSTAY',
        description: 'Thông tin pháp lý, thương hiệu, ngày thành lập, trụ sở và mã số thuế của Công ty TNHH Thương mại Dịch vụ ANSTAY.',
        keywords: 'ANSTAY, thông tin doanh nghiệp ANSTAY, Công ty TNHH Thương mại Dịch vụ ANSTAY, mã số thuế ANSTAY'
      },
      '/about-us/groupcompany': {
        title: 'Sơ đồ công ty ANSTAY | Cơ cấu tổ chức',
        description: 'Xem sơ đồ công ty và cơ cấu tổ chức của ANSTAY.',
        keywords: 'sơ đồ công ty ANSTAY, cơ cấu tổ chức ANSTAY, ANSTAY group company'
      },
      '/apartment-ha-long': {
        title: 'Căn hộ du lịch Hạ Long | Cho thuê căn hộ Hạ Long view biển - ANSTAY',
        description: 'Danh sách căn hộ du lịch Hạ Long của ANSTAY: căn hộ view biển Vịnh Hạ Long, đầy đủ tiện nghi, giá tốt, hỗ trợ đặt phòng 24/7. Đặt căn hộ Hạ Long trực tuyến ngay.',
        keywords: 'căn hộ Hạ Long, căn hộ du lịch Hạ Long, cho thuê căn hộ Hạ Long, căn hộ view biển Hạ Long, ANSTAY Hạ Long'
      },
      '/apartments/ha-long': {
        title: 'Căn hộ du lịch Hạ Long | Cho thuê căn hộ Hạ Long view biển - ANSTAY',
        description: 'Danh sách căn hộ du lịch Hạ Long của ANSTAY: căn hộ view biển Vịnh Hạ Long, đầy đủ tiện nghi, giá tốt, hỗ trợ đặt phòng 24/7. Đặt căn hộ Hạ Long trực tuyến ngay.',
        keywords: 'căn hộ Hạ Long, căn hộ du lịch Hạ Long, cho thuê căn hộ Hạ Long, căn hộ view biển Hạ Long, ANSTAY Hạ Long'
      },
      '/apartment-ha-noi': {
        title: 'Căn hộ dịch vụ Hà Nội | Cho thuê căn hộ Hà Nội ngắn ngày - ANSTAY',
        description: 'Danh sách căn hộ dịch vụ tại Hà Nội của ANSTAY: căn hộ cho thuê ngắn ngày, đầy đủ tiện nghi, vị trí trung tâm, hỗ trợ đặt phòng 24/7. Đặt căn hộ Hà Nội trực tuyến ngay.',
        keywords: 'căn hộ Hà Nội, căn hộ dịch vụ Hà Nội, cho thuê căn hộ Hà Nội, căn hộ ngắn ngày Hà Nội, ANSTAY Hà Nội'
      },
      '/apartments/ha-noi': {
        title: 'Căn hộ dịch vụ Hà Nội | Cho thuê căn hộ Hà Nội ngắn ngày - ANSTAY',
        description: 'Danh sách căn hộ dịch vụ tại Hà Nội của ANSTAY: căn hộ cho thuê ngắn ngày, đầy đủ tiện nghi, vị trí trung tâm, hỗ trợ đặt phòng 24/7. Đặt căn hộ Hà Nội trực tuyến ngay.',
        keywords: 'căn hộ Hà Nội, căn hộ dịch vụ Hà Nội, cho thuê căn hộ Hà Nội, căn hộ ngắn ngày Hà Nội, ANSTAY Hà Nội'
      },
      '/contact': {
        title: 'Contact Anstay - Get Help with Your Booking',
        description: 'Contact our support team for any questions about bookings or experiences.',
        keywords: 'contact, support, help'
      },
    };

    // Find matching meta
    for (const [route, meta] of Object.entries(metaMap)) {
      if (path === route || (route !== '/' && path.startsWith(`${route}/`))) {
        return meta;
      }
    }

    return {
      title: 'ANSTAY - Trang web chính thức | Đặt lưu trú tại Việt Nam',
      description: 'Đặt căn hộ, khách sạn và trải nghiệm du lịch tại trang web chính thức của ANSTAY.',
      keywords: 'anstay, trang web chính thức, booking, Vietnam'
    };
  };

  const meta = getMeta();

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
    </Helmet>
  );
}

function App() {
  return (
    <>
      <SEOMeta />
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Routes không có MainLayout */}
            <Route path="/alacarte-residence" element={<HidenPage />} />
            <Route path="/alacarte-residence/:apartment" element={<HidenPage />} />
            <Route path="/checkin" element={<Checkin />} />
            <Route path="/checkinalc" element={<Navigate to="/checkin" replace />} />
            <Route path="/form-qr" element={<Navigate to="/checkin" replace />} />
            <Route path="/checkinmarina" element={<Navigate to="/checkin" replace />} />
            <Route path="/marina-qr" element={<Navigate to="/checkin" replace />} />
            <Route path="/chinh-sach-bao-mat" element={<BaoMat />} />
            <Route path="/cham-soc-khach-hang" element={<ChamSoc />} />
            <Route path="/chuong-trinh-hop-tac" element={<HopTac />} />
            <Route path="/apartment-detail/:apartmentId" element={<ApartmentDetail />} />
            <Route path="/minibar" element={<MainLayout hideFooter={true} hideFloattingContactBt={true}><MenuImage /></MainLayout>} />
            <Route path="/minibar-qr" element={<MainLayout hideFooter={true} hideFloattingContactBt={true}><MinibarQR /></MainLayout>} />
            {/* Routes có MainLayout */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/policy" element={<MainLayout><Policy /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/booking" element={<MainLayout hideFooter={true}><Booking /></MainLayout>} />
            <Route path="/custom-itinerary" element={<MainLayout hideFooter={true}><CustomItinerary /></MainLayout>} />
            <Route path="/mevabe" element={<MainLayout hideHeader={true} hideFooter={true}><MeVaBe /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/booking/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
            {/* Apartment Routes */}
            <Route path="/apartment-ha-noi" element={<MainLayout><Apartment /></MainLayout>} />
            <Route path="/apartment-ha-long" element={<MainLayout><Apartment /></MainLayout>} />
            <Route path="/apartment-ha-noi/:apartmentName/view" element={<MainLayout><ApartmentDetail /></MainLayout>} />
            <Route path="/apartment-ha-long/:apartmentName/view" element={<MainLayout><ApartmentDetail /></MainLayout>} />
            <Route path="/apartment/:area/:apartmentName" element={<MainLayout><ApartmentRoom /></MainLayout>} />
            <Route path="/apartments/ha-noi" element={<MainLayout><ApartmentList /></MainLayout>} />
            <Route path="/apartments/ha-long" element={<MainLayout><ApartmentList /></MainLayout>} />
            <Route path="/apartments/:locationSlug" element={<MainLayout><ApartmentList /></MainLayout>} />

            {/* Booking Routes */}
            <Route path="/booking-page" element={<MainLayout><BookingPage /></MainLayout>} />

            {/* About Routes */}
            <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/about-us/company" element={<MainLayout><AboutCP /></MainLayout>} />
            <Route path="/about-us/groupcompany" element={<MainLayout><AboutGCP /></MainLayout>} />
            <Route path="/about-us/culture" element={<MainLayout><Culture /></MainLayout>} />
            <Route path="/about-us/our-story" element={<MainLayout><OurStory /></MainLayout>} />

            {/* Explore Routes */}
            <Route path="/explore&experience" element={<MainLayout><ExploExper /></MainLayout>} />
            <Route path="/explore&experience/:slug" element={<MainLayout><ExploSub /></MainLayout>} />

            {/* Other Routes */}
            <Route path="/help" element={<MainLayout><Help /></MainLayout>} />
            <Route path="/dashbroad" element={<MainLayout><DashBroad /></MainLayout>} />
            <Route path="/support" element={<MainLayout><Support /></MainLayout>} />
            <Route path="/search-results" element={<MainLayout><SearchResults /></MainLayout>} />
            <Route path="/marina-hotel" element={<MarinaHotelPage />} />
            <Route path="/marina-hotel/:apartment" element={<MarinaHotelPage />} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </>
  );
}

export default App;
