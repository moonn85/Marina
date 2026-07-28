import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './FloatingBanner.css';

interface FloatingBannerProps {
    imageUrl: string;
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    closeButtonText?: string;
    onClose?: () => void;
}

const FloatingBanner: React.FC<FloatingBannerProps> = ({
    imageUrl,
    title,
    description,
    buttonText,
    buttonLink,
    closeButtonText = 'Close',
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const bannerKey = `floating-banner-${title}`;

    useEffect(() => {
        // Xóa session storage khi component mount (page load/reload)
        sessionStorage.removeItem(bannerKey);
        setIsVisible(true);
        setIsMinimized(false);
    }, [bannerKey]);

    const handleClose = () => {
        // Thu nhỏ banner thay vì ẩn nó
        setIsMinimized(true);
        // Gọi callback từ parent component nếu có
        if (onClose) {
            onClose();
        }
    };

    const handleClick = () => {
        window.location.href = buttonLink;
    };

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <div className="floating-banner-minimized" onClick={handleClick}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="floating-banner-minimized-image"
                    width="120"
                    height="80"
                    loading="lazy"
                    decoding="async"
                />
                <div className="floating-banner-minimized-text">
                    <p>{title}</p>
                </div>
                <button
                    className="floating-banner-minimized-expand"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    aria-label="Go to page"
                    title="Đi tới trang"
                >
                    →
                </button>
            </div>
        );
    }

    return (
        <div className="floating-banner">
            <button
                style={{
                    color: 'rgb(255, 255, 255)',
                    background: 'rgba(0, 0, 0, 0.5)',
                }}
                className="floating-banner-close"
                onClick={handleClose}
                aria-label={closeButtonText}
                title={closeButtonText}
            >X
                < X size={16} />
            </button>

            <div className="floating-banner-content">
                <img
                    src={imageUrl}
                    alt={title}
                    className="floating-banner-image"
                    width="450"
                    height="180"
                    loading="lazy"
                    decoding="async"
                />

                <div className="floating-banner-text">
                    <h3 className="floating-banner-title">{title}</h3>
                    {description && (
                        <p className="floating-banner-description">{description}</p>
                    )}
                </div>
            </div>

            <button
                className="floating-banner-cta"
                onClick={handleClick}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default FloatingBanner;
