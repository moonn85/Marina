import React, { useState } from 'react';
import './Contact.css';
import { Helmet } from 'react-helmet-async';
import BeSearchForm from "../BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactProps {
  className?: string;
}

const CONTACT_WEBHOOK_URL = 'https://n8n.anstay.com.vn/webhook/lienhe';

const contactWebhook = {
  send: async (data: { firstName: string; lastName: string; email: string; phone: string; message: string }) => {
    try {
      await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
          source: 'anstay-website-contact-form',
        }),
      });
    } catch (error) {
      console.error('Error sending contact webhook:', error);
    }
  }
};

const Contact: React.FC<ContactProps> = ({ className }) => {
  const { t } = useTranslation('contact');
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Tên là bắt buộc';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Họ là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail không hợp lệ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Tin nhắn là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // Gửi trực tiếp sang webhook n8n
      await contactWebhook.send({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });

      setSubmitStatus('success');

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      setSubmitStatus('error');
      setApiError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi liên hệ');

      setTimeout(() => {
        setSubmitStatus('idle');
        setApiError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-wrapper ${className || ''}`}>
      <Helmet>
        <title>Contact Anstay - Get Help with Your Booking</title>
        <meta
          name="description"
          content="Contact our support team for any questions about bookings or experiences."
        />
        <meta name="keywords" content="contact, support, help" />
        <meta property="og:title" content="Contact Anstay - Get Help with Your Booking" />
        <meta property="og:description" content="Contact our support team for any questions about bookings or experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anstay.com.vn/contact" />
        <meta property="og:site_name" content="ANSTAY" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AnstayVN" />
        <meta name="twitter:title" content="Contact Anstay - Get Help with Your Booking" />
        <meta name="twitter:description" content="Contact our support team for any questions about bookings or experiences." />
        <link rel="canonical" href="https://anstay.com.vn/contact" />

        {/* Structured Data - ContactPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "Hotel",
              "name": "ANSTAY",
              "telephone": "+84-20-3355-9555",
              "email": "info@alacartehalongbay.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Lô đất H30–H33, Bán đảo số 2, Khu đô thị dịch vụ Hùng Thắng",
                "addressLocality": "Hạ Long",
                "addressRegion": "Quảng Ninh",
                "postalCode": "200000",
                "addressCountry": "VN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+84-20-3355-9555",
                "contactType": "Customer Service",
                "email": "info@alacartehalongbay.com",
                "availableLanguage": ["Vietnamese", "English", "Korean", "Chinese"],
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              }
            }
          })}
        </script>
      </Helmet>
      <div className="contact-container">

        <div className="contact-header">
          <h2>{t('contact.header.title', 'Liên hệ với chúng tôi')}</h2>
          <p>{t('contact.header.subtitle', 'Gửi thông tin để chúng tôi hỗ trợ bạn')}</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName">{t('contact.des1', 'Họ')} <span className="required">*</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder={t('contact.des2', 'Nhập họ')}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="firstName">{t('contact.des3', 'Tên')} <span className="required">*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder={t('contact.des4', 'Nhập tên')}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">E-mail <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="example@email.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('contact.des5', 'Điện thoại')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('contact.des6', '+84 xxx xxx xxx')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message"> {t('contact.des7', 'Tin nhắn')} <span className="required">*</span></label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder={t('contact.des8', 'Nhập tin nhắn của bạn...')}
              rows={5}
            />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          {submitStatus === 'success' && (
            <div className="message success">
              ✓ {t('contact.des9', 'Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.')}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="message error">
              ✗ {apiError || 'Có lỗi xảy ra. Vui lòng thử lại.'}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;