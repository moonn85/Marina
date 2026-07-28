import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import './MeVaBeHeader.css';

const MeVaBeHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleConsultation = () => {
        // Zalo contact - you can customize this
        window.open('https://zalo.me/0384945614', '_blank');
    };

    const handlePhoneCall = () => {
        window.location.href = 'tel:+84384945614';
    };

    return (
        <header className={`mevabe-header ${isScrolled ? 'mevabe-header-scrolled' : ''}`}>
            <div className="mevabe-header-container">
                {/* Logo Section */}
                <div className="mevabe-header-logo">
                    <img
                        src="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/Anstay_wra7ap.png"
                        alt="Anstay Logo"
                        className="mevabe-logo-img"
                        loading="lazy"
                    />
                    <span className="mevabe-header-title">Combo Mẹ & Bé</span>
                </div>

                {/* CTA Section */}
                <div className="mevabe-header-cta">
                    <div className="mevabe-header-hotline">
                        <Phone size={18} />
                        <a href="tel:+84384945614" className="mevabe-hotline-text">
                            +84 384 945 614
                        </a>
                    </div>

                    <button
                        className="mevabe-consultation-btn"
                        onClick={handleConsultation}
                        title="Đặt phòng ngay"
                    >
                        <MessageCircle size={18} />
                        <span>Đặt Phòng ngay</span>
                    </button>
                </div>
            </div>
        </header >
    );
};

export default MeVaBeHeader;
