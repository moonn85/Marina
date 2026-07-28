import { ChangeEvent, FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import "./FormQr.css";
import Notification from "../Notification/Notification";
import { submitCheckinToSheet } from "./checkinSubmission";
import {
  analyzeCheckinFrontDocument,
  CheckinDocumentAnalyzeError,
  getFrontDocumentValidationError,
} from "./documentAnalysis";
import {
  CHECKIN_IMAGE_ACCEPT,
  compressImageToUploadLimit,
  isSupportedCheckinImageFile,
  isImageWithinUploadLimit,
} from "./imageCompression";
import WheelDatePicker from "./WheelDatePicker";
import { hasAlcApartment } from "../TestPage/AlcRoomData";

type DocumentType = "id-card" | "passport";
type GuestDocumentUploadKey =
  | "frontDocument"
  | "guestDocument2"
  | "guestDocument3"
  | "guestDocument4"
  | "guestDocument5"
  | "guestDocument6"
  | "guestDocument7"
  | "guestDocument8";
type UploadKey = GuestDocumentUploadKey | "stampDocument";

type UploadPreview = {
  name: string;
  url: string;
  file: File;
};

type CheckinFormData = {
  guestCount: string;
  fullName: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  email: string;
  entryDate: string;
  stayPurpose: string;
  guestType: string;
  address: string;
  note: string;
  apartment: string;
};

type CheckinErrors = Partial<Record<keyof CheckinFormData | UploadKey, string>>;

type UploadSlotProps = {
  id: UploadKey;
  label: string;
  required?: boolean;
  preview?: UploadPreview;
  error?: string;
  onFileChange: (slot: UploadKey, event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (slot: UploadKey) => void;
};

type FormQrProps = {
  hotelSelection?: ReactNode;
};

const initialFormData: CheckinFormData = {
  guestCount: "",
  fullName: "",
  birthDate: "",
  gender: "",
  phoneNumber: "",
  email: "",
  entryDate: "",
  stayPurpose: "Du lịch / Travel",
  guestType: "Cặp đôi / Couple",
  address: "",
  note: "",
  apartment: "",
};

const requiredFields: Array<keyof CheckinFormData> = [
  "guestCount",
  "fullName",
  "birthDate",
  "phoneNumber",
  "email",
  "apartment",
];

const fieldLabels: Record<keyof CheckinFormData, string> = {
  guestCount: "Vui lòng chọn số người / Please select number of guests",
  fullName: "Vui lòng nhập họ và tên / Please enter full name",
  birthDate: "Vui lòng chọn ngày sinh / Please select date of birth",
  gender: "Vui lòng chọn giới tính / Please select gender",
  phoneNumber: "Vui lòng nhập số điện thoại / Please enter phone number",
  email: "Vui lòng nhập email / Please enter email",
  entryDate: "Vui lòng chọn ngày nhập cảnh / Please select entry date",
  stayPurpose: "Vui lòng chọn mục đích lưu trú / Please select stay purpose",
  guestType: "Vui lòng chọn đối tượng khách hàng / Please select guest type",
  address: "Vui lòng nhập địa chỉ / Please enter address",
  note: "Vui lòng nhập lưu ý / Please enter note",
  apartment: "Vui lòng nhập căn hộ / Please enter apartment",
};

const autofillFields: Array<keyof CheckinFormData> = [
  "fullName",
  "birthDate",
  "gender",
  "entryDate",
  "address",
];

const getLocalDateValue = (date: Date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 10);
};

const maximumBirthDate = (() => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return getLocalDateValue(now);
})();

const guestDocumentUploadKeys: GuestDocumentUploadKey[] = [
  "frontDocument",
  "guestDocument2",
  "guestDocument3",
  "guestDocument4",
  "guestDocument5",
  "guestDocument6",
  "guestDocument7",
  "guestDocument8",
];

const guestCountOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const getGuestDocumentUploadKey = (
  guestNumber: number
): GuestDocumentUploadKey =>
  guestNumber === 1
    ? "frontDocument"
    : (`guestDocument${guestNumber}` as GuestDocumentUploadKey);

const UploadSlot = ({
  id,
  label,
  required = true,
  preview,
  error,
  onFileChange,
  onRemove,
}: UploadSlotProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`alc-upload-slot${error ? " has-error" : ""}`}>
      <div className="alc-upload-label">
        {label} {required && <span>*</span>}
      </div>

      <div className="alc-upload-box">
        {preview ? (
          <div className="alc-upload-preview">
            <img src={preview.url} alt={preview.name} />
            <div>
              <strong>{preview.name}</strong>
              <button type="button" onClick={() => onRemove(id)}>
                Đổi ảnh / Change
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload size={42} strokeWidth={1.8} />
            <strong>Upload hoặc chụp ảnh / Upload or take photo</strong>
            <p>Định dạng: JPG, PNG, HEIC/HEIF. Tối đa 5MB / JPG, PNG, HEIC/HEIF up to 5MB</p>
          </>
        )}

        <div className="alc-upload-actions">
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} />
            Chọn file / Choose
          </button>
          <button type="button" onClick={() => cameraInputRef.current?.click()}>
            <Camera size={15} />
            Chụp ảnh / Camera
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={CHECKIN_IMAGE_ACCEPT}
          onChange={(event) => onFileChange(id, event)}
          hidden
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept={CHECKIN_IMAGE_ACCEPT}
          capture="environment"
          onChange={(event) => onFileChange(id, event)}
          hidden
        />
      </div>

      {error && <span className="alc-error">{error}</span>}
    </div>
  );
};

const FormQr = ({ hotelSelection }: FormQrProps) => {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState<DocumentType>("id-card");
  const [formData, setFormData] = useState<CheckinFormData>(initialFormData);
  const [uploads, setUploads] = useState<Partial<Record<UploadKey, UploadPreview>>>({});
  const [errors, setErrors] = useState<CheckinErrors>({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFrontDocumentVerified, setIsFrontDocumentVerified] = useState(false);
  const formDataRef = useRef(formData);
  const scanRequestRef = useRef(0);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const updateGuestCount = (value: string) => {
    const nextGuestCount = Number(value);
    const visibleDocumentKeys = new Set(
      guestDocumentUploadKeys.slice(0, nextGuestCount)
    );

    setUploads((prev) => {
      const next = { ...prev };

      guestDocumentUploadKeys.forEach((key) => {
        if (!visibleDocumentKeys.has(key) && next[key]) {
          URL.revokeObjectURL(next[key]!.url);
          delete next[key];
        }
      });

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev, guestCount: "" };

      guestDocumentUploadKeys.forEach((key) => {
        if (!visibleDocumentKeys.has(key)) {
          delete next[key];
        }
      });

      return next;
    });

    setFormData((prevData) => ({
      ...prevData,
      guestCount: value,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "guestCount") {
      updateGuestCount(value);
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, value: string) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    slot: UploadKey,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!isSupportedCheckinImageFile(file)) {
      setErrors((prev) => ({
        ...prev,
        [slot]: "Chỉ hỗ trợ ảnh JPG, PNG, HEIC/HEIF / JPG, PNG, HEIC/HEIF only",
      }));
      return;
    }

    let uploadFile: File;

    try {
      uploadFile = await compressImageToUploadLimit(file);
    } catch {
      setErrors((prev) => ({
        ...prev,
        [slot]: "Không thể đọc hoặc chuyển đổi ảnh. Nếu dùng iPhone, vui lòng chụp lại rõ hơn hoặc chọn định dạng Tương thích nhất / Unable to read or convert the image. On iPhone, please retake or use Most Compatible format",
      }));
      return;
    }

    if (!isImageWithinUploadLimit(uploadFile)) {
      setErrors((prev) => ({
        ...prev,
        [slot]: "Ảnh quá 5MB sau khi nén. Vui lòng chụp lại ở khoảng cách gần hơn hoặc chọn ảnh nhỏ hơn / Image is over 5MB after compression. Please retake closer or choose a smaller image",
      }));
      return;
    }

    setUploads((prev) => {
      if (prev[slot]?.url) {
        URL.revokeObjectURL(prev[slot]!.url);
      }

      return {
        ...prev,
        [slot]: {
          name: uploadFile.name,
          url: URL.createObjectURL(uploadFile),
          file: uploadFile,
        },
      };
    });
    setErrors((prev) => ({ ...prev, [slot]: "" }));

    if (slot === "frontDocument") {
      setIsFrontDocumentVerified(false);
      void analyzeFrontDocument(uploadFile, documentType);
    }
  };

  const handleRemoveUpload = (slot: UploadKey) => {
    if (slot === "frontDocument") {
      scanRequestRef.current += 1;
      setIsAnalyzing(false);
      setIsFrontDocumentVerified(false);
    }

    setUploads((prev) => {
      if (prev[slot]?.url) {
        URL.revokeObjectURL(prev[slot]!.url);
      }

      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  const rejectFrontDocument = (message: string) => {
    setIsFrontDocumentVerified(false);
    setUploads((prev) => {
      if (prev.frontDocument?.url) {
        URL.revokeObjectURL(prev.frontDocument.url);
      }

      const next = { ...prev };
      delete next.frontDocument;
      return next;
    });
    setErrors((prev) => ({ ...prev, frontDocument: message }));
    setNotification({
      show: true,
      message,
      type: "error",
    });
  };

  const handleDocumentTypeChange = (nextDocumentType: DocumentType) => {
    if (nextDocumentType === documentType) return;

    scanRequestRef.current += 1;
    setIsAnalyzing(false);
    setIsFrontDocumentVerified(false);
    setDocumentType(nextDocumentType);
    setUploads((prev) => {
      const next = { ...prev };

      [...guestDocumentUploadKeys, "stampDocument" as const].forEach((key) => {
        if (next[key]?.url) {
          URL.revokeObjectURL(next[key]!.url);
        }
        delete next[key];
      });

      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      [...guestDocumentUploadKeys, "stampDocument" as const].forEach((key) => {
        delete next[key];
      });
      return next;
    });
  };

  const analyzeFrontDocument = async (
    file: File,
    selectedDocumentType: DocumentType
  ) => {
    const requestId = scanRequestRef.current + 1;
    scanRequestRef.current = requestId;
    setIsAnalyzing(true);

    try {
      const extracted = await analyzeCheckinFrontDocument({
        documentType: selectedDocumentType,
        file,
      });

      if (requestId !== scanRequestRef.current) {
        return;
      }

      const validationError = getFrontDocumentValidationError(
        extracted,
        selectedDocumentType
      );

      if (validationError) {
        rejectFrontDocument(validationError);
        return;
      }

      setIsFrontDocumentVerified(true);
      setErrors((prev) => ({ ...prev, frontDocument: "" }));

      const nextData = { ...formDataRef.current };
      const filledFields: Array<keyof CheckinFormData> = [];

      autofillFields.forEach((field) => {
        const value = extracted[field];

        if (typeof value === "string" && value.trim() && !nextData[field].trim()) {
          nextData[field] = value.trim();
          filledFields.push(field);
        }
      });

      formDataRef.current = nextData;
      setFormData(nextData);

      if (filledFields.length) {
        setErrors((prev) => {
          const next = { ...prev };
          filledFields.forEach((field) => {
            delete next[field];
          });
          return next;
        });
      }

      setNotification({
        show: true,
        message: "Đã quét xong / Scan complete",
        type: "success",
      });
    } catch (error) {
      if (requestId !== scanRequestRef.current) {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Không thể quét ảnh giấy tờ";
      const apiStatus =
        error instanceof CheckinDocumentAnalyzeError ? ` API ${error.status}.` : "";

      console.warn("Check-in document analysis failed", {
        error,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        documentType: selectedDocumentType,
      });

      rejectFrontDocument(
        `Ảnh đã được nén và chuyển sang JPG nhưng hệ thống không đọc được giấy tờ.${apiStatus} Vui lòng chụp rõ toàn bộ giấy tờ, không lóa, không mờ / The image was compressed and converted to JPG, but OCR could not read the document.${apiStatus} Please retake a clear, full document photo: ${errorMessage}`
      );
    } finally {
      if (requestId === scanRequestRef.current) {
        setIsAnalyzing(false);
      }
    }
  };

  const validate = () => {
    const nextErrors: CheckinErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        nextErrors[field] = fieldLabels[field];
      }
    });

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Email không hợp lệ / Invalid email";
    }

    if (
      formData.birthDate.trim() &&
      formData.birthDate > maximumBirthDate
    ) {
      nextErrors.birthDate =
        "Ngày sinh phải trước ngày hiện tại / Date of birth must be earlier than today";
    }

    if (isAnalyzing) {
      nextErrors.frontDocument =
        "Đang xác thực ảnh giấy tờ. Vui lòng chờ / Verifying document image. Please wait";
    } else if (!uploads.frontDocument) {
      nextErrors.frontDocument =
        "Vui lòng upload ảnh mặt trước giấy tờ / Please upload the front side";
    } else if (!isFrontDocumentVerified) {
      nextErrors.frontDocument =
        "Ảnh mặt trước chưa được xác thực. Vui lòng chụp lại / Front document image is not verified. Please retake";
    }

    if (documentType === "passport" && !uploads.stampDocument) {
      nextErrors.stampDocument =
        "Vui lòng upload ảnh con dấu nhập cảnh / Please upload the entry stamp photo";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validate()) {
      setNotification({
        show: true,
        message:
          "Vui lòng kiểm tra lại thông tin bắt buộc / Please check required information.",
        type: "error",
      });
      return;
    }

    const normalizedApartment = formData.apartment.trim().toUpperCase();

    if (!hasAlcApartment(normalizedApartment)) {
      setErrors((prev) => ({
        ...prev,
        apartment:
          "Phòng này không tồn tại. Vui lòng kiểm tra lại / This apartment does not exist. Please check again",
      }));
      setNotification({
        show: true,
        message:
          "Phòng này không tồn tại. Vui lòng kiểm tra lại / This apartment does not exist. Please check again.",
        type: "error",
      });
      return;
    }

    sessionStorage.setItem("alc_checkin_preview", JSON.stringify(formData));

    setIsSubmitting(true);

    void submitCheckinToSheet({
      property: "alc",
      documentType,
      roomOrApartment: normalizedApartment,
      formData,
      uploads,
    }).catch((error) => {
      console.error("Submit A La Carte check-in failed:", error);
    });

    navigate(
      normalizedApartment
        ? `/alacarte-residence/${encodeURIComponent(normalizedApartment)}`
        : "/alacarte-residence",
      { state: { apartment: normalizedApartment } }
    );
  };

  return (
    <main className="alc-page">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error"}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <section className="alc-shell">
        <aside className="alc-hero">
          <div className="alc-brand">
            <img src="/pictures/LogoAnstay.webp" alt="ANSTAY" />
            <span>Anstay Residence by A La Carte Hạ Long</span>
          </div>

          <div className="alc-hero-copy">
            <div className="alc-kicker">
              <ShieldCheck size={18} />
              A La Carte online check-in
            </div>
            <h1>Thông tin nhận phòng</h1>
            <p>
              Hoàn thiện thông tin lưu trú trước khi đến Anstay Residence by A
              La Carte Hạ Long để đội ngũ ANSTAY hỗ trợ nhận phòng nhanh hơn.
            </p>
          </div>

          <div className="alc-step-list">
            <div className="is-active">
              <span>1</span>
              <div>
                <strong>Giấy tờ / Documents</strong>
                <small>Upload hoặc chụp ảnh / Upload or take photo</small>
              </div>
            </div>
            <div>
              <span>2</span>
              <div>
                <strong>Thông tin / Information</strong>
                <small>Xác nhận thông tin khách / Confirm guest details</small>
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

        <form className="alc-form" onSubmit={handleSubmit}>
          {hotelSelection}

          <div className="alc-form-header">
            <div>
              <span>ANSTAY RESIDENCE BY A LA CARTE HẠ LONG</span>
              <h2>Thông tin khách hàng / Guest information</h2>
            </div>
            <div className="alc-secure-badge">
              <ShieldCheck size={17} />
              Bảo mật / Secure
            </div>
          </div>

          <section className="alc-guest-count-section">
            <div className="alc-field alc-guest-count-field">
              <span>
                <UserRound size={17} />
                Số người lưu trú / Number of guests <b>*</b>
              </span>
              <select
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                aria-label="Số người lưu trú / Number of guests"
              >
                <option value="">Chọn số người / Select guests</option>
                {guestCountOptions.map((count) => (
                  <option key={count} value={String(count)}>
                    {count} người / {count} {count === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
              <div
                className="alc-guest-count-mobile"
                role="group"
                aria-label="Số người lưu trú / Number of guests"
              >
                {guestCountOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={
                      formData.guestCount === String(count)
                        ? "is-selected"
                        : ""
                    }
                    aria-pressed={formData.guestCount === String(count)}
                    onClick={() => updateGuestCount(String(count))}
                  >
                    <strong>{count}</strong>
                    <small>người</small>
                  </button>
                ))}
              </div>
              <small>Tối đa 8 người / Maximum 8 guests</small>
              {errors.guestCount && <em>{errors.guestCount}</em>}
            </div>
          </section>

          {formData.guestCount && (
            <>
              <div className="alc-doc-options" aria-label="Chọn loại giấy tờ">
                <button
                  className={documentType === "id-card" ? "is-selected" : ""}
                  type="button"
                  onClick={() => handleDocumentTypeChange("id-card")}
                >
                  <CreditCard size={24} />
                  <strong>CCCD/CMND</strong>
                  <span>Căn cước công dân hoặc Chứng minh nhân dân / ID card</span>
                </button>
                <button
                  className={documentType === "passport" ? "is-selected" : ""}
                  type="button"
                  onClick={() => handleDocumentTypeChange("passport")}
                >
                  <FileText size={24} />
                  <strong>Hộ chiếu / Passport</strong>
                  <span>Passport</span>
                </button>
              </div>

              <section className="alc-section">
                <div className="alc-section-title">
                  <h3>{documentType === "id-card" ? "CCCD/CMND / ID card" : "Hộ chiếu / Passport"}</h3>
                  <div />
                </div>

                {Array.from(
                  { length: Number(formData.guestCount) },
                  (_, index) => {
                    const guestNumber = index + 1;
                    const uploadKey =
                      getGuestDocumentUploadKey(guestNumber);
                    const documentLabel =
                      documentType === "id-card"
                        ? "Ảnh mặt trước CMND/CCCD hoặc căn cước điện tử / Physical or electronic ID"
                        : "Ảnh trang thông tin hộ chiếu / Passport information page";

                    return (
                      <div className="alc-guest-upload-group" key={uploadKey}>
                        <UploadSlot
                          id={uploadKey}
                          label={`Khách ${guestNumber} / Guest ${guestNumber} - ${documentLabel}${guestNumber > 1 ? " (không bắt buộc / optional)" : ""}`}
                          required={guestNumber === 1}
                          preview={uploads[uploadKey]}
                          error={errors[uploadKey]}
                          onFileChange={handleFileChange}
                          onRemove={handleRemoveUpload}
                        />

                        {guestNumber === 1 ? (
                          <>
                            {isAnalyzing && (
                              <p className="alc-scan-status">
                                Đang xác thực ảnh giấy tờ... / Verifying document image...
                              </p>
                            )}

                            {isFrontDocumentVerified && !isAnalyzing && (
                              <p className="alc-scan-status">
                                Đã lấy thông tin từ giấy tờ khách 1 / Guest 1 document information extracted
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="alc-upload-drive-note">
                            Ảnh này chỉ được lưu lên Drive, không quét thông tin / This image is saved to Drive without data extraction
                          </p>
                        )}
                      </div>
                    );
                  }
                )}

                {documentType === "passport" && (
                  <UploadSlot
                    id="stampDocument"
                    label="Khách 1 - Ảnh con dấu nhập cảnh / Guest 1 entry stamp photo"
                    preview={uploads.stampDocument}
                    error={errors.stampDocument}
                    onFileChange={handleFileChange}
                    onRemove={handleRemoveUpload}
                  />
                )}

              </section>

              <section className="alc-section">
                <div className="alc-section-title">
                  <h3>Thông tin lưu trú / Stay information</h3>
                  <div />
                </div>

                <div className="alc-grid">
                  <label className="alc-field">
                    <span>
                      <UserRound size={15} />
                      Họ và tên / Full name <b>*</b>
                    </span>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên / Enter full name"
                    />
                    {errors.fullName && <em>{errors.fullName}</em>}
                  </label>

                  <label className="alc-field">
                    <span>
                      <CalendarDays size={15} />
                      Ngày sinh / Date of birth <b>*</b>
                    </span>
                    <WheelDatePicker
                      name="birthDate"
                      value={formData.birthDate}
                      max={maximumBirthDate}
                      placeholder="Chọn ngày sinh / Select date of birth"
                      initialYear={1990}
                      onChange={handleDateChange}
                    />
                    {errors.birthDate && <em>{errors.birthDate}</em>}
                  </label>

                  {/* <label className="alc-field">
                    <span>
                      <UserRound size={15} />
                      Giới tính / Gender <b>*</b>
                    </span>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Chọn giới tính / Select gender</option>
                      <option>Nam / Male</option>
                      <option>Nữ / Female</option>
                      <option>Khác / Other</option>
                    </select>
                    {errors.gender && <em>{errors.gender}</em>}
                  </label> */}

                  <label className="alc-field">
                    <span>
                      <Phone size={15} />
                      Số điện thoại / Phone number <b>*</b>
                    </span>
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại / Enter phone number"
                    />
                    {errors.phoneNumber && <em>{errors.phoneNumber}</em>}
                  </label>

                  <label className="alc-field">
                    <span>
                      <Mail size={15} />
                      Email <b>*</b>
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email / Enter email"
                    />
                    {errors.email && <em>{errors.email}</em>}
                  </label>

                  {documentType === "passport" && (
                    <label className="alc-field">
                      <span>
                        <CalendarDays size={15} />
                        Ngày nhập cảnh / Entry date
                      </span>
                      <WheelDatePicker
                        name="entryDate"
                        value={formData.entryDate}
                        placeholder="Chọn ngày nhập cảnh / Select entry date"
                        onChange={handleDateChange}
                      />
                    </label>
                  )}

                  {/* <label className="alc-field">
                    <span>
                      <CheckCircle2 size={15} />
                      Mục đích lưu trú / Stay purpose <b>*</b>
                    </span>
                    <select
                      name="stayPurpose"
                      value={formData.stayPurpose}
                      onChange={handleChange}
                    >
                      <option>Du lịch / Travel</option>
                      <option>Công tác / Business</option>
                      <option>Thăm thân / Visit relatives</option>
                      <option>Khác / Other</option>
                    </select>
                    {errors.stayPurpose && <em>{errors.stayPurpose}</em>}
                  </label> */}

                  {/* <label className="alc-field">
                    <span>
                      <UserRound size={15} />
                      Đối tượng khách hàng / Guest type <b>*</b>
                    </span>
                    <select name="guestType" value={formData.guestType} onChange={handleChange}>
                      <option>Cặp đôi / Couple</option>
                      <option>Gia đình / Family</option>
                      <option>Nhóm bạn / Friends</option>
                      <option>Khách lẻ / Individual</option>
                      <option>Doanh nghiệp / Business</option>
                    </select>
                    {errors.guestType && <em>{errors.guestType}</em>}
                  </label> */}

                  <label className="alc-field alc-field-wide">
                    <span>
                      <Home size={15} />
                      Căn hộ đang lưu trú / Current apartment <b>*</b>
                    </span>
                    <input
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="VD: B516, B1002... / e.g. B516, B1002"
                    />
                    {errors.apartment && <em>{errors.apartment}</em>}
                  </label>

                  {/* <label className="alc-field alc-field-wide">
                    <span>
                      <MapPin size={15} />
                      Địa chỉ / Address <b>*</b>
                    </span>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ / Enter address"
                    />
                    {errors.address && <em>{errors.address}</em>}
                  </label> */}

                  <label className="alc-field alc-field-wide">
                    <span>
                      <FileText size={15} />
                      Lưu ý / Note
                    </span>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Nhập lưu ý nếu có / Enter note if any"
                      rows={3}
                    />
                  </label>
                </div>
              </section>

              <div className="alc-actions">
                <button
                  type="submit"
                  className="alc-primary-button"
                  disabled={
                    isSubmitting || isAnalyzing || !isFrontDocumentVerified
                  }
                >
                  {isSubmitting
                    ? "Đang gửi... / Submitting..."
                    : isAnalyzing
                      ? "Đang quét ảnh... / Scanning..."
                      : "Tiếp tục / Continue"}
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}

        </form>
      </section>
    </main>
  );
};

export default FormQr;
