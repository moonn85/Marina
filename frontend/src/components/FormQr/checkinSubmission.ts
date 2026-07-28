type CheckinDocumentType = "id-card" | "passport";
type UploadKey =
  | "frontDocument"
  | "guestDocument2"
  | "guestDocument3"
  | "guestDocument4"
  | "guestDocument5"
  | "guestDocument6"
  | "guestDocument7"
  | "guestDocument8"
  | "stampDocument";

type UploadPreview = {
  name: string;
  url: string;
  file: File;
};

type CheckinFormFields = {
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
};

type SubmitCheckinParams = {
  property: "alc" | "marina";
  documentType: CheckinDocumentType;
  roomOrApartment: string;
  formData: CheckinFormFields;
  uploads: Partial<Record<UploadKey, UploadPreview>>;
};

type DriveFilePayload = {
  name: string;
  mimeType: string;
  data: string;
};

const CHECKIN_SCRIPT_URL =
  import.meta.env.VITE_CHECKIN_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycby64_EFhqlaeBDC2hdjSpPjiHg3gWQv7_SJJsk6WpGdAkPHld9fL4oL6k3Uxa_LJ37C/exec";

const CHECKIN_SUMMARY_SCRIPT_URL =
  import.meta.env.VITE_CHECKIN_SUMMARY_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwLC0P8UPaXt850RA-LkKBtir7H0gdrEjbWhRCXkZzYUrBAU-euDqT8loUKmU85tzCTZg/exec";

type ScriptResponse = {
  success?: boolean;
  error?: string;
  driveFolderUrl?: string;
};

const postToScript = async (url: string, payload: object) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let result: ScriptResponse = {};

  if (rawText.trim()) {
    try {
      result = JSON.parse(rawText) as ScriptResponse;
    } catch {
      throw new Error(
        `Google Apps Script returned non-JSON response (${response.status})`
      );
    }
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.error || `Google Apps Script request failed (${response.status})`
    );
  }

  return result;
};

const fileToBase64Payload = (
  file: File,
  name: string
): Promise<DriveFilePayload> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;

      resolve({
        name,
        mimeType: file.type || "image/jpeg",
        data: base64,
      });
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const getFileExtension = (file: File) => {
  if (file.type === "image/png") return ".png";
  return ".jpg";
};

const formatDateForSheet = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return value;

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

const getUploadFileName = (fileNamePrefix: string, slot: UploadKey, file: File) => {
  const safeFileNamePrefix =
    fileNamePrefix.trim().replace(/[\\/:*?"<>|]/g, "-") || "checkin";

  const suffixBySlot: Record<UploadKey, string> = {
    frontDocument: "giay-to-khach-1",
    guestDocument2: "giay-to-khach-2",
    guestDocument3: "giay-to-khach-3",
    guestDocument4: "giay-to-khach-4",
    guestDocument5: "giay-to-khach-5",
    guestDocument6: "giay-to-khach-6",
    guestDocument7: "giay-to-khach-7",
    guestDocument8: "giay-to-khach-8",
    stampDocument: "dau-nhap-canh",
  };

  return `${safeFileNamePrefix}-${suffixBySlot[slot]}${getFileExtension(file)}`;
};

const buildFilesPayload = async (
  uploads: Partial<Record<UploadKey, UploadPreview>>,
  fileNamePrefix: string
) => {
  const files: Partial<Record<UploadKey, DriveFilePayload>> = {};
  const uploadKeys: UploadKey[] = [
    "frontDocument",
    "guestDocument2",
    "guestDocument3",
    "guestDocument4",
    "guestDocument5",
    "guestDocument6",
    "guestDocument7",
    "guestDocument8",
    "stampDocument",
  ];

  await Promise.all(
    uploadKeys.map(async (key) => {
      const upload = uploads[key];

      if (!upload) return;

      files[key] = await fileToBase64Payload(
        upload.file,
        getUploadFileName(fileNamePrefix, key, upload.file)
      );
    })
  );

  return files;
};

export const submitCheckinToSheet = async ({
  property,
  documentType,
  roomOrApartment,
  formData,
  uploads,
}: SubmitCheckinParams) => {
  if (!CHECKIN_SCRIPT_URL) {
    throw new Error("Missing Google Apps Script URL");
  }

  if (!CHECKIN_SUMMARY_SCRIPT_URL) {
    throw new Error("Missing summary Google Apps Script URL");
  }

  const files = await buildFilesPayload(
    uploads,
    roomOrApartment || formData.fullName
  );
  const submittedAt = new Date().toISOString();
  const normalizedDocumentType =
    documentType === "id-card" ? "CCCD/CMND" : "Hộ chiếu";

  const payload = {
    property,
    status: "Mới",
    roomOrApartment,
    ...formData,
    documentNumber: "",
    birthDate: formatDateForSheet(formData.birthDate),
    expiryDate: "",
    entryDate: formatDateForSheet(formData.entryDate),
    nationality: "",
    documentType: normalizedDocumentType,
    files,
  };

  const result = await postToScript(CHECKIN_SCRIPT_URL, payload);

  try {
    await postToScript(CHECKIN_SUMMARY_SCRIPT_URL, {
      submittedAt,
      property,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      documentType: normalizedDocumentType,
      documentNumber: "",
      driveFolderUrl: result.driveFolderUrl || "",
      note: formData.note,
    });
  } catch (error) {
    console.warn("Submit check-in summary failed:", error);
  }
};
