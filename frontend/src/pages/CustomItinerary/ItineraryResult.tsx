import React from 'react';
import { useTranslation } from "@/localization";
import './ItineraryResult.css';

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  icon?: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface Hotel {
  name: string;
  address: string;
  description?: string;
  mapUrl: string;
}

interface ItineraryData {
  days: Day[];
  hotel: Hotel;
  summary?: string;
  destinationCity?: string;
  mapRegion?: string;
}

interface ItineraryResultProps {
  itinerary: ItineraryData;
  lang: string;
  onClose?: () => void;
}

// Helper function để lấy translation với fallback
const getTranslation = (t: (key: string) => string, key: string, fallback: string): string => {
  const value = t(key);
  if (!value || value === key || value.startsWith('result.') || value.startsWith('form.')) {
    return fallback;
  }
  return value;
};

// Format day title based on language
const formatDayTitle = (dayNumber: number, lang: string): string => {
  if (lang === 'zh') {
    return `第${dayNumber}天`;
  }
  if (lang === 'ko') {
    return `${dayNumber}일차`;
  }
  if (lang === 'en') {
    return `Day ${dayNumber}`;
  }
  return `Ngày ${dayNumber}`;
};

const ItineraryResult: React.FC<ItineraryResultProps> = ({ itinerary, lang, onClose }) => {
  const { t } = useTranslation('customItinerary');
  const mapRegion = itinerary.mapRegion || `${itinerary.destinationCity || 'Hạ Long'}, Việt Nam`;

  const getDefaultIcon = (activityType: string): string => {
    const lower = activityType.toLowerCase();
    if (lower.includes('ăn') || lower.includes('eat') || lower.includes('food') || lower.includes('식사') || lower.includes('用餐')) {
      return 'bi-egg-fried';
    }
    if (lower.includes('thăm') || lower.includes('visit') || lower.includes('tour') || lower.includes('방문') || lower.includes('参观')) {
      return 'bi-camera';
    }
    if (lower.includes('nghỉ') || lower.includes('rest') || lower.includes('hotel') || lower.includes('휴식') || lower.includes('休息')) {
      return 'bi-house-door';
    }
    if (lower.includes('di chuyển') || lower.includes('transport') || lower.includes('move') || lower.includes('이동') || lower.includes('交通')) {
      return 'bi-car-front';
    }
    return 'bi-geo-alt';
  };

  return (
    <div className="itinerary-result-container">
      {onClose && (
        <button className="itinerary-close-btn" onClick={onClose} title="Đóng">
          <i className="bi bi-x-lg"></i>
        </button>
      )}

      <div className="itinerary-header">
        <h2 className="itinerary-title">
          <i className="bi bi-calendar-week"></i>
          <span>{getTranslation(t, 'result.title', 'Lịch trình của bạn')}</span>
        </h2>
        {itinerary.summary && (
          <p className="itinerary-summary">{itinerary.summary}</p>
        )}
      </div>

      {/* Hotel Section */}
      <div className="itinerary-hotel-card">
        <div className="hotel-header">
          <i className="bi bi-building-fill hotel-icon"></i>
          <h3 className="hotel-title">{itinerary.hotel.name}</h3>
        </div>
        <p className="hotel-address">
          <i className="bi bi-geo-alt-fill"></i>
          <span>{itinerary.hotel.address}</span>
        </p>
        {itinerary.hotel.description && (
          <p className="hotel-description">{itinerary.hotel.description}</p>
        )}
        <a
          href={itinerary.hotel.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hotel-map-link"
        >
          <i className="bi bi-pin-map-fill"></i>
          <span>{getTranslation(t, 'result.viewMap', 'Xem trên bản đồ')}</span>
        </a>
      </div>

      {/* Days Section */}
      <div className="itinerary-days">
        {itinerary.days.map((day) => (
          <div key={day.day} className="itinerary-day-card">
            <div className="day-header">
              <div className="day-number">{day.day}</div>
              <h3 className="day-title">{formatDayTitle(day.day, lang)}</h3>
            </div>

            <div className="day-activities">
              {day.activities && day.activities.length > 0 ? (
                day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="activity-item">
                    <div className="activity-time">
                      <i className="bi bi-clock"></i>
                      <span>{activity.time}</span>
                    </div>
                    <div className="activity-content">
                      <div className="activity-icon-wrapper">
                        <i className={`bi ${activity.icon || getDefaultIcon(activity.title)}`}></i>
                      </div>
                      <div className="activity-details">
                        <h4 className="activity-title">{activity.title}</h4>
                        {activity.location && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.location}, ${mapRegion}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="activity-location-link"
                          >
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{activity.location}</span>
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        )}
                        {activity.description && (
                          <p className="activity-description">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-activities">{getTranslation(t, 'result.noActivities', 'Chưa có hoạt động')}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="itinerary-actions">
        <button className="btn-book-now" onClick={() => window.location.href = '/booking'}>
          <i className="bi bi-calendar-check"></i>
          <span>{getTranslation(t, 'result.bookNow', 'Đặt phòng ngay')}</span>
        </button>
      </div>
    </div>
  );
};

export default ItineraryResult;
