import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout.css';

interface BookingData {
    id: number;
    rooms: Array<{
        roomId: number;
        optionId: number;
        quantity?: number;
    }>;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    nightCount: number;
    previousState?: any;
}

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state as BookingData | undefined;
    const [showPromoInput, setShowPromoInput] = useState(false);

    // Payment / promo states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [promoApplied, setPromoApplied] = useState<{ code: string; savedAmount: number } | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState('');

    // preserve original total and use displayTotal for UI
    const [baseTotal] = useState<number>(bookingData?.totalPrice ?? 0);
    const [displayTotal, setDisplayTotal] = useState<number>(bookingData?.totalPrice ?? 0);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [bookingCodes, setBookingCodes] = useState<string[]>([]);
    const [bookingIds, setBookingIds] = useState<number[]>([]); // ⭐ Lưu IDs để gửi PayPal
    const [countdown, setCountdown] = useState(180); // seconds
    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialRequests: '',
        paymentMethod: 'later',
    });

    // ⭐ THÊM state cho PayPal
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const paypalButtonRendered = useRef(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [isCapturingPayment, setIsCapturingPayment] = useState(false);
    const [clientToken, setClientToken] = useState<string | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ visible: boolean; type?: 'success' | 'error'; title?: string; message?: string }>({
        visible: false,
        type: 'success',
        title: '',
        message: ''
    });
    const toastTimeoutRef = useRef<number | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Interval refs for countdown
    const countdownIntervalRef = useRef<number | null>(null);
    const hasShownTimeoutAlert = useRef(false);

    useEffect(() => {
        if (!bookingData) navigate('/booking');
    }, [bookingData, navigate]);

    // showToast helper
    const showToast = (opts: { type?: 'success' | 'error'; title?: string; message?: string }, duration = 4000) => {
        if (toastTimeoutRef.current) {
            window.clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = null;
        }

        setToast({ visible: true, type: opts.type || 'success', title: opts.title || '', message: opts.message || '' });
        toastTimeoutRef.current = window.setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
            toastTimeoutRef.current = null;
        }, duration);
    };

    useEffect(() => {
        return () => {
            // cleanup toast timeout
            if (toastTimeoutRef.current) {
                window.clearTimeout(toastTimeoutRef.current);
            }
            // cleanup countdown interval
            if (countdownIntervalRef.current) {
                window.clearInterval(countdownIntervalRef.current);
            }
        };
    }, []);

    // ⭐ THÊM: Load PayPal SDK với client-token từ backend
    useEffect(() => {
        if (paypalLoaded || clientToken) return;

        const fetchClientTokenAndLoadSDK = async () => {
            try {
                console.log('📡 Fetching client token from backend...');
                console.log('🔗 API URL:', import.meta.env.VITE_API_URL);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/paypal/client-token`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Backend response error:', response.status, errorText);
                    throw new Error(`Failed to get client token: ${response.status}`);
                }

                const data = await response.json();
                console.log('📦 Response data:', data);

                const token = data.clientToken;
                if (!token) {
                    throw new Error('No clientToken in response');
                }

                setClientToken(token);
                console.log('✅ Client token received:', token.substring(0, 20) + '...');

                const script = document.createElement('script');
                // ⭐ PayPal SDK VẪN CẦN client-id, data-client-token chỉ là bổ sung
                const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AbULXYXhMyyjASVP72kanI7SRixQL9ly-FggjVODPtxQNdOeq3NwDwuNETskGOaKfjJTGR6yxNAQpvC_';
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
                script.setAttribute('data-client-token', token);
                script.async = true;

                script.onload = () => {
                    console.log('✅ PayPal SDK loaded successfully with client token');
                    setPaypalLoaded(true);
                };

                script.onerror = (e) => {
                    console.error('❌ PayPal SDK script load failed:', e);
                    console.error('Script src:', script.src);
                    console.error('Token set:', script.getAttribute('data-client-token') ? 'Yes' : 'No');
                    showToast({
                        type: 'error',
                        title: 'Lỗi',
                        message: 'Không thể tải PayPal SDK. Vui lòng kiểm tra kết nối mạng.'
                    }, 3000);
                };

                document.body.appendChild(script);
                console.log('📜 PayPal script added to page');

                return () => {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                };
            } catch (error) {
                console.error('❌ Error fetching client token:', error);
                showToast({
                    type: 'error',
                    title: 'Lỗi kết nối Backend',
                    message: `Không thể kết nối tới backend. ${error instanceof Error ? error.message : ''}`
                }, 5000);
            }
        };

        fetchClientTokenAndLoadSDK();
    }, []);

    // ⭐ THÊM: Render PayPal buttons khi modal mở + SDK loaded
    useEffect(() => {
        // ⭐ FIX: Chỉ check điều kiện cần thiết
        if (!showPaymentModal || !paypalLoaded || bookingCodes.length === 0) {
            paypalButtonRendered.current = false;
            return;
        }

        // ⭐ Chỉ render khi chọn PayPal (bank)
        if (customerInfo.paymentMethod !== 'bank') {
            paypalButtonRendered.current = false;
            return;
        }

        if (paypalButtonRendered.current) return;

        // ⭐ Delay một chút để đảm bảo DOM ready
        const timer = setTimeout(() => {
            const container = document.getElementById('paypal-button-container');
            if (!container) {
                console.warn('⚠️ PayPal container not found');
                return;
            }

            // Clear container trước
            container.innerHTML = '';

            const amountUSD = (displayTotal / 25000).toFixed(2);
            console.log('💰 Rendering PayPal for:', {
                displayTotal,
                amountUSD,
                paymentMethod: customerInfo.paymentMethod
            });

            // ⭐ Kiểm tra amount hợp lệ
            if (parseFloat(amountUSD) <= 0) {
                console.error('❌ Invalid amount:', amountUSD);
                showToast({ type: 'error', title: 'Lỗi', message: 'Số tiền không hợp lệ' }, 3000);
                return;
            }

            // @ts-ignore
            if (window.paypal) {
                try {
                    // @ts-ignore
                    window.paypal.Buttons({
                        style: {
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal'
                        },
                        createOrder: async (data: any, actions: any) => {
                            console.log('📝 Creating PayPal order via backend for booking ID:', bookingIds[0]);
                            setIsCreatingOrder(true);
                            try {
                                // ⭐ GỬI bookingId (number) - Backend query DB để lấy giá
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/paypal/create-order`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        bookingId: bookingIds[0], // ⭐ Gửi ID numeric, không phải code
                                    }),
                                });

                                if (!response.ok) {
                                    throw new Error(`Backend error: ${response.status}`);
                                }

                                const result = await response.json();
                                console.log('✅ Order created via backend:', result.orderID);
                                setIsCreatingOrder(false);
                                return result.orderID;
                            } catch (err) {
                                console.error('❌ Create order error:', err);
                                setIsCreatingOrder(false);
                                showToast({
                                    type: 'error',
                                    title: 'Lỗi tạo đơn hàng',
                                    message: 'Không thể tạo đơn hàng PayPal. Vui lòng thử lại.'
                                }, 3000);
                                throw err;
                            }
                        },
                        onApprove: async (data: any, actions: any) => {
                            console.log('✅ PayPal approved, order ID:', data.orderID);
                            setIsCapturingPayment(true);
                            try {
                                // ⭐ GỌI BACKEND để capture và verify payment
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/paypal/capture-order/${data.orderID}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (!response.ok) {
                                    throw new Error(`Backend capture error: ${response.status}`);
                                }

                                const captureResult = await response.json();
                                console.log('✅ Payment captured via backend:', captureResult);
                                setIsCapturingPayment(false);

                                if (captureResult.status === 'COMPLETED') {
                                    showToast({
                                        type: 'success',
                                        title: '✅ Thanh toán thành công',
                                        message: `Đã thanh toán ${captureResult.amount.value} ${captureResult.amount.currency_code} qua PayPal`
                                    }, 3000);

                                    // Lưu payment info để gửi lên webhook
                                    const paymentInfo = {
                                        orderID: data.orderID,
                                        status: captureResult.status,
                                        payer: captureResult.payer,
                                        amount: captureResult.amount,
                                        createTime: captureResult.createTime,
                                    };

                                    // Delay để user thấy message rồi confirm booking
                                    setTimeout(() => {
                                        handleConfirmPayment(paymentInfo);
                                    }, 1500);
                                } else {
                                    throw new Error('Payment status not completed');
                                }
                            } catch (err) {
                                console.error('❌ Capture error:', err);
                                setIsCapturingPayment(false);
                                showToast({
                                    type: 'error',
                                    title: 'Lỗi thanh toán',
                                    message: 'Không thể hoàn tất thanh toán. Vui lòng liên hệ hỗ trợ.'
                                }, 3000);
                            }
                        },
                        onError: (err: any) => {
                            console.error('❌ PayPal button error:', err);
                            showToast({
                                type: 'error',
                                title: 'PayPal lỗi',
                                message: 'Có lỗi xảy ra. Vui lòng thử lại.'
                            }, 3000);
                        },
                        onCancel: (data: any) => {
                            console.log('⚠️ Payment cancelled by user');
                            showToast({
                                type: 'error',
                                title: 'Đã hủy',
                                message: 'Bạn đã hủy thanh toán PayPal'
                            }, 3000);
                        }
                    }).render('#paypal-button-container').then(() => {
                        paypalButtonRendered.current = true;
                        console.log('✅ PayPal buttons rendered successfully');
                    }).catch((err: any) => {
                        console.error('❌ Render error:', err);
                        showToast({
                            type: 'error',
                            title: 'Lỗi',
                            message: 'Không thể tải PayPal. Vui lòng thử lại.'
                        }, 3000);
                    });
                } catch (err) {
                    console.error('❌ PayPal initialization error:', err);
                }
            } else {
                console.error('❌ window.paypal not available');
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'PayPal SDK chưa sẵn sàng'
                }, 3000);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [showPaymentModal, paypalLoaded, bookingCodes.length, customerInfo.paymentMethod, displayTotal]);

    // Countdown effect: starts when modal open AND bookingCodes exist
    useEffect(() => {
        const cleanup = () => {
            if (countdownIntervalRef.current) {
                window.clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };

        if (!showPaymentModal || bookingCodes.length === 0) {
            cleanup();
            hasShownTimeoutAlert.current = false;
            return;
        }

        // reset countdown when opening modal with bookingCodes
        setCountdown(180);
        hasShownTimeoutAlert.current = false;

        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown(prev => {
                const next = prev - 1;
                if (next <= 0) {
                    cleanup();
                    if (!hasShownTimeoutAlert.current) {
                        hasShownTimeoutAlert.current = true;
                        setShowPaymentModal(false);
                        // show toast once
                        showToast({ type: 'error', title: '⏰ Hết thời gian', message: 'Hết 3 phút để thanh toán. Vui lòng thử lại.' }, 3500);
                    }
                    return 0;
                }
                return next;
            });
        }, 1000);

        return cleanup;
    }, [showPaymentModal, bookingCodes.length]);

    const formatCountdown = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const formatDate = (date: Date): string => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return `${days[date.getDay()]}, ${date.getDate()} thg ${date.getMonth() + 1}`;
    };

    const handleGoBack = () => {
        navigate('/booking', { state: bookingData?.previousState });
    };

    // remove/clear applied promo
    const removePromo = () => {
        setPromoApplied(null);
        setPromoCode('');
        setPromoMessage('');
        setDisplayTotal(baseTotal);
    };

    const handleOpenPaymentModal = async () => {
        try {
            if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
                showToast({ type: 'error', title: 'Thiếu thông tin', message: 'Vui lòng điền đầy đủ họ tên, email và số điện thoại.' }, 3000);
                return;
            }

            setShowPaymentModal(true);
            setBookingCodes([]); // reset while creating

            // create bookings (one request per room)
            // NOTE: only include voucherCode in the FIRST booking request so the voucher applies once
            const finalTotal = displayTotal;
            const roomsCount = bookingData?.rooms?.length || 1;
            const perRoomAmount = Math.round(finalTotal / roomsCount);

            const bookingRequests = bookingData?.rooms.map(async (selectedRoom, idx) => {
                const optionType =
                    selectedRoom.optionId && selectedRoom.optionId % 10 === 2
                        ? "WITH_BREAKFAST"
                        : "NORMAL";
                const bookingPayload: any = {
                    roomId: selectedRoom.roomId,
                    optionType: optionType,
                    quantity: selectedRoom.quantity ?? 1,

                    checkIn: bookingData.checkIn.toLocaleDateString("en-CA"),
                    checkOut: bookingData.checkOut.toLocaleDateString("en-CA"),

                    numAdults: bookingData.guests,
                    guestName: customerInfo.fullName,
                    guestPhone: customerInfo.phone,
                    guestEmail: customerInfo.email,
                    note: customerInfo.specialRequests,
                };


                // apply voucher only once (first booking request)
                if (promoApplied?.code && idx === 0) {
                    bookingPayload.voucherCode = promoApplied.code;
                }

                const response = await fetch(`${API_URL}/bookings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingPayload),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.message || 'Tạo đơn hàng thất bại');
                }

                return response.json();
            }) || [];

            const results = await Promise.all(bookingRequests);
            const codes = results.map((r: any) => r.booking?.bookingCode || `WEB${r.booking?.id || 'UNKNOWN'}`);
            const ids = results.map((r: any) => r.booking?.id).filter(id => id); // ⭐ Lấy IDs
            setBookingCodes(codes);
            setBookingIds(ids); // ⭐ Lưu IDs

            // === SEND FULL BOOKING DETAIL TO N8N WEBHOOK ===
            try {
                const mainBookingCode = codes[0];

                const qrCodeUrl = `https://img.vietqr.io/image/TPBank-00006216926-compact.png?amount=${displayTotal}&addInfo=${encodeURIComponent(mainBookingCode)}&accountName=${encodeURIComponent('TRAN THI THANH')}`;

                const payload = {
                    bookingCodes: codes,
                    status: "pending",

                    customerInfo: {
                        fullName: customerInfo.fullName,
                        email: customerInfo.email,
                        phone: customerInfo.phone,
                        specialRequests: customerInfo.specialRequests
                    },

                    rooms: bookingData.rooms,
                    checkIn: bookingData.checkIn.toLocaleDateString("en-CA"),
                    checkOut: bookingData.checkOut.toLocaleDateString("en-CA"),
                    guests: bookingData.guests,
                    nightCount: bookingData.nightCount,

                    // FE totals & voucher info for email/backend
                    webBaseTotal: baseTotal,
                    webFinalTotal: displayTotal,
                    webPerRoomAmount: perRoomAmount,
                    voucherCode: promoApplied?.code ?? null,
                    voucherSaved: promoApplied?.savedAmount ?? 0,

                    totalPrice: displayTotal,

                    bankInfo: {
                        bankName: "TPBank",
                        accountNumber: "00006216926",
                        accountName: "TRAN THI THANH",
                        amount: displayTotal,
                        bookingCode: mainBookingCode,
                    },

                    qrCodeUrl,
                    createdAt: new Date().toISOString()
                };

                await fetch("https://n8n.anstay.com.vn/webhook/0063f3e4-fe43-4372-90a2-0fcca74824cc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                console.log("📤 Sent full booking payload to n8n");

            } catch (err) {
                console.error("❌ Webhook error:", err);
            }

            showToast({ type: 'success', title: '✅ Đã tạo đơn hàng', message: `Mã: ${codes.join(', ')}` }, 2500);
        } catch (err: any) {
            console.error('Error creating booking:', err);
            setShowPaymentModal(false);
            showToast({ type: 'error', title: 'Tạo đơn thất bại', message: err?.message || 'Vui lòng thử lại' }, 4000);
        }
    };

    const handleCloseModal = () => {
        if (countdownIntervalRef.current) {
            window.clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        setShowPaymentModal(false);
    };

    const handleConfirmPayment = async (paymentInfo?: any) => {
        try {
            // clear countdown if any
            if (countdownIntervalRef.current) {
                window.clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }

            setShowPaymentModal(false);
            sessionStorage.removeItem('bookingState');

            let msg = `Mã đặt phòng: ${bookingCodes.join(', ')}\nHọ tên: ${customerInfo.fullName}\nEmail: ${customerInfo.email}\nSĐT: ${customerInfo.phone}\nSố phòng: ${bookingData?.rooms.length || 0}`;

            // Thêm thông tin PayPal nếu có
            if (paymentInfo) {
                msg += `\n\n💳 PayPal Order ID: ${paymentInfo.orderID}\n✅ Đã thanh toán: ${paymentInfo.amount.value} ${paymentInfo.amount.currency_code}`;
            }

            showToast({ type: 'success', title: '✅ Đặt phòng thành công', message: msg }, 4000);

            // navigate after short delay
            setTimeout(() => navigate('/booking'), 6500);
        } catch (err: any) {
            console.error('Payment error:', err);
            showToast({ type: 'error', title: '❌ Có lỗi', message: err?.message || 'Vui lòng thử lại.' }, 4000);
        }
    };

    if (!bookingData) return null;

    // Payment modal JSX
    const transferContent = bookingCodes.length > 0 ? bookingCodes[0] : `WEB${customerInfo.phone}`;
    const bankInfo = {
        bankName: 'TPBank',
        accountNumber: '00006216926',
        accountName: 'TRAN THI THANH',
        amount: displayTotal,
        bookingCode: transferContent,
    };
    const qrCodeUrl = `https://img.vietqr.io/image/TPBank-00006216926-compact.png?amount=${bankInfo.amount}&addInfo=${encodeURIComponent(bankInfo.bookingCode)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    return (
        <div className="checkout-container">
            {/* Toast */}
            {toast.visible && (
                <div className={`toast-notification ${toast.type === 'error' ? 'error' : 'success'}`}>
                    <div className="toast-header">
                        <strong>{toast.title}</strong>
                        <button className="toast-close" onClick={() => setToast(prev => ({ ...prev, visible: false }))}>✕</button>
                    </div>
                    <div className="toast-body">
                        {toast.message?.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                </div>
            )}

            <div className="checkout-header">
                <button className="back-button" onClick={handleGoBack}>← Quay lại</button>
                <h1 className="checkout-title">Thông tin đặt phòng</h1>
            </div>

            <div className="checkout-layout">
                <div className="checkout-form">

                    <div className="form-group">
                        <label className="form-label required">Họ và tên</label>
                        <input type="text" className="form-input" value={customerInfo.fullName} onChange={e => setCustomerInfo({ ...customerInfo, fullName: e.target.value })} placeholder="Nguyễn Văn A" />
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Email</label>
                        <input type="email" className="form-input" value={customerInfo.email} onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })} placeholder="email@domain.com" />
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Số điện thoại</label>
                        <input type="tel" className="form-input" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="0912345678" />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0px' }}>
                        <label className="form-label">Yêu cầu đặc biệt</label>
                        <textarea className="form-textarea" value={customerInfo.specialRequests} onChange={e => setCustomerInfo({ ...customerInfo, specialRequests: e.target.value })} placeholder="VD: tầng cao, giường đôi..." />
                    </div>

                    <form
                        autoComplete="off"
                        onSubmit={(e) => e.preventDefault()}
                        style={{ display: 'contents' }}
                    >
                        {/* Hidden fake input để đánh lừa browser */}
                        <input
                            type="text"
                            name="fake-promo"
                            style={{
                                position: 'absolute',
                                left: '-9999px',
                                width: '1px',
                                height: '1px'
                            }}
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        <div
                            className="promo-input"
                            style={{ cursor: 'default', display: 'flex', gap: '8px', alignItems: 'center' }}
                        >
                            {!showPromoInput && <span>Nhập mã khuyến mãi (nếu có):</span>}
                            {promoApplied && (
                                <span style={{ color: '#27ae60', fontWeight: 600 }}>
                                    Đã áp dụng: {promoApplied.code} (-{promoApplied.savedAmount.toLocaleString('vi-VN')} VND)
                                </span>
                            )}

                            <div className="promo-input" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    data-form-type="other"
                                    data-lpignore="true"
                                    value={promoCode}
                                    name={`promo_${Date.now()}`}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value.toUpperCase());
                                        setPromoMessage('');
                                    }}
                                    placeholder="Nhập mã khuyến mãi"
                                />
                                {!promoApplied ? (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const code = promoCode.trim().toUpperCase();
                                            if (!code) {
                                                setPromoMessage('Vui lòng nhập mã');
                                                return;
                                            }

                                            try {
                                                const res = await fetch(`${API_URL}/vouchers/check`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        code,
                                                        baseTotal: baseTotal,
                                                        checkIn: bookingData.checkIn.toLocaleDateString('en-CA'),
                                                        checkOut: bookingData.checkOut.toLocaleDateString('en-CA')
                                                    })
                                                });

                                                const data = await res.json();

                                                if (!data.ok) {
                                                    setPromoApplied(null);
                                                    setPromoMessage(data.message || 'Mã không hợp lệ');
                                                    return;
                                                }

                                                setPromoApplied({
                                                    code,
                                                    savedAmount: data.result.saved
                                                });

                                                setDisplayTotal(data.result.finalTotal);
                                                setPromoMessage(`Đã áp dụng mã -${data.result.saved.toLocaleString('vi-VN')} VND`);
                                                setShowPromoInput(false);

                                            } catch (error) {
                                                console.error(error);
                                                setPromoMessage('Có lỗi kết nối, thử lại sau');
                                            }
                                        }}
                                        style={{ backgroundColor: '#3498db', color: 'white' }}
                                    >
                                        Áp dụng
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => removePromo()}
                                        style={{ backgroundColor: '#e74c3c', color: 'white' }}
                                    >
                                        Xóa mã
                                    </button>
                                )}
                            </div>

                            {promoMessage && (
                                <div style={{ fontSize: '0.8rem', color: promoApplied ? '#27ae60' : '#e74c3c', lineHeight: 1.2 }}>
                                    {promoMessage}
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="promo-input">
                        <label className="form-label required">Hình thức thanh toán</label>

                        <label className="payment-option">
                            <input type="radio" name="paymentMethod" value="bank" checked={customerInfo.paymentMethod === 'bank'} onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })} />
                            Paypal
                        </label>
                        <label className="payment-option">
                            <input type="radio" name="paymentMethod" value="qr" checked={customerInfo.paymentMethod === 'qr'} onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })} />
                            Quét QR thanh toán
                        </label>

                    </div>
                </div>

                <div className="checkout-summary">
                    <h3 className="summary-title">Tóm tắt đặt phòng</h3>
                    <div className="summary-dates">
                        <div className="summary-date-info">📅 {formatDate(bookingData.checkIn)} → {formatDate(bookingData.checkOut)}</div>
                        <div className="summary-date-info">{bookingData.nightCount} đêm • {bookingData.guests} khách</div>
                    </div>

                    <div className="summary-total">
                        <div className="total-row">
                            <span>Tổng cộng</span>
                            <span className="total-amount">{displayTotal.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="total-note">Bao gồm thuế và phí</div>
                    </div>

                    <button className="confirm-button" disabled={!customerInfo.fullName || !customerInfo.email || !customerInfo.phone} onClick={handleOpenPaymentModal}>
                        Xác nhận đặt phòng
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h2 className="modal-title">Thanh toán đặt phòng</h2>
                                {bookingCodes.length > 0 && (
                                    <div className={`countdown-timer ${countdown <= 30 ? 'warning' : ''}`} style={{ marginLeft: 12 }}>
                                        <span className="timer-icon">⏱️</span>
                                        <span className="timer-text">{formatCountdown(countdown)}</span>
                                    </div>
                                )}
                            </div>
                            <button className="close-button" onClick={handleCloseModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            {bookingCodes.length === 0 ? (
                                <div className="booking-loading">
                                    <div className="spinner"></div>
                                    <p>Đang tạo đơn hàng...</p>
                                </div>
                            ) : (

                                customerInfo.paymentMethod === "qr" ? (
                                    /* ===== HIỂN THỊ QR ===== */
                                    <>
                                        <div className="qr-section">
                                            <h3>Quét mã QR để thanh toán</h3>
                                            <div className="qr-code-container">
                                                <img src={qrCodeUrl} className="qr-code" />
                                            </div>
                                        </div>

                                        <div className="bank-info">
                                            <h3>Thông tin chuyển khoản</h3>
                                            <div className="info-item"><span className="label">Ngân hàng:</span>{bankInfo.bankName}</div>
                                            <div className="info-item"><span className="label">Số tài khoản:</span>{bankInfo.accountNumber}</div>
                                            <div className="info-item"><span className="label">Chủ TK:</span>{bankInfo.accountName}</div>
                                            <div className="info-item important-content">
                                                <span className="label">Nội dung:</span>
                                                <strong>{bankInfo.bookingCode}</strong>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* ===== HIỂN THỊ PAYPAL ===== */
                                    <div className="paypal-section">
                                        <h3>Thanh toán bằng PayPal</h3>
                                        <p>Số tiền: <strong>${(displayTotal / 25000).toFixed(2)} USD</strong></p>
                                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
                                            (Tỷ giá ước tính: 1 USD = 25,000 VND)
                                        </p>

                                        {isCreatingOrder && (
                                            <div style={{ textAlign: 'center', padding: '10px', background: '#fff3cd', borderRadius: '8px', marginBottom: '10px' }}>
                                                <div className="spinner"></div>
                                                <p>Đang tạo đơn hàng...</p>
                                            </div>
                                        )}

                                        {isCapturingPayment && (
                                            <div style={{ textAlign: 'center', padding: '10px', background: '#d1ecf1', borderRadius: '8px', marginBottom: '10px' }}>
                                                <div className="spinner"></div>
                                                <p>Đang xác nhận thanh toán...</p>
                                            </div>
                                        )}

                                        {!paypalLoaded ? (
                                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                                <div className="spinner"></div>
                                                <p>Đang tải PayPal...</p>
                                            </div>
                                        ) : (
                                            <div id="paypal-button-container"></div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>


                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={handleCloseModal}>Hủy</button>
                            <button className="btn-confirm-payment" onClick={handleConfirmPayment} disabled={bookingCodes.length === 0}>✓ Hoàn tất</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;