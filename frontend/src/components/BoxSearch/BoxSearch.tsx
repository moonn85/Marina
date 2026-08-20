import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./BoxSearch.css";
import { trackEvent } from "../../utils/analytics";
import { useTranslation } from "@/localization";
registerLocale("vi", vi);

type DateFieldButtonProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
};

type LowestPriceResponse = {
  lowestPrice?: number | null;
  currencyCode?: string;
};

const formatDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (date: Date | null): string => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getNightCount = (
  checkIn: Date,
  checkOut: Date,
): number => {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.round(
    diffMs / (1000 * 60 * 60 * 24),
  );

  return Math.max(1, diffDays);
};

const getExelyLowestPriceUrl = (): string => {
  const apiBase =
    import.meta.env.VITE_API_URL ??
    "http://localhost:8080/api/v1";

  const origin = apiBase
    .replace(/\/api\/v1\/?$/, "")
    .replace(/\/$/, "");

  return `${origin}/api/exely/lowest-price`;
};

const formatCurrencyFromApi = (
  amount: number,
  currencyCode: string,
): string => {
  if (!Number.isFinite(amount)) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currencyCode || "VND",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, "");
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

  const { t } = useTranslation("home");
  const navigate = useNavigate();

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

  const [lowestPriceLabel, setLowestPriceLabel] =
    useState<string | null>(null);

  const [isLoadingLowestPrice, setIsLoadingLowestPrice] =
    useState(false);

  const [lowestPriceError, setLowestPriceError] =
    useState(false);

  const handleSearch = useCallback(() => {
    if (!checkInDate || !checkOutDate) {
      alert(t("home.search.requiredDates", "Vui lòng chọn ngày nhận và trả phòng."));
      return;
    }

    if (checkOutDate <= checkInDate) {
      alert(t("home.search.invalidDates", "Ngày trả phòng phải sau ngày nhận phòng."));
      return;
    }

    const nights = getNightCount(
      checkInDate,
      checkOutDate,

    );

    const queryParams = new URLSearchParams({
      date: formatDateInput(checkInDate),
      nights: nights.toString(),
      adults: guestCount.toString(),
    }).toString();

    navigate(`/booking/?${queryParams}`);
  }, [
    checkInDate,
    checkOutDate,
    guestCount,
    navigate,
    t,
  ]);

  const fetchLowestPrice = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!checkInDate || !checkOutDate) {
        setLowestPriceLabel(null);
        return;
      }

      if (checkOutDate <= checkInDate) {
        setLowestPriceLabel(null);
        return;
      }

      const endpoint = new URL(
        getExelyLowestPriceUrl(),
      );

      endpoint.searchParams.set(
        "checkIn",
        formatDateInput(checkInDate),
      );

      endpoint.searchParams.set(
        "checkOut",
        formatDateInput(checkOutDate),
      );

      endpoint.searchParams.set(
        "adults",
        guestCount.toString(),
      );

      setIsLoadingLowestPrice(true);
      setLowestPriceError(false);
      setLowestPriceLabel(null);

      try {
        const response = await fetch(
          endpoint.toString(),
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Lowest price API failed: ${response.status}`,
          );
        }

        const data =
          (await response.json()) as LowestPriceResponse;

        // Không lấy được giá KHÔNG có nghĩa là hết phòng.
        // Khi không có giá hợp lệ, trả nút về trạng thái "Tìm phòng".
        if (
          typeof data.lowestPrice !== "number" ||
          !Number.isFinite(data.lowestPrice) ||
          data.lowestPrice <= 0
        ) {
          setLowestPriceLabel(null);
          return;
        }

        const formattedPrice =
          formatCurrencyFromApi(
            data.lowestPrice,
            data.currencyCode || "VND",
          );

        // Format giá lỗi thì cũng chỉ quay về "Tìm phòng".
        if (!formattedPrice) {
          setLowestPriceLabel(null);
          return;
        }

        setLowestPriceLabel(formattedPrice);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to fetch Exely lowest price:",
          error,
        );

        // API lỗi vẫn cho khách bấm tìm phòng bình thường.
        setLowestPriceError(true);
        setLowestPriceLabel(null);
      } finally {
        if (!signal?.aborted) {
          setIsLoadingLowestPrice(false);
        }
      }
    },
    [
      checkInDate,
      checkOutDate,
      guestCount,
    ],
  );

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      return;
    }

    if (checkOutDate <= checkInDate) {
      return;
    }

    const controller = new AbortController();

    // Debounce để tránh gọi API liên tục khi khách đổi lựa chọn.
    const timeoutId = window.setTimeout(() => {
      void fetchLowestPrice(controller.signal);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    checkInDate,
    checkOutDate,
    guestCount,
    fetchLowestPrice, t,
  ]);

  const handleSearchClick = (): void => {
    trackEvent("click_search(box)_room", {
      button_location: "search_box",
      button_text:
        lowestPriceLabel ?? t("home.search.searchButton", "Tìm phòng"),
    });

    handleSearch();
  };

  const buttonLabel = isLoadingLowestPrice
    ? t(
      "home.search.checkingPrice",
      "Đang kiểm tra giá...",
    )
    : lowestPriceError
      ? t(
        "home.search.searchButton",
        "Tìm phòng",
      )
      : lowestPriceLabel ??
      t(
        "home.search.searchButton",
        "Tìm phòng",
      );

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
          locale="vi"
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
          locale="vi"
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
        className={`search-button1${lowestPriceLabel
          ? " search-button1--price"
          : ""
          }`}
        onClick={handleSearchClick}
        type="button"
        disabled={isLoadingLowestPrice}
        data-prefix={t(
          "home.search.priceFrom",
          "Chỉ từ",
        )}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default BoxSearch;