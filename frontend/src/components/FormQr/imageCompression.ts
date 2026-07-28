const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const INITIAL_MAX_DIMENSION = 1800;
const MIN_MAX_DIMENSION = 900;
const MIN_QUALITY = 0.6;

export const CHECKIN_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif";

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const allowedImageExtensions = new Set(["jpg", "jpeg", "png", "heic", "heif"]);

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension || "";
};

export const isSupportedCheckinImageFile = (file: File) => {
  const extension = getFileExtension(file.name);
  return allowedImageMimeTypes.has(file.type) || allowedImageExtensions.has(extension);
};

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Unable to read image"));
    };
    image.src = imageUrl;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Unable to compress image"));
      },
      "image/jpeg",
      quality
    );
  });

const getCompressedFileName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^/.]+$/, "") || "image";
  return `${baseName}.jpg`;
};

const getScaledSize = (
  width: number,
  height: number,
  maxDimension: number
) => {
  const scale = Math.min(1, maxDimension / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

export const compressImageToUploadLimit = async (file: File) => {
  const image = await loadImage(file);
  let maxDimension = INITIAL_MAX_DIMENSION;
  let quality = 0.85;
  let bestFile: File | null = null;

  while (maxDimension >= MIN_MAX_DIMENSION) {
    const { width, height } = getScaledSize(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      maxDimension
    );
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to prepare image compression");
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    while (quality >= MIN_QUALITY) {
      const blob = await canvasToBlob(canvas, quality);
      const compressedFile = new File([blob], getCompressedFileName(file.name), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      bestFile = compressedFile;

      if (compressedFile.size <= MAX_IMAGE_SIZE_BYTES) {
        return compressedFile;
      }

      quality -= 0.1;
    }

    maxDimension = Math.floor(maxDimension * 0.8);
    quality = 0.85;
  }

  return bestFile ?? file;
};

export const isImageWithinUploadLimit = (file: File) =>
  file.size <= MAX_IMAGE_SIZE_BYTES;
