type AlcDoorAccess =
  | { type: "code"; value: string }
  | { type: "key-card" }
  | { type: "reception" };

type AlcRoomInfo = {
  doorAccess: AlcDoorAccess;
  wifiName?: string;
  wifiPassword: string;
};

const ALC_ROOM_INFO: Record<string, AlcRoomInfo> = {
  B516: {
    doorAccess: { type: "code", value: "737373#" },
    wifiPassword: "Anstaycamon",
  },
  B901: {
    doorAccess: { type: "code", value: "919191#" },
    wifiPassword: "Anstaycamon",
  },
  B1006: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B1114: {
    doorAccess: { type: "code", value: "919191#" },
    wifiPassword: "Anstaycamon",
  },
  A1509: {
    doorAccess: { type: "code", value: "919191#" },
    wifiName: "A La Carte hạ long",
    wifiPassword: "66668888",
  },
  A1510: { doorAccess: { type: "key-card" }, wifiPassword: "Anstaycamon" },
  B1904: {
    doorAccess: { type: "code", value: "737373#" },
    wifiPassword: "Anstaycamon",
  },
  B2006: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B2105: {
    doorAccess: { type: "code", value: "919191#" },
    wifiPassword: "Anstaycamon",
  },
  B2106: {
    doorAccess: { type: "code", value: "393939#" },
    wifiPassword: "Anstaycamon",
  },
  B2112: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B2210: {
    doorAccess: { type: "code", value: "221018#" },
    wifiPassword: "Anstaycamon",
  },
  B2806: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B2811: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B3406: {
    doorAccess: { type: "code", value: "53397647#" },
    wifiPassword: "Anstaycamon",
  },
  B3409: {
    doorAccess: { type: "code", value: "81384700#" },
    wifiPassword: "Anstaycamon",
  },
  B3509: {
    doorAccess: { type: "code", value: "61956091#" },
    wifiPassword: "Anstaycamon",
  },
  B3706: {
    doorAccess: { type: "code", value: "919191#" },
    wifiPassword: "Anstaycamon",
  },
  B708: {
    doorAccess: { type: "code", value: "171088#" },
    wifiPassword: "Anstaycamon",
  },
  B3714: {
    doorAccess: { type: "reception" },
    wifiName: "hatrinh",
    wifiPassword: "hatrinh535142",
  },
  A907: { doorAccess: { type: "key-card" }, wifiPassword: "66668888" },
  B902: {
    doorAccess: { type: "code", value: "929292#" },
    wifiPassword: "Anstaycamon",
  },
  B1008: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "Anstaycamon",
  },
  B1503: { doorAccess: { type: "key-card" }, wifiPassword: "Anstaycamon" },
  B1807: {
    doorAccess: { type: "key-card" },
    wifiName: "B1807",
    wifiPassword: "18070707",
  },
  B1906: {
    doorAccess: { type: "code", value: "55555888#" },
    wifiPassword: "Anstaycamon",
  },
  B2114: {
    doorAccess: { type: "reception" },
    wifiPassword: "13681368",
  },
  A2203: {
    doorAccess: { type: "code", value: "54274656#" },
    wifiPassword: "0766102886",
  },
  A2208: { doorAccess: { type: "key-card" }, wifiPassword: "Anstaycamon" },
  A2604: { doorAccess: { type: "key-card" }, wifiPassword: "66668888" },
  B2205: {
    doorAccess: { type: "code", value: "27051975#" },
    wifiPassword: "Anstaycamon",
  },
  B2401: {
    doorAccess: { type: "code", value: "060908#" },
    wifiPassword: "20082014",
  },
  B2415: {
    doorAccess: { type: "code", value: "060606#" },
    wifiPassword: "Anstaycamon",
  },
  B2506: {
    doorAccess: { type: "code", value: "250114#" },
    wifiPassword: "Anstaycamon",
  },
  B2610: {
    doorAccess: { type: "code", value: "280801#" },
    wifiName: "Chanchan’s homestay",
    wifiPassword: "camonquykhach",
  },
  B2812: {
    doorAccess: { type: "code", value: "27887343#" },
    wifiName: "bb2812",
    wifiPassword: "88888888",
  },
  B3302: {
    doorAccess: { type: "reception" },
    wifiPassword: "blukitesinvest",
  },
  B3408: {
    doorAccess: { type: "code", value: "828282#" },
    wifiPassword: "khab3408",
  },
  B809: {
    doorAccess: { type: "code", value: "898989#" },
    wifiPassword: "Anstaycamon",
  },
  B3401: {
    doorAccess: { type: "key-card" },
    wifiName: "Bao trong",
    wifiPassword: "12340000",
  },
};

const normalizeApartment = (apartment?: string) =>
  apartment?.trim().toUpperCase();

export const hasAlcApartment = (apartment?: string) => {
  const normalizedApartment = normalizeApartment(apartment);
  return Boolean(normalizedApartment && ALC_ROOM_INFO[normalizedApartment]);
};

export const getAlcDoorCode = (
  apartment?: string,
  language: "vi" | "en" = "vi"
) => {
  const normalizedApartment = normalizeApartment(apartment);
  if (!normalizedApartment) {
    return language === "vi" ? "không có mã" : "No door code";
  }

  const doorAccess = ALC_ROOM_INFO[normalizedApartment]?.doorAccess;
  if (!doorAccess) return "8668";
  if (doorAccess.type === "code") return doorAccess.value;
  if (doorAccess.type === "key-card") {
    return language === "vi" ? "Mở thẻ" : "Use key card";
  }
  return language === "vi"
    ? "Liên hệ lễ tân để lấy mật khẩu cửa"
    : "Contact reception for the door code";
};

export const getAlcWifiPassword = (apartment?: string) => {
  const normalizedApartment = normalizeApartment(apartment);
  return (
    (normalizedApartment && ALC_ROOM_INFO[normalizedApartment]?.wifiPassword) ||
    "Anstaycamon"
  );
};

export const getAlcWifiName = (apartment?: string) => {
  const normalizedApartment = normalizeApartment(apartment);
  if (!normalizedApartment) return "Welcome to Anstay";

  return (
    ALC_ROOM_INFO[normalizedApartment]?.wifiName ||
    `Welcome to Anstay - ${normalizedApartment}`
  );
};
