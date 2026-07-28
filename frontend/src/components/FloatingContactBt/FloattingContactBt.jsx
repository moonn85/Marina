import "./FloattingContactBt.css";
import Zalo from "../../assets/Icons/Zalocon.webp";

const WhatsAppIcon = "https://res.cloudinary.com/drpqrn5jz/image/upload/v1764380287/whatsapp-icon-logo-svgrepo-com_gcmz0s.svg";

const FloattingContactBt = () => {
  const contactLinks = [
    {
      href: "https://zalo.me/303298464254784727",
      icon: Zalo,
      alt: "Zalo",
      label: "Chat Zalo (8h–21h)"
    },
    {
      href: "https://wa.me/84384945614", // Định dạng đúng: https://wa.me/[country_code][phone_number]
      icon: WhatsAppIcon,
      alt: "WhatsApp",
      label: "Chat WhatsApp (8h–21h)"
    }
  ];

  return (
    <aside className="floating-container" aria-label="Liên hệ nhanh Anstay">
      <div className="floating-contact-options">
        {contactLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`floating-contact-link floating-contact-link--${link.alt.toLowerCase()}`}
            aria-label={link.label}
          >
            <img
              src={link.icon}
              alt=""
              className={`floating-contact-icon floating-contact-icon--${link.alt.toLowerCase()}`}
              width={30}
              height={30}
              aria-hidden="true"
            />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
};

export default FloattingContactBt;
