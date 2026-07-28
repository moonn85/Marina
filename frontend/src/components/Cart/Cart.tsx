import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Users, Hotel, MapPin, Clock, LogIn } from 'lucide-react';
import './Cart.css';

interface BookingItem {
    id: number;
    bookingCode: string;
    roomId: number;
    checkIn: string;
    checkOut: string;
    numAdults: number;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalPrice: number;
    room?: {
        id: number;
        name: string;
        price: number;
    };
    apartment?: {
        id: number;
        name: string;
    };
}

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    // ⭐ THÊM: State check đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        checkLoginAndFetchBookings();
    }, []);

    // ⭐ THÊM: Function check login trước
    const checkLoginAndFetchBookings = async () => {
        const userStr = localStorage.getItem('user');

        if (!userStr) {
            console.log('❌ Chưa đăng nhập');
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        setIsLoggedIn(true);
        await fetchBookings();
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setBookings([]);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            console.log('👤 Current user:', user);

            const response = await fetch(`${API_URL}/bookings/user/${user.id}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Bookings data:', data);

            let bookingList: BookingItem[] = [];

            if (Array.isArray(data)) {
                bookingList = data;
            } else if (data.data && Array.isArray(data.data)) {
                bookingList = data.data;
            } else if (data.bookings && Array.isArray(data.bookings)) {
                bookingList = data.bookings;
            }

            setBookings(bookingList);

        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };

    const getStatusText = (status: string): string => {
        const statusMap: { [key: string]: string } = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            CANCELLED: 'Đã hủy',
            COMPLETED: 'Hoàn thành'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status: string): string => {
        return `status-badge status-${status.toLowerCase()}`;
    };

    const calculateNights = (checkIn: string, checkOut: string): number => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    const handleSelectItem = (id: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === bookings.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(bookings.map(b => b.id)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.size === 0) {
            alert('⚠️ Vui lòng chọn đơn hàng cần xóa!');
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn xóa ${selectedItems.size} đơn hàng?`)) {
            return;
        }

        try {
            const deletePromises = Array.from(selectedItems).map(id =>
                fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);

            await fetchBookings();
            setSelectedItems(new Set());
            alert('✅ Đã xóa thành công!');
        } catch (error) {
            console.error('Error deleting bookings:', error);
            alert('❌ Có lỗi xảy ra khi xóa!');
        }
    };

    const handleViewDetail = (booking: BookingItem) => {
        navigate(`/booking-detail/${booking.id}`, { state: { booking } });
    };

    const calculateTotal = (): number => {
        return bookings
            .filter(b => selectedItems.has(b.id))
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    };

    // ⭐ Loading state
    if (loading) {
        return (
            <div className="cart-loading">
                <div className="spinner"></div>
                <p>Đang tải đơn hàng...</p>
            </div>
        );
    }

    // ⭐ THÊM: Chưa đăng nhập → Hiển thị yêu cầu đăng nhập
    if (!isLoggedIn) {
        return (
            <div className="cart-empty">
                <LogIn size={64} className="empty-icon" />
                <h2>Vui lòng đăng nhập</h2>
                <p>Bạn cần đăng nhập để xem đơn hàng của mình</p>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/', { state: { openLogin: true } })}
                >
                    Đăng nhập ngay
                </button>
            </div>
        );
    }

    // ⭐ Đã đăng nhập nhưng chưa có đơn hàng
    if (bookings.length === 0) {
        return (
            <div className="cart-empty">
                <Hotel size={64} className="empty-icon" />
                <h2>Giỏ hàng trống</h2>
                <p>Bạn chưa có đơn đặt phòng nào</p>
                <button className="btn-primary" onClick={() => navigate('/booking')}>
                    Đặt phòng ngay
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Đơn hàng của tôi</h1>
                <p className="cart-subtitle">Quản lý đơn đặt phòng của bạn</p>
            </div>

            <div className="cart-content">
                <div className="cart-controls">
                    <label className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={selectedItems.size === bookings.length && bookings.length > 0}
                            onChange={handleSelectAll}
                        />
                        <span>Chọn tất cả ({bookings.length})</span>
                    </label>

                    <button
                        className="btn-delete"
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.size === 0}
                    >
                        <Trash2 size={18} />
                        Xóa đã chọn ({selectedItems.size})
                    </button>
                </div>

                <div className="cart-list">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className={`cart-item ${selectedItems.has(booking.id) ? 'selected' : ''}`}
                        >
                            <div className="cart-item-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(booking.id)}
                                    onChange={() => handleSelectItem(booking.id)}
                                />
                            </div>

                            <div className="cart-item-info">
                                <div className="cart-item-header">
                                    <div>
                                        <h3 className="cart-item-title">
                                            {booking.room?.name || 'Phòng'}
                                        </h3>
                                        <div className="cart-item-meta">
                                            <MapPin size={14} />
                                            <span>{booking.apartment?.name || 'Khách sạn'}</span>
                                        </div>
                                        <div className="booking-code">
                                            Mã: {booking.bookingCode}
                                        </div>
                                    </div>
                                    <div className={getStatusClass(booking.status)}>
                                        {getStatusText(booking.status)}
                                    </div>
                                </div>

                                <div className="cart-item-details">
                                    <div className="detail-row">
                                        <Calendar size={16} />
                                        <span>Check-in: {formatDate(booking.checkIn)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Calendar size={16} />
                                        <span>Check-out: {formatDate(booking.checkOut)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Clock size={16} />
                                        <span>{calculateNights(booking.checkIn, booking.checkOut)} đêm</span>
                                    </div>
                                    <div className="detail-row">
                                        <Users size={16} />
                                        <span>{booking.numAdults} khách</span>
                                    </div>
                                </div>

                                <div className="cart-item-footer">
                                    <div className="cart-item-price">
                                        <span className="price-label">Tổng tiền:</span>
                                        <span className="price-value">
                                            {formatCurrency(booking.totalPrice || 0)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-view-detail"
                                        onClick={() => handleViewDetail(booking)}
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Đã chọn:</span>
                        <span>{selectedItems.size} đơn</span>
                    </div>
                    <div className="summary-row total">
                        <span>Tổng tạm tính:</span>
                        <span className="total-price">{formatCurrency(calculateTotal())}</span>
                    </div>
                    <button
                        className="btn-checkout"
                        disabled={selectedItems.size === 0}
                        onClick={() => {
                            alert('Tính năng thanh toán đang được phát triển');
                        }}
                    >
                        Thanh toán ({selectedItems.size})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;