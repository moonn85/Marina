type DocumentType = "id-card" | "passport";

export type CheckinDocumentExtraction = {
  fullName: string | null;
  birthDate: string | null;
  gender: string | null;
  documentNumber: string | null;
  expiryDate: string | null;
  entryDate: string | null;
  nationality: string | null;
  address: string | null;
  documentType: DocumentType | null;
  isExpectedDocument: boolean;
  isFrontSide: boolean;
  confidence: number;
  notes: string | null;
  validationMessage: string | null;
};

type AnalyzeCheckinFrontDocumentParams = {
  documentType: DocumentType;
  file: File;
};

type AnalyzeResponse = {
  success?: boolean;
  data?: CheckinDocumentExtraction;
  message?: string;
  error?: string;
};

export class CheckinDocumentAnalyzeError extends Error {
  status: number;
  response: AnalyzeResponse;

  constructor(message: string, status: number, response: AnalyzeResponse) {
    super(message);
    this.name = "CheckinDocumentAnalyzeError";
    this.status = status;
    this.response = response;
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://api.anstay.com.vn/api/v1"
).replace(/\/$/, "");

export const analyzeCheckinFrontDocument = async ({
  documentType,
  file,
}: AnalyzeCheckinFrontDocumentParams) => {
  const formData = new FormData();

  formData.append("documentType", documentType);
  formData.append("images", file);

  const response = await fetch(`${API_BASE_URL}/checkin-document/analyze`, {
    method: "POST",
    body: formData,
  });

  const result = (await response.json().catch(() => ({}))) as AnalyzeResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new CheckinDocumentAnalyzeError(
      result.message || result.error || "Không thể quét ảnh giấy tờ",
      response.status,
      result
    );
  }

  return result.data;
};

export const getFrontDocumentValidationError = (
  extraction: CheckinDocumentExtraction,
  documentType: DocumentType
) => {
  if (!extraction.isExpectedDocument) {
    return documentType === "id-card"
      ? "Ảnh không phải CCCD/CMND hoặc căn cước điện tử Việt Nam. Vui lòng chụp lại đúng giấy tờ / This is not a Vietnamese physical or electronic ID. Please retake the correct document"
      : "Ảnh không phải hộ chiếu. Vui lòng chụp lại đúng giấy tờ / This is not a passport. Please retake the correct document";
  }

  if (!extraction.isFrontSide) {
    return documentType === "id-card"
      ? "Ảnh không phải mặt trước CCCD/CMND hoặc trang thông tin căn cước điện tử. Vui lòng chụp lại đúng trang / This is not the ID card front or electronic identity information page. Please retake the correct view"
      : "Ảnh không phải trang thông tin hộ chiếu. Vui lòng chụp lại đúng trang / This is not the passport information page. Please retake the correct page";
  }

  return null;
};
