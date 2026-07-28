import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./BoxSearch.css";
import Select, { components } from "react-select";
import { FaMapMarkerAlt, FaBed, FaUser, FaChild } from "react-icons/fa";

const BoxSearch = () => {
  const navigate = useNavigate();
  const [groupedLocations, setGroupedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selectedAdults, setSelectedAdults] = useState(1);
  const [selectedChildren, setSelectedChildren] = useState(0);

  // Quản lý trạng thái đóng/mở của từng group
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const [haNoiRes, haLongRes] = await Promise.all([
          fetch("https://api.anstay.com.vn/api/v1/apartments/by-area?area=HA_NOI"),
          fetch("https://api.anstay.com.vn/api/v1/apartments/by-area?area=HA_LONG"),
        ]);
        const [haNoiData, haLongData] = await Promise.all([
          haNoiRes.json(),
          haLongRes.json(),
        ]);
        const grouped = [
          {
            label: "Hà Nội",
            options: haNoiData.map((apartment) => ({
              value: apartment.name,
              label: apartment.name,
            })),
          },
          {
            label: "Hạ Long",
            options: haLongData.map((apartment) => ({
              value: apartment.name,
              label: apartment.name,
            })),
          },
        ];
        setGroupedLocations(grouped);

        // Khởi tạo: tất cả nhóm đều đóng
        setExpandedGroups({
          "Hà Nội": false,
          "Hạ Long": false,
        });
      } catch (error) {
        setGroupedLocations([]);
        console.error("Error fetching locations:", error);
      }
    };
    fetchAllLocations();

    setRooms([
      { id: 1, label: "1 phòng" },
      { id: 2, label: "2 phòng" },
      { id: 3, label: "3 phòng" },
      { id: 4, label: "4 phòng" },
      { id: 5, label: "5 phòng" },
    ]);
  }, []);

  // Toggle group open/close
  const toggleGroup = useCallback((groupLabel) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }));
  }, []);

  // Custom GroupHeading: bấm để mở/đóng group
  const GroupHeading = (props) => {
    const isExpanded = expandedGroups[props.children] || false;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleGroup(props.children);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          padding: "4px 8px",
          background: "#fafbfc",
        }}
      >
        <span style={{ marginRight: 6, fontWeight: "bold", fontSize: "16px" }}>
          {isExpanded ? "▼" : "▶"}
        </span>
        <span style={{ fontWeight: "bold" }}>{props.children}</span>
      </div>
    );
  };

  // Custom MenuList: luôn hiện heading, chỉ show option nếu group mở
  const MenuList = (props) => {
    const children = React.Children.toArray(props.children).map((child) => {
      if (!child || typeof child === 'string' || typeof child === 'number') return null;
      if (React.isValidElement(child) && child.type === components.Group) {
        const groupLabel = (child.props as any).label;
        const isExpanded = expandedGroups[groupLabel];
        // Nếu mở thì trả về group bình thường (heading + options)
        // Nếu đóng thì trả về group chỉ có heading (options rỗng)
        if (isExpanded) {
          return child;
        } else {
          return React.cloneElement(child as React.ReactElement, {
            children: [],
          } as any);
        }
      }
      return null;
    });
    return <components.MenuList {...props}>{children}</components.MenuList>;
  };

  const customComponents = {
    GroupHeading,
    MenuList,
  };

  const getCurrentSelectedOption = () => {
    return (
      groupedLocations
        .flatMap((group) => group.options)
        .find((opt) => opt.value === selectedLocation) || null
    );
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      alert("Vui lòng chọn địa điểm");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày đến và ngày đi");
      return;
    }
    if (!selectedRoom) {
      alert("Vui lòng chọn số phòng");
      return;
    }
    const queryParams = new URLSearchParams({
      location: selectedLocation,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      room: selectedRoom,
      adults: selectedAdults.toString(),
      children: selectedChildren.toString(),
    }).toString();
    navigate(`/search-results?${queryParams}`);
  };

  return (
    <div className="boxsearch-wrapper">
      <div className="search-item search-location">
        <FaMapMarkerAlt className="search-icon" />
        <Select
          classNamePrefix="react-select"
          options={groupedLocations}
          value={getCurrentSelectedOption()}
          onChange={(opt) => setSelectedLocation(opt ? opt.value : "")}
          placeholder="Chọn địa điểm"
          isClearable
          isSearchable={false}
          components={customComponents}
          menuPlacement="auto"
        />
      </div>
      {/* ... các phần còn lại giữ nguyên ... */}
      <div className="search-item search-date">
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="search-date-input"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="search-item search-date">
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="search-date-input"
          min={checkInDate || new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="search-item">
        <FaBed className="search-icon" />
        <Select
          classNamePrefix="react-select"
          options={rooms.map((room) => ({
            value: room.id,
            label: room.label,
          }))}
          value={
            rooms
              .map((room) => ({ value: room.id, label: room.label }))
              .find((opt) => opt.value === Number(selectedRoom)) || null
          }
          onChange={(opt) => setSelectedRoom(opt ? String(opt.value) : "")}
          placeholder="Số phòng"
          isClearable
          isSearchable={false}
        />
      </div>
      {/* Người lớn */}
      <div className="search-item">
        <div className="counter-box">
          <span className="counter-icon">
            <FaUser />
          </span>
          <div className="counter-box-content">
            <button
              className="counter-btn"
              onClick={() => setSelectedAdults((prev) => Math.max(1, prev - 1))}
            >
              –
            </button>
            <span>{selectedAdults} người lớn</span>
            <button
              className="counter-btn"
              onClick={() => setSelectedAdults((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/* Trẻ em */}
      <div className="search-item">
        <div className="counter-box">
          <span className="counter-icon">
            <FaChild />
          </span>
          <div className="counter-box-content">
            <button
              className="counter-btn"
              onClick={() =>
                setSelectedChildren((prev) => Math.max(0, prev - 1))
              }
            >
              –
            </button>
            <span>{selectedChildren} trẻ em</span>
            <button
              className="counter-btn"
              onClick={() => setSelectedChildren((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button className="search-button1" onClick={handleSearch}>
        Tìm phòng
      </button>
    </div>
  );
};

export default BoxSearch;
