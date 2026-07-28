// src/utils/cloudinary.ts

/**
 * Sinh URL ảnh Cloudinary tối ưu tự động theo kích thước thiết bị
 * @param url - Link Cloudinary gốc từ DB
 * @param options - Có thể override width, height, crop nếu cần
 */
export const getOptimizedImage = (
    url: string,
    options?: { width?: number; height?: number; crop?: boolean; quality?: number; cropMode?: 'fill' | 'fit' | 'limit' }
): string => {
    if (!url || !url.includes("/upload/")) return url;

    // ✅ Xác định kích thước theo device (360p - tối ưu cho tốc độ)
    const screenWidth =
        typeof window !== "undefined" ? window.innerWidth : 1280;

    let defaultWidth: number;
    if (screenWidth < 600) defaultWidth = 360; // mobile - 360p
    else if (screenWidth < 1024) defaultWidth = 480; // tablet
    else defaultWidth = 640; // desktop - 360p

    const { width = defaultWidth, height, crop = false, quality = 85 } = options || {};

    const parts = url.split("/upload/");
    const transform = [
        `w_${width}`,
        height ? `h_${height}` : null,
        crop && height ? "c_fill" : "c_limit",
        "f_auto", // auto chọn định dạng WebP/AVIF
        `q_${quality}`, // tối ưu chất lượng (default 80)
    ]
        .filter(Boolean)
        .join(",");

    return `${parts[0]}/upload/${transform}/${parts[1]}`;
};

/**
 * Tạo srcset cho responsive images với Cloudinary
 */
export const getResponsiveSrcSet = (
    url: string,
    sizes: number[] = [360, 480, 640],
    options?: { height?: number; crop?: boolean; quality?: number; cropMode?: 'fill' | 'fit' | 'limit' }
): string => {
    if (!url || !url.includes("/upload/")) return url;

    return sizes
        .map(size => {
            const optimized = getOptimizedImage(url, {
                width: size,
                height: options?.height,
                crop: options?.crop,
                quality: options?.quality || 85,
                cropMode: options?.cropMode
            });
            return `${optimized} ${size}w`;
        })
        .join(", ");
};
