import { lazy, Suspense, useState, useEffect, useContext, useRef, useCallback } from "react";
import { useTranslation } from "@/localization";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { CalendarCheck2, Earth, ChevronDown } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

const LoginPopup = lazy(() => import("../Login/LoginPopup"));

interface User {
  fullName: string;
  [key: string]: any;
}

interface Apartment {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const { language, changeLanguage: setLanguage, labels } = useTranslation();
  const { t } = useTranslation('home');
  // Refs
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // States
  const [showPopup, setShowPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [navActive, setNavActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [langMenuActive, setLangMenuActive] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(() => {
    return localStorage.getItem('hasSelectedLanguage') === 'true';
  });

  // ⭐ THÊM: State cho số lượng đơn hàng
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Guard clause
  if (!auth) return null;

  // Lấy thông tin user từ localStorage
  const getUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, []);

  // ⭐ THÊM: Function lấy số lượng đơn hàng
  const fetchCartCount = useCallback(async () => {
    try {
      // Cách 1: Lấy từ localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      setCartItemsCount(bookings.length);

      // Cách 2: Lấy từ API (nếu có)
      // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      // const response = await fetch(`${API_URL}/api/v1/bookings/user/${loggedInUser?.id}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setCartItemsCount(data.length);
      // }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemsCount(0);
    }
  }, []);

  // Effect: Load user data
  useEffect(() => {
    const checkUserLogin = () => {
      const userData = getUserFromStorage();
      setLoggedInUser(userData);
    };

    checkUserLogin();

    // Lắng nghe sự thay đổi localStorage
    window.addEventListener("storage", checkUserLogin);
    return () => window.removeEventListener("storage", checkUserLogin);
  }, [auth.user, getUserFromStorage]);

  // ⭐ THÊM: Effect lấy số lượng đơn hàng
  useEffect(() => {
    fetchCartCount();

    // Lắng nghe sự thay đổi bookings
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookings') {
        fetchCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling mỗi 5s để cập nhật (optional)
    const interval = setInterval(fetchCartCount, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchCartCount]);

  // Effect: Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        navRef.current?.contains(target) ||
        hamburgerRef.current?.contains(target) ||
        userMenuRef.current?.contains(target) ||
        langMenuRef.current?.contains(target)
      ) {
        return;
      }

      setNavActive(false);
      setUserMenuActive(false);
      setLangMenuActive(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleLogout = useCallback(() => {
    auth.logout();
    setLoggedInUser(null);
    setUserMenuActive(false);
    setCartItemsCount(0); // ⭐ Reset cart count khi logout
  }, [auth]);

  const handleLoginSuccess = useCallback((fullname: string) => {
    const userData = getUserFromStorage();
    setLoggedInUser(userData);
    setShowPopup(false);
    fetchCartCount(); // ⭐ Refresh cart count sau khi login
  }, [getUserFromStorage, fetchCartCount]);

  const toggleNav = useCallback(() => {
    setNavActive(prev => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuActive(prev => !prev);
  }, []);

  const closeNav = useCallback(() => {
    setNavActive(false);
  }, []);

  const openLoginPopup = useCallback(() => {
    setShowPopup(true);
    setNavActive(false);
  }, []);

  const toggleLangMenu = useCallback(() => {
    setLangMenuActive(prev => !prev);
  }, []);

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    setLangMenuActive(false);
    setHasSelectedLanguage(true);
    localStorage.setItem('hasSelectedLanguage', 'true');
    localStorage.setItem('selectedLanguage', lang);
  }, [setLanguage]);

  // Navigation links (excluding booking which goes to the right)
  const navLinks = [
    { to: "/custom-itinerary", label: t('home.header.customItinerary', 'Lịch trình riêng') },
    { to: "/about", label: t('home.header.title2') },
    // { to: "/policy", label: t('home.header.title3') }, // chuyên xuống footer
  ];

  const bookingLink = { to: "/booking", label: t('home.header.title1') };

  return (
    <>
      <header className="header">
        {navActive && (
          <div
            className="header-nav-overlay active"
            onClick={closeNav}
            aria-hidden="true"
          />
        )}

        <div className="header-container">
          {/* Logo */}
          <div className="header-logo-container">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_auto/Anstay_wra7ap.png"
                alt="Anstay Logo"
                className="header1-logo"
                width="120"
                height="40"
              />
            </Link>
          </div>

          {/* Hamburger Menu */}
          <div
            className={`hamburger ${navActive ? "active" : ""}`}
            onClick={toggleNav}
            ref={hamburgerRef}
            role="button"
            aria-label="Toggle navigation"
            aria-expanded={navActive}
          >
            <div />
            <div />
            <div />
          </div>

          {/* Navigation */}
          <div
            className={`header-nav-container ${navActive ? "active" : ""}`}
            ref={navRef}
          >
            {/* Header Select */}
            <div className="header-select">
              {/* <div className="select-nav">
                <CircleHelp size={18} className="header-icon" />
                <Link to="/contact">{t('home.header.title5')}</Link>
              </div> */}

              <div
                className={`select-nav lang-menu ${langMenuActive ? "active" : ""}`}
                ref={langMenuRef}
              >
                <div className="lang-trigger" onClick={toggleLangMenu}>
                  <Earth size={18} className="header-icon" />
                  <span data-no-localize>{hasSelectedLanguage ? labels[language] : 'Language'}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </div>

                {langMenuActive && (
                  <div className="dropdown lang-dropdown" data-no-localize>
                    <button onClick={() => changeLanguage('vi')} className={language === 'vi' ? 'active' : ''}>
                      Tiếng Việt
                    </button>
                    <button onClick={() => changeLanguage('en')} className={language === 'en' ? 'active' : ''}>
                      English
                    </button>
                    <button onClick={() => changeLanguage('ko')} className={language === 'ko' ? 'active' : ''}>
                      한국어
                    </button>
                    <button onClick={() => changeLanguage('zh')} className={language === 'zh' ? 'active' : ''}>
                      中文
                    </button>
                    <button onClick={() => changeLanguage('ru')} className={language === 'ru' ? 'active' : ''}>
                      Русский
                    </button>
                    <button onClick={() => changeLanguage('hi')} className={language === 'hi' ? 'active' : ''}>
                      हिन्दी
                    </button>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {/* <div
                className={`user-menu ${userMenuActive ? "active" : ""}`}
                ref={userMenuRef}
              >
                {loggedInUser ? (
                  <div>
                    <div className="user-info" onClick={toggleUserMenu}>
                      <UserRound size={18} className="header-icon" />
                      <span className="user-fullname">
                        {loggedInUser.fullName}
                      </span>
                      <ChevronDown size={16} aria-hidden="true" />
                    </div>

                    {userMenuActive && (
                      <div className="dropdown">
                        <Link to="/dashbroad">
                          <button className="btn-login information-btn">
                            Thông tin cá nhân
                          </button>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="btn-login logout-btn"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="btn-login" onClick={openLoginPopup}>
                    Đăng nhập
                  </button>
                )}
              </div> */}

              {/* ⭐ SỬA: Cart với icon và badge */}
              {/* <div className="header-cart">
                <Link to="/cart" className="cart-link">
                  <div className="cart-icon-wrapper">
                    <ShoppingCart size={20} />
                    {cartItemsCount > 0 && (
                      <span className="cart-badge">{cartItemsCount}</span>
                    )}
                  </div>
                  <span className="cart-text">Đơn hàng</span>
                </Link>
              </div> */}
            </div>

            {/* Navigation Links */}
            <div className="header-nav" data-no-localize>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeNav}
                  className={`${location.pathname === to ? "active" : ""}`}
                >
                  {label}
                </Link>
              ))}

              {/* Booking Link - Inside header-nav for mobile menu */}
              <Link
                to={bookingLink.to}
                onClick={closeNav}
                className="custom-itinerary-link header-booking-link-mobile"
              >
                <span>{bookingLink.label}</span>
                <CalendarCheck2 size={16} className="booking-icon" />
              </Link>
            </div>
          </div>

          {/* Booking Link - Separate from nav-container for proper positioning */}

          <Link
            to={bookingLink.to}
            onClick={closeNav}
            className="custom-itinerary-link header-booking-link"
            data-no-localize
          >
            <span>{bookingLink.label}</span>
            <CalendarCheck2 size={16} className="booking-icon" />
          </Link>
        </div>
      </header>

      {/* Login Popup */}
      {showPopup && (
        <Suspense fallback={null}>
          <LoginPopup
            onClose={() => setShowPopup(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
      )}
    </>
  );
};

export default Header;
