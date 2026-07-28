import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Apartment.css";
interface Owner {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}
interface Image {
  id: number;
  apartmentId: number;
  imageUrl: string;
  featured: boolean;
}
interface Apartment {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  pricePerDay: number;
  pricePerMonth: number;
  discountPercent: number;
  description: string;
  maxAdults: number;
  maxChildren: number;
  numRooms: number;
  status: string;
  owners: Owner[];
  images: Image[];
  area: string;
}
const Apartment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listingData, setListingData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentArea, setCurrentArea] = useState(
    location.state?.location || "HA_NOI"
  );
  // Add new state for price sorting
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  // Add this helper function inside the component
  const getAreaName = (areaCode: string) => {
    switch (areaCode) {
      case "HA_NOI":
        return "HÀ NỘI";
      case "HA_LONG":
        return "HẠ LONG";
      case "DA_NANG":
        return "ĐÀ NẴNG";
      case "NHA_TRANG":
        return "NHA TRANG";
      case "DA_LAT":
        return "ĐÀ LẠT";
      case "HO_CHI_MINH":
        return "HỒ CHÍ MINH";
      case "PHU_QUOC":
        return "PHÚ QUỐCx";
      default:
        return areaCode;
    }
  };
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.anstay.com.vn/api/v1/apartments/by-area?area=${currentArea}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch apartments");
        }
        const data = await response.json();
        setListingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, [currentArea]); // Add currentArea as dependency
  // Update currentArea when location.state changes
  useEffect(() => {
    if (location.state?.location) {
      setCurrentArea(location.state.location);
    }
  }, [location.state?.location]);
  // Update URL when currentArea changes
  useEffect(() => {
    // Update URL without causing navigation
    window.history.replaceState(
      { location: currentArea },
      "",
      window.location.pathname
    );
  }, [currentArea]);
  useEffect(() => {
    // Log current URL
    console.log("Current URL:", window.location.pathname);
    // Determine area from URL
    const path = window.location.pathname;
    if (path.includes("apartment-ha-noi")) {
      setCurrentArea("HA_NOI");
    } else if (path.includes("apartment-ha-long")) {
      setCurrentArea("HA_LONG");
    }
  }, []);
  // Modify handleAreaChange to use navigate
  const handleAreaChange = (area: string) => {
    navigate("/apartment", { state: { location: area } });
    setVisibleCount(9);
    setActiveImages({});
  };
  // Add function to handle price sorting
  const handlePriceSort = (order: "asc" | "desc") => {
    setPriceSort(order);
    const sortedListings = [...listingData].sort((a, b) => {
      return order === "asc"
        ? a.pricePerMonth - b.pricePerMonth
        : b.pricePerMonth - a.pricePerMonth;
    });
    setListingData(sortedListings);
  };
  // State for active image index per listing
  const [activeImages, setActiveImages] = useState<{ [key: number]: number }>(
    {}
  );
  // State for visible listings count (initially show 9)
  const [visibleCount, setVisibleCount] = useState(9);
  // Function to navigate images
  const navigateImage = (listingId: number, direction: string) => {
    const currentIndex = activeImages[listingId] || 0;
    const imagesCount =
      listingData.find((listing) => listing.id === listingId)?.images.length ||
      0;
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % imagesCount;
    } else {
      newIndex = (currentIndex - 1 + imagesCount) % imagesCount;
    }
    setActiveImages({ ...activeImages, [listingId]: newIndex });
  };
  // Function to handle "Xem thêm" button click
  const handleLoadMore = () => {
    // Increase visible count by 9 or show all remaining items
    setVisibleCount((prev) => Math.min(prev + 9, listingData.length));
  };
  // Get visible listings
  const visibleListings = listingData.slice(0, visibleCount);
  // Thay thế hàm openPopup bằng hàm navigate
  const handleListingClick = (listing: Apartment) => {
    if (listing.status !== "OCCUPIED") {
      let baseUrl = "/apartment";
      if (currentArea === "HA_LONG") {
        baseUrl = "/apartment-ha-long";
      } else if (currentArea === "HA_NOI") {
        baseUrl = "/apartment-ha-noi";
      }
      const urlFriendlyName = listing.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      navigate(`${baseUrl}/${urlFriendlyName}/view`, {
        state: { listingId: listing.id },
      });
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <div className="apart-top">
        <div className="img-top-apart">
          <img
            src="https://i.ibb.co/hpMFfrw/z4852932594666-d9c69ab00f1ae9691c10540639338a2b.jpg"
            alt="poster"
            loading="lazy"
          />
        </div>
        <div className="title-top-apart">
          <h2>Căn hộ</h2>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container">
          <div className="filters">
            <span>Sắp xếp theo:</span>
            <div className="filter-item">
              <select className="filter-select">
                <option>Kỳ hạn: Tất cả</option>
              </select>
            </div>
            <div className="filter-item">
              <select
                className="filter-select"
                onChange={(e) =>
                  handlePriceSort(e.target.value as "asc" | "desc")
                }
                value={priceSort || ""}
              >
                <option value="">Giá tiền: Mặc định</option>
                <option value="asc">Giá tiền: Tăng dần</option>
                <option value="desc">Giá tiền: Giảm dần</option>
              </select>
            </div>
          </div>
          {/* Listings grid */}
          <div className="listings-grid">
            {visibleListings.map((listing) => (
              <div
                key={listing.id}
                className={`listing-card ${listing.status === "OCCUPIED" ? "disabled" : ""
                  }`}
                onClick={() => handleListingClick(listing)}
                style={{
                  cursor:
                    listing.status === "OCCUPIED" ? "not-allowed" : "pointer",
                  opacity: listing.status === "OCCUPIED" ? 0.7 : 1,
                }}
              >
                {/* Image carousel */}
                <div className="listing-image">
                  {listing.discountPercent > 0 && (
                    <div className="discount-badge-ap">
                      -{listing.discountPercent}%
                    </div>
                  )}
                  {listing.status !== "AVAILABLE" && (
                    <div className="sold-out-banner">Hết phòng</div>
                  )}
                  <img
                    src={
                      listing.images[activeImages[listing.id] || 0]?.imageUrl ||
                      ""
                    }
                    alt={listing.name}
                    className="listing-img"
                  />
                  {/* Navigation arrows */}
                  <div className="nav-buttons">
                    <button
                      className="nav-btn nav-btn-prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage(listing.id, "prev");
                      }}
                    >
                      ❮
                    </button>
                    <button
                      className="nav-btn nav-btn-next"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage(listing.id, "next");
                      }}
                    >
                      ❯
                    </button>
                  </div>
                  {/* Dots */}
                  <div className="image-dots">
                    {listing.images.map((_, index) => (
                      <div
                        key={index}
                        className={`dot ${(activeImages[listing.id] || 0) === index
                          ? "active"
                          : ""
                          }`}
                        onClick={() =>
                          setActiveImages({
                            ...activeImages,
                            [listing.id]: index,
                          })
                        }
                      ></div>
                    ))}
                  </div>
                </div>
                {/* Content */}
                <div className="listing-content">
                  <h3 className="listing-title">{listing.name}</h3>
                  <div
                    className="listing-address"
                    style={{ textAlign: "left" }}
                  >
                    📍{listing.location}
                  </div>
                  <div
                    className="listing-address"
                    style={{ textAlign: "left" }}
                  >
                    📍 {getAreaName(listing.area)}
                  </div>
                  <div className="listing-details">
                    <div
                      className="listing-price"
                      style={{ textAlign: "left", width: "100%" }}
                    >
                      <div style={{ textAlign: "center" }}>
                        {listing.pricePerDay.toLocaleString()} ~
                        {listing.pricePerMonth.toLocaleString()} VNĐ/Ngày
                      </div>
                    </div>
                  </div>
                  <div className="listing-details">
                    <div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Load More Button - only show if there are more items to load */}
          {visibleCount < listingData.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Apartment;
