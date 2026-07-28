import { useState, useEffect } from "react";
import { DatePicker, Input, Select, Spin, message } from "antd";
import { useTranslation } from "@/localization";
import "./CustomItinerary.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import dayjs, { Dayjs } from "dayjs";
import ItineraryResult from "./ItineraryResult";

const { RangePicker } = DatePicker;

type SupportedLang = "vi" | "en" | "ko" | "zh" | "ru" | "hi";
type SupportedCity = "Hạ Long" | "Hải Phòng";

const cityOptionsBase: SupportedCity[] = ["Hạ Long", "Hải Phòng"];

const cityLabels: Record<SupportedCity, Record<SupportedLang, string>> = {
  "Hạ Long": {
    vi: "Hạ Long",
    en: "Ha Long",
    ko: "하롱",
    zh: "下龙",
    ru: "Халонг",
    hi: "हा लॉन्ग",
  },
  "Hải Phòng": {
    vi: "Hải Phòng",
    en: "Hai Phong",
    ko: "하이퐁",
    zh: "海防",
    ru: "Хайфон",
    hi: "हाइफोंग",
  },
};

const destinationFallbacks: Record<
  SupportedCity,
  {
    hotel: {
      name: string;
      address: string;
      mapUrl: string;
      description: string;
    };
    mapRegion: string;
  }
> = {
  "Hạ Long": {
    hotel: {
      name: "Anstay Residence by A La Carte Hạ Long",
      address: "Khu đô thị dịch vụ Hùng Thắng, P. Hùng Thắng, Hạ Long, Quảng Ninh, Việt Nam",
      mapUrl: "https://maps.app.goo.gl/m7c3NiYsydvmaTBd8",
      description: "Căn hộ cao cấp view biển, tiện nghi đầy đủ, gần các điểm du lịch nổi bật của Hạ Long.",
    },
    mapRegion: "Hạ Long, Quảng Ninh, Việt Nam",
  },
  "Hải Phòng": {
    hotel: {
      name: "Anstay Vinhomes Vũ Yên",
      address: "Đường Tài Lộc, Thuỷ Triều, Thuỷ Nguyên, Hải Phòng, Việt Nam",
      mapUrl: "https://maps.app.goo.gl/UvFLznprBV6pvoZv9",
      description: "Căn hộ hiện đại tại Vũ Yên, phù hợp nghỉ ngơi và kết nối nhanh đến VinWonders cùng trung tâm Hải Phòng.",
    },
    mapRegion: "Hải Phòng, Việt Nam",
  },
};

const resolveDestination = (city?: string): SupportedCity =>
  city === "Hải Phòng" ? "Hải Phòng" : "Hạ Long";

// Helper function để lấy translation với fallback
const getTranslation = (t: (key: string) => string, key: string, fallback: string): string => {
  const value = t(key);
  // Nếu t() trả về chính key đó (không tìm thấy translation), dùng fallback
  if (!value || value === key || value.startsWith('form.') || value.startsWith('hero.') || value.startsWith('empty.') || value.startsWith('result.') || value.startsWith('cities.')) {
    return fallback;
  }
  return value;
};

// Transform API response to match expected structure
const transformItineraryData = (apiData: any, selectedCity?: string) => {
  const destination = resolveDestination(apiData.destinationCity || selectedCity);
  const fallback = destinationFallbacks[destination];

  // Transform days array
  const transformedDays = (apiData.days || []).map((day: any) => {
    // Handle both "itinerary" and "activities" field names
    const activitiesArray = day.itinerary || day.activities || [];

    return {
      day: day.day,
      title: '', // Leave empty - let ItineraryResult handle translation
      activities: activitiesArray.map((act: any) => ({
        time: act.time || '',
        title: act.title || act.activity || act.name || '',
        description: act.description || act.details || '',
        location: act.location || '',
        icon: act.icon || undefined,
      })),
    };
  });

  // Transform hotel
  const transformedHotel = {
    name: apiData.hotel?.name || fallback.hotel.name,
    address: apiData.hotel?.address || fallback.hotel.address,
    description: apiData.hotel?.description || fallback.hotel.description,
    mapUrl: apiData.hotel?.mapUrl || fallback.hotel.mapUrl,
  };

  return {
    days: transformedDays,
    hotel: transformedHotel,
    summary: apiData.summary || '',
    destinationCity: destination,
    mapRegion: apiData.mapRegion || fallback.mapRegion,
  };
};

// Interface cho dữ liệu itinerary theo ngôn ngữ
interface ItineraryDataByLang {
  [lang: string]: {
    tripName: string;
    cities: string[];
    startDate?: string;
    endDate?: string;
    adults: number;
    children: number;
  };
}

export default function CustomItinerary() {
  const { t, language } = useTranslation('customItinerary');
  const currentLang = language as SupportedLang;

  // State để lưu dữ liệu theo từng ngôn ngữ
  const [itineraryData, setItineraryData] = useState<ItineraryDataByLang>({
    vi: {
      tripName: t('defaultTripName', 'Kỳ nghỉ của bạn'),
      cities: [],
      adults: 2,
      children: 0,
    },
    en: {
      tripName: t('defaultTripName', 'Your Vacation'),
      cities: [],
      adults: 2,
      children: 0,
    },
    ko: {
      tripName: t('defaultTripName', '당신의 휴가'),
      cities: [],
      adults: 2,
      children: 0,
    },
    zh: {
      tripName: t('defaultTripName', '您的假期'),
      cities: [],
      adults: 2,
      children: 0,
    },
    ru: {
      tripName: t('defaultTripName', 'Ваш отпуск'),
      cities: [],
      adults: 2,
      children: 0,
    },
    hi: {
      tripName: t('defaultTripName', 'आपकी छुट्टी'),
      cities: [],
      adults: 2,
      children: 0,
    },
  });

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [itineraryResult, setItineraryResult] = useState<any>(null);
  const [customizedTripNames, setCustomizedTripNames] = useState<Record<string, boolean>>({}); // Track customized per language

  // Keep the progress indicator moving for the whole time the API request is running.
  // Starting above 0 gives users immediate feedback, while the last 10% is reserved
  // for receiving and transforming the actual itinerary response.
  useEffect(() => {
    if (!loading) return;

    setProgress((current) => (current > 0 ? current : 8));

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 90) return current;

        const increment = current < 30 ? 6 : current < 65 ? 3 : 1;
        return Math.min(current + increment, 90);
      });
    }, 500);

    return () => window.clearInterval(progressTimer);
  }, [loading]);

  // Default trip names for each language
  const defaultTripNames: Record<string, string> = {
    vi: 'Kỳ nghỉ của bạn',
    en: 'Your Vacation',
    ko: '당신의 휴가',
    zh: '您的假期',
    ru: 'Ваш отпуск',
    hi: 'आपकी छुट्टी',
  };

  // Lấy dữ liệu hiện tại theo ngôn ngữ
  const currentData = itineraryData[currentLang] || itineraryData['vi'];

  // Cập nhật tripName khi đổi ngôn ngữ (chỉ nếu chưa customize cho ngôn ngữ đó)
  useEffect(() => {
    const isCustomized = customizedTripNames[currentLang];
    if (!isCustomized) {
      const newDefaultName = defaultTripNames[currentLang] || defaultTripNames['vi'];
      setItineraryData(prev => {
        const currentLangData = prev[currentLang];
        // Chỉ update nếu chưa có tripName hoặc tripName là default của ngôn ngữ khác
        if (!currentLangData?.tripName || Object.values(defaultTripNames).includes(currentLangData.tripName)) {
          return {
            ...prev,
            [currentLang]: {
              ...(currentLangData || { cities: [], adults: 2, children: 0 }),
              tripName: newDefaultName,
            },
          };
        }
        return prev;
      });
    }
  }, [currentLang]);

  // City options với translation
  const cityOptions = cityOptionsBase.map((city) => ({
    label: cityLabels[city][currentLang] || city,
    value: city,
  }));

  const changeAdults = (delta: number) => {
    setItineraryData(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        adults: Math.max(1, (prev[currentLang]?.adults || 2) + delta),
      },
    }));
  };

  const changeChildren = (delta: number) => {
    setItineraryData(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        children: Math.max(0, (prev[currentLang]?.children || 0) + delta),
      },
    }));
  };

  const handleTripNameChange = (value: string) => {
    // Cho phép xóa (value = '') - không mark là customized
    // Chỉ mark customized khi user nhập giá trị khác default và không rỗng
    const currentDefault = defaultTripNames[currentLang] || defaultTripNames['vi'];
    const isCustomized = value !== '' && value !== currentDefault;

    setCustomizedTripNames(prev => ({
      ...prev,
      [currentLang]: isCustomized,
    }));

    setItineraryData(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        tripName: value,
      },
    }));
  };

  const handleCitiesChange = (cities: string[]) => {
    setItineraryData(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        cities,
      },
    }));
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setDateRange(dates);
      // Format date as YYYY-MM-DD to avoid timezone issues
      const formatDateOnly = (dayjsDate: Dayjs | null) => {
        if (!dayjsDate) return undefined;
        return dayjsDate.format('YYYY-MM-DD');
      };
      setItineraryData(prev => ({
        ...prev,
        [currentLang]: {
          ...prev[currentLang],
          startDate: formatDateOnly(dates[0]),
          endDate: formatDateOnly(dates[1]),
        },
      }));
    }
  };

  const handleSubmit = async () => {
    // Validate form
    console.log('=== Form Submit ===');
    console.log('currentData:', currentData);
    console.log('dateRange:', dateRange);

    if (!currentData.cities || currentData.cities.length === 0) {
      message.warning(getTranslation(t, 'form.validation.selectCity', 'Vui lòng chọn thành phố'));
      return;
    }

    if (!dateRange[0] || !dateRange[1]) {
      message.warning(getTranslation(t, 'form.validation.selectDate', 'Vui lòng chọn thời gian'));
      return;
    }

    // Xóa kết quả cũ trước khi tạo mới
    setItineraryResult(null);

    setProgress(8);
    setLoading(true);

    try {
      // Lấy base URL và đảm bảo không có trailing slash hoặc /api/v1
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      API_URL = API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
      const endpoint = `${API_URL}/api/v1/custom-itinerary/generate`;

      const payload = {
        tripName: currentData.tripName,
        cities: currentData.cities,
        startDate: currentData.startDate,
        endDate: currentData.endDate,
        adults: currentData.adults,
        children: currentData.children,
        lang: currentLang,
      };

      // Debug: Tính số ngày ở frontend
      if (currentData.startDate && currentData.endDate) {
        const start = new Date(currentData.startDate);
        const end = new Date(currentData.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const calculatedDays = diffDays + 1;
        console.log('Frontend date calculation:', {
          startDate: currentData.startDate,
          endDate: currentData.endDate,
          diffDays,
          calculatedDays,
        });
      }

      console.log('API Endpoint:', endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to generate itinerary';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        console.error('API Error:', errorMessage);

        // Provide specific guidance for common errors
        if (errorMessage.toLowerCase().includes('chatgpt') || errorMessage.toLowerCase().includes('api is not configured')) {
          throw new Error('Backend ChatGPT API chưa được cấu hình. Vui lòng liên hệ admin.');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API Result:', result);

      // Complete progress
      setProgress(100);

      if (result.itinerary) {
        try {
          // Transform API response to match expected structure
          const transformedItinerary = transformItineraryData(result.itinerary, currentData.cities[0]);
          console.log('Transformed Itinerary:', transformedItinerary);

          // Small delay to show 100% before hiding
          await new Promise(resolve => setTimeout(resolve, 450));

          setItineraryResult(transformedItinerary);

          // Scroll to result
          setTimeout(() => {
            const resultElement = document.getElementById('itinerary-result');
            if (resultElement) {
              resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);

          message.success(getTranslation(t, 'form.success', 'Tạo lịch trình thành công!'));
        } catch (transformError: any) {
          console.error('Error transforming itinerary:', transformError);
          message.error('Lỗi xử lý dữ liệu: ' + transformError.message);
        }
      } else {
        console.error('No itinerary in response:', result);
        console.error('Response structure:', JSON.stringify(result, null, 2));
        message.error('Không nhận được lịch trình từ server. Vui lòng kiểm tra console để biết chi tiết.');
      }
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      message.error(error.message || getTranslation(t, 'form.error', 'Có lỗi xảy ra. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Header />
      <main className="ci-page">
        <section className="ci-hero">
          <div className="ci-hero-image" />
          <div className="ci-hero-overlay" />
          <div className="ci-hero-content">
            <h1 className="ci-title">
              {getTranslation(t, 'hero.title', 'Đặt tên cho kỳ nghỉ')}{" "}
              <span className="ci-editable-title">{currentData.tripName}</span>
            </h1>
            <p className="ci-subtitle">
              {getTranslation(t, 'hero.subtitle', 'Tự tay tạo hành trình nghỉ dưỡng hoàn hảo theo sở thích của bạn.')}
            </p>
          </div>
        </section>

        <section className="ci-form-section">
          <div className="ci-form-card">
            <div className="ci-form-row ci-form-row-name">
              <div className="ci-form-label ci-form-label-center">
                {getTranslation(t, 'form.tripName.label', 'TÊN KỲ NGHỈ')}
              </div>
              <Input
                value={currentData.tripName}
                onChange={(e) => handleTripNameChange(e.target.value)}
                placeholder={getTranslation(t, 'form.tripName.placeholder', 'Kỳ nghỉ của bạn')}
                size="large"
                className="ci-input-center"
              />
            </div>

            <div className="ci-form-row ci-form-row-2col">
              <div className="ci-form-group">
                <div className="ci-form-label ci-form-label-center">
                  {getTranslation(t, 'form.cities.label', 'THÀNH PHỐ')}
                </div>
                <Select
                  allowClear
                  options={cityOptions}
                  value={currentData.cities[0]}
                  onChange={(value) => handleCitiesChange(value ? [value] : [])}
                  placeholder={getTranslation(t, 'form.cities.placeholder', 'Nhập tên thành phố')}
                  size="large"
                  className="ci-city-select"
                  suffixIcon={<i className="bi bi-chevron-down"></i>}
                />
              </div>

              <div className="ci-form-group">
                <div className="ci-form-label ci-form-label-center">
                  {getTranslation(t, 'form.dateRange.label', 'THỜI GIAN')}
                </div>
                <RangePicker
                  size="large"
                  format="DD/MM/YYYY"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="ci-date-range"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder={[
                    getTranslation(t, 'form.dateRange.start', 'Ngày bắt đầu'),
                    getTranslation(t, 'form.dateRange.end', 'Ngày kết thúc')
                  ]}
                  separator="→"
                />
              </div>
            </div>

            <div className="ci-form-row ci-form-row-bottom">
              <div className="ci-form-group">
                <div className="ci-form-label ci-form-label-center">
                  {getTranslation(t, 'form.adults.label', 'NGƯỜI LỚN')}
                </div>
                <div className="ci-counter">
                  <button
                    type="button"
                    className="ci-counter-btn"
                    onClick={() => changeAdults(-1)}
                    aria-label="Decrease adults"
                  >
                    -
                  </button>
                  <span className="ci-counter-value">{currentData.adults}</span>
                  <button
                    type="button"
                    className="ci-counter-btn"
                    onClick={() => changeAdults(1)}
                    aria-label="Increase adults"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="ci-form-group">
                <div className="ci-form-label ci-form-label-center">
                  {getTranslation(t, 'form.children.label', 'TRẺ EM')}
                </div>
                <div className="ci-counter">
                  <button
                    type="button"
                    className="ci-counter-btn"
                    onClick={() => changeChildren(-1)}
                    aria-label="Decrease children"
                  >
                    -
                  </button>
                  <span className="ci-counter-value">{currentData.children}</span>
                  <button
                    type="button"
                    className="ci-counter-btn"
                    onClick={() => changeChildren(1)}
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="ci-form-group ci-form-group-submit">
                <button
                  type="button"
                  className="ci-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spin size="small" style={{ marginRight: 8 }} />
                      {getTranslation(t, 'form.generating', 'Đang tạo lịch trình...')}
                    </>
                  ) : (
                    getTranslation(t, 'form.submit', 'Xem gợi ý hành trình')
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {itineraryResult ? (
          <section id="itinerary-result" className="ci-result-section">
            <ItineraryResult
              itinerary={itineraryResult}
              lang={currentLang}
              onClose={() => setItineraryResult(null)}
            />
          </section>
        ) : loading ? (
          <section className="ci-loading-section">
            <div className="ci-loading-card">
              <div className="ci-loading-icon">
                <i className="bi bi-magic"></i>
              </div>
              <h2 className="ci-loading-title">
                {getTranslation(t, 'loading.title', 'Đang tạo lịch trình của bạn...')}
              </h2>
              <p className="ci-loading-subtitle">
                {getTranslation(t, 'loading.subtitle', 'Anstay đang phân tích và tạo lịch trình phù hợp nhất')}
              </p>
              <div className="ci-progress-container">
                <div
                  className="ci-progress-bar"
                  role="progressbar"
                  aria-label={getTranslation(t, 'loading.title', 'Đang tạo lịch trình của bạn...')}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <div
                    className="ci-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="ci-progress-text">{Math.round(progress)}%</span>
              </div>
              <div className="ci-loading-steps">
                <div className={`ci-step ${progress >= 20 ? 'active' : ''}`}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{getTranslation(t, 'loading.step1', 'Phân tích yêu cầu')}</span>
                </div>
                <div className={`ci-step ${progress >= 50 ? 'active' : ''}`}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{getTranslation(t, 'loading.step2', 'Tìm kiếm địa điểm')}</span>
                </div>
                <div className={`ci-step ${progress >= 80 ? 'active' : ''}`}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{getTranslation(t, 'loading.step3', 'Tạo lịch trình')}</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="ci-empty-section">
            <div className="ci-empty-card">
              <h2>{getTranslation(t, 'empty.title', 'Nhập thành phố để bắt đầu xây dựng hành trình!')}</h2>
              <p>
                {getTranslation(t, 'empty.description', 'Anstay sẽ gợi ý lịch trình, điểm tham quan và nơi lưu trú phù hợp nhất với nhu cầu của bạn.')}
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
