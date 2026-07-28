import { useState } from "react";
import { Building2, Home, ShieldCheck } from "lucide-react";
import "./FormQr.css";
import FormQr from "./FormQr";
import FormQrMarina from "./FormQrMarina";

type HotelKey = "" | "alc" | "marina";

type HotelOption = {
  value: Exclude<HotelKey, "">;
  label: string;
  description: string;
  Icon: typeof Home;
};

type HotelSelectorProps = {
  value: HotelKey;
  onChange: (value: Exclude<HotelKey, "">) => void;
};

const hotelOptions: HotelOption[] = [
  {
    value: "alc",
    label: "Anstay Residence by A La Carte Hạ Long",
    description: "Căn hộ A La Carte / A La Carte residence",
    Icon: Home,
  },
  {
    value: "marina",
    label: "Anstay Marina Hotel Ha Long",
    description: "Khách sạn Marina / Marina hotel",
    Icon: Building2,
  },
];

const HotelSelector = ({ value, onChange }: HotelSelectorProps) => (
  <section className="alc-hotel-selector" aria-labelledby="alc-hotel-selector-title">
    <div className="alc-section-title alc-hotel-selector-title">
      <h3 id="alc-hotel-selector-title">
        Chọn khách sạn đang ở / Select current hotel <b>*</b>
      </h3>
      <div />
    </div>

    <div className="alc-hotel-options" aria-label="Chọn khách sạn đang ở">
      {hotelOptions.map(({ value: optionValue, label, description, Icon }) => (
        <button
          key={optionValue}
          type="button"
          className={value === optionValue ? "is-selected" : ""}
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
        >
          <Icon size={24} />
          <strong>{label}</strong>
          <span>{description}</span>
        </button>
      ))}
    </div>

    {!value && (
      <p className="alc-hotel-required">
        Vui lòng chọn khách sạn đang ở để nhập thông tin / Please select your current hotel to continue.
      </p>
    )}
  </section>
);

const Checkin = () => {
  const [selectedHotel, setSelectedHotel] = useState<HotelKey>("");

  const hotelSelection = (
    <HotelSelector value={selectedHotel} onChange={setSelectedHotel} />
  );

  if (selectedHotel === "alc") {
    return <FormQr hotelSelection={hotelSelection} />;
  }

  if (selectedHotel === "marina") {
    return <FormQrMarina hotelSelection={hotelSelection} />;
  }

  return (
    <main className="alc-page">
      <section className="alc-shell">
        <aside className="alc-hero alc-hero--checkin">
          <div className="alc-brand">
            <img src="/pictures/LogoAnstay.webp" alt="ANSTAY" />
            <span>ANSTAY online check-in</span>
          </div>

          <div className="alc-hero-copy">
            <div className="alc-kicker">
              <ShieldCheck size={18} />
              Online check-in
            </div>
            <h1>Thông tin nhận phòng</h1>
            <p>
              Chọn đúng khách sạn đang lưu trú để mở biểu mẫu check-in phù hợp.
            </p>
          </div>

          <div className="alc-step-list">
            <div className="is-active">
              <span>1</span>
              <div>
                <strong>Khách sạn / Hotel</strong>
                <small>Chọn nơi đang ở / Select current hotel</small>
              </div>
            </div>
            <div>
              <span>2</span>
              <div>
                <strong>Giấy tờ / Documents</strong>
                <small>Upload hoặc chụp ảnh / Upload or take photo</small>
              </div>
            </div>
            <div>
              <span>3</span>
              <div>
                <strong>Hoàn tất / Complete</strong>
                <small>Gửi cho lễ tân ANSTAY / Send to ANSTAY team</small>
              </div>
            </div>
          </div>
        </aside>

        <section className="alc-form">
          {hotelSelection}

          <div className="alc-checkin-locked">
            <ShieldCheck size={30} />
            <strong>Chọn khách sạn để bắt đầu / Select a hotel to start</strong>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Checkin;
