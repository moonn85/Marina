import React, {
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS, hi, ko, ru, vi, zhCN } from "date-fns/locale";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./BoxSearch.css";
import { trackEvent } from "../../utils/analytics";
import { useTranslation } from "@/localization";
registerLocale("vi", vi);
registerLocale("en", enUS);
registerLocale("ko", ko);
registerLocale("zh", zhCN);
registerLocale("ru", ru);
registerLocale("hi", hi);

type DateFieldButtonProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
};

const formatDateDisplay = (date: Date | null): string => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const DateFieldButton =
  forwardRef<HTMLButtonElement, DateFieldButtonProps>(
    ({ icon, label, value, onClick }, ref) => (
      <button
        ref={ref}
        type="button"
        className="date-field-button"
        onClick={onClick}
      >
        <span className="search-icon">{icon}</span>

        <span className="search-item-copy">
          <span className="search-item-label">
            {label}
          </span>

          <span className="search-item-value">
            {value}
          </span>
        </span>
      </button>
    ),
  );

DateFieldButton.displayName = "DateFieldButton";

const BoxSearch = () => {

  const { t, language } = useTranslation("home");

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const tomorrow = useMemo(() => {
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay;
  }, [today]);

  const [checkInDate, setCheckInDate] =
    useState<Date | null>(today);

  const [checkOutDate, setCheckOutDate] =
    useState<Date | null>(tomorrow);

  const [guestCount, setGuestCount] = useState(2);

  const handleSearch = useCallback(() => {
    if (!checkInDate || !checkOutDate) {
      alert(t("home.search.requiredDates", "Vui lòng chọn ngày nhận và trả phòng."));
      return;
    }

    if (checkOutDate <= checkInDate) {
      alert(t("home.search.invalidDates", "Ngày trả phòng phải sau ngày nhận phòng."));
      return;
    }

    window.location.assign(
      "/booking/?hotel_id=512866",
    );
  }, [
    checkInDate,
    checkOutDate,
    t,
  ]);

  const buttonLabel = t("home.search.searchButton", "Tìm phòng");

  const handleSearchClick = (): void => {
    trackEvent("click_search(box)_room", {
      button_location: "search_box",
      button_text: buttonLabel,
    });

    handleSearch();
  };

  return (
    <div className="boxsearch-wrapper">
      <div className="search-item search-date">
        <DatePicker
          selected={checkInDate}
          onChange={(date: Date | null) => {
            setCheckInDate(date);

            if (
              date &&
              checkOutDate &&
              checkOutDate <= date
            ) {
              const nextDay = new Date(date);
              nextDay.setDate(
                nextDay.getDate() + 1,
              );

              setCheckOutDate(nextDay);
            }
          }}
          minDate={today}
          locale={language}
          dateFormat="dd/MM/yyyy"
          customInput={
            <DateFieldButton
              icon={<FaCalendarAlt />}
              label={t("home.search.checkin", "Ngày nhận phòng")}
              value={formatDateDisplay(
                checkInDate,
              )}
            />
          }
          popperPlacement="top-start"
        />
      </div>

      <div className="search-item search-date">
        <DatePicker
          selected={checkOutDate}
          onChange={(date: Date | null) => {
            setCheckOutDate(date);
          }}
          minDate={
            checkInDate
              ? new Date(
                checkInDate.getTime() + 86_400_000,
              )
              : tomorrow
          }
          locale={language}
          dateFormat="dd/MM/yyyy"
          customInput={
            <DateFieldButton
              icon={<FaCalendarAlt />}
              label={t("home.search.checkout", "Ngày trả phòng")}
              value={formatDateDisplay(
                checkOutDate,
              )}
            />
          }
          popperPlacement="top-start"
        />
      </div>

      <div className="search-item search-guests">
        <FaUser className="search-icon" />

        <div className="search-item-copy search-item-copy--guests">
          <span className="search-item-label">
            {t("home.search.guests", "Số khách")}
          </span>

          <span className="search-item-value">
            {guestCount} {t("home.search.guestUnit", "khách")}
          </span>
        </div>

        <div className="counter-box-content">
          <button
            className="counter-btn"
            onClick={() => {
              setGuestCount((previousCount) =>
                Math.max(1, previousCount - 1),
              );
            }}
            type="button"
            disabled={guestCount <= 1}
            aria-label={t("home.search.decreaseGuests", "Giảm số khách")}
          >
            -
          </button>

          <button
            className="counter-btn"
            onClick={() => {
              setGuestCount(
                (previousCount) =>
                  previousCount + 1,
              );
            }}
            type="button"
            aria-label={t("home.search.increaseGuests", "Tăng số khách")}
          >
            +
          </button>
        </div>
      </div>

      <button
        className="search-button1"
        onClick={handleSearchClick}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default BoxSearch;
