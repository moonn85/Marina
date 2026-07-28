import React, { useState, useEffect } from "react";
import "../Vietnam/Hiden.css";
import { useLocation } from "react-router-dom";
import {
  getAlcDoorCode,
  getAlcWifiName,
  getAlcWifiPassword,
} from "../AlcRoomData";

function HidenEn() {
  const [openTabs, setOpenTabs] = useState([0]);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showPopup, setShowPopup] = useState<string | null>(null);

  const location = useLocation();
  const apartment = location.pathname.split("/").pop()?.trim(); // Get apartment code from URL path and trim whitespace
  const [showImg, setShowImg] = useState<"A" | "B">("B");

  const getVideoUrl = (sectionId) => {
    const videos = {
      "1": "/videos/huong-dan-mo.mp4",
      "2-1": "/videos/huong-dan-bat-dien.mp4",
      "2-2": "/videos/huong-dan-bep.mp4",
      "2-3": "/videos/may-giat.mp4",
      "2-4": "/videos/sudungnuocnong.mp4", //video bình nước nóng chưa co
      "3": "/videos/huong-dan-thang-may.mp4",
      "4": "/videos/nv16.mp4",
      "8-1": "/videos/sudungnuocnong.mp4", // video bồn tắm
      "8-2": "/videos/keodemcua.mp4", // //video hướng dẫn sửa t video rèm điện
      "8-3": "", //bo
      "9": "/videos/thoathiem.mp4", //video thang thoát hiểm
      "11": "/videos/dorac.mp4",
    };
    return videos[sectionId] || "";
  };

  const toggleViewAll = () => {
    setShowAllEvents(!showAllEvents);
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const SHEET_ID = "1W4VT3LIzFtgcW0-_k25zjgLKQMr828ic44mmdCCfi9I";
        const SHEET_NAME = "Event";
        const API_KEY = "AIzaSyCt-Q3stzkgRvpliLFuwhyy2uvF8hXHzfc";
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 1) {
          const formattedEvents = data.values.slice(1).map((row) => ({
            title: row[0],
            date: row[1],
            location: row[2],
            description: row[3],
            imageUrl: row[4],
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEventIndex((prevIndex) =>
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  const nextEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const toggleTab = (tabId) => {
    setOpenTabs((prev) => {
      if (prev.includes(tabId)) {
        return prev.filter((id) => id !== tabId);
      }
      return [...prev, tabId];
    });
  };

  const isTabOpen = (tabId) => {
    return openTabs.includes(tabId);
  };
  const SHEET_API_URL =
    "https://script.google.com/macros/s/AKfycbyoPiVxG8avFgMe5tlK5iKwrJigsH_N3hgykaW1RRmbwINiZV5Tm7Ss4lLPUDrtdIOt/exec";
  const handleWould = () => {
    const fullName = sessionStorage.getItem("user_fullName");
    const email = sessionStorage.getItem("user_email");
    const phoneNumber = sessionStorage.getItem("user_phoneNumber");
    const apartment = sessionStorage.getItem("user_apartment");

    if (!fullName || !email || !phoneNumber || !apartment) {
      alert("Không tìm thấy thông tin người dùng.");
      return;
    }

    const payload = {
      fullName,
      email,
      phoneNumber,
      apartment,
      action: "Quan tâm", // để Google Script biết đây là hành động gì
    };
    console.log("📦 Dữ liệu gửi:", payload);

    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() =>
        alert("Đã ghi nhận nhu cầu chúng tôi sẽ liên lạc với bạn!")
      )
      .catch(() => alert("Lỗi khi gửi, vui lòng thử lại."));
  };

  return (
    <div className="guide-container-Hiden">
      <h2 className="guide-title-Hiden">Check-in instructions</h2>
      <div className="guide-hero-Hiden">
        <div className="guide-hero-main-Hiden">
          <p className="guide-hero-kicker-Hiden">Stay Guide</p>
          <p className="guide-hero-text-Hiden">
            Quick access to door code, Wi-Fi and all apartment instructions.
          </p>
        </div>
        <div className="guide-hero-meta-Hiden">
          <span className="guide-hero-chip-Hiden">
            Apartment: {apartment?.toUpperCase() || "N/A"}
          </span>
          <span className="guide-hero-chip-Hiden">Support: 24/7</span>
        </div>
      </div>
      {(!apartment || getAlcDoorCode(apartment, "en") !== "8668") && (
        <div className="door-password-section">
          <h2 className="door-password-title-Hiden">
            Room {apartment} Door Code : {getAlcDoorCode(apartment, "en")}
          </h2>

          <div className="wifi-info-Hiden">
            <div className="wifi-credential-Hiden">
              <p className="wifi-label-Hiden">Wi-Fi:</p>
              <p className="wifi-value-Hiden">{getAlcWifiName(apartment)}</p>
            </div>
            <div className="wifi-credential-Hiden">
              <p className="wifi-label-Hiden">Password:</p>
              <p className="wifi-value-Hiden">{getAlcWifiPassword(apartment)}</p>
            </div>
          </div>

          <p className="door-password-note-Hiden">
            Please do not share this code with anyone else !!!
          </p>
        </div>
      )}
      {/* <div
        className="local-experience-section"
        style={{
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          border: "2px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          textAlign: "left",
        }}
      >
        <h3
          style={{
            color: "#2c3e50",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "12px",
            marginTop: "0",
          }}
        >
          Experience Hạ Long the Local Way
        </h3>
        <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", marginBottom: "12px", fontStyle: "italic" }}>
          "Don't just observe—immerse yourself in the rhythm of Hạ Long."
        </p>
        <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", marginBottom: "12px" }}>
          Anstay proudly introduces our handpicked local experience partners—authentic, emotion-rich journeys with no mass tours and no cookie-cutter itineraries.
        </p>
        <p style={{ color: "#555", fontSize: "15px", fontWeight: "500", marginBottom: "8px", marginTop: "15px" }}>
          You'll Enjoy:
        </p>
        <ul
          style={{
            color: "#555",
            fontSize: "14px",
            lineHeight: "1.8",
            marginBottom: "18px",
            paddingLeft: "22px",
            listStyleType: "disc",
          }}
        >
          <li style={{ marginBottom: "6px" }}>Genuine connections with locals</li>
          <li style={{ marginBottom: "6px" }}>Discovering off-the-beaten-path destinations</li>
          <li style={{ marginBottom: "6px" }}>Experiencing local life and traditional crafts</li>
        </ul>
        <p style={{ color: "#555", fontSize: "15px", fontWeight: "500", marginBottom: "8px", marginTop: "15px" }}>
          Curated Services:
        </p>
        <ul
          style={{
            color: "#555",
            fontSize: "14px",
            lineHeight: "1.8",
            marginBottom: "18px",
            paddingLeft: "22px",
            listStyleType: "disc",
          }}
        >
          <li style={{ marginBottom: "6px" }}>Airport transfers</li>
          <li style={{ marginBottom: "6px" }}>Bay tours & cruises: daytime / nighttime / dinner cruises with fireworks viewing</li>
          <li style={{ marginBottom: "6px" }}>Attraction tickets: Dragon Park, Water Park, Cable Car</li>
          <li>Car rental, eSIM, and handicraft workshops</li>
        </ul>
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "12px 15px",
            marginTop: "15px",
          }}
        >
          <p style={{ color: "#856404", fontSize: "14px", fontWeight: "600", margin: "0 0 6px 0" }}>
            Exclusive offers for Anstay guests
          </p>
          <p style={{ color: "#856404", fontSize: "15px", margin: "0" }}>
            Hotline: <strong style={{ color: "#d9534f", fontSize: "16px" }}>+84 384 945 614</strong>{" "}
            <span style={{ fontSize: "13px" }}>(WhatsApp / Zalo)</span>
          </p>
        </div>
      </div> */}

      <div className="accordion-Hiden">
        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(1)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(1)}
          >
            Opening Instructions
          </button>
          {isTabOpen(1) && (
            <div className="accordion-content-Hiden">
              <div className="guide-button-open">
                <button
                  onClick={() => {
                    setShowImg("B");
                  }}
                  className={`guide-toggle-button-Hiden ${showImg === "B" ? "is-active" : ""}`}
                >
                  Tower A
                </button>
                <button
                  onClick={() => {
                    setShowImg("A");
                  }}
                  className={`guide-toggle-button-Hiden ${showImg === "A" ? "is-active" : ""}`}
                >
                  Tower B
                </button>
              </div>

              {showImg === "A" && (
                <img
                  src="/pictures/hd2ta.jpg"
                  alt="Guide to unlock the door by entering pass"
                  className="guide-image-Hiden"
                />
              )}
              {showImg === "B" && (
                <img
                  src="/pictures/hd1ta.jpg"
                  alt="Guide to unlock the door by swiping card"
                  className="guide-image-Hiden"
                />
              )}

              <button
                onClick={() => setShowPopup("1")}
                className="guide-button-Hiden"
              >
                View Instructions
              </button>
            </div>
          )}
        </div>

        <div className="accordion-item-Hiden">
          <button
            onClick={() => window.location.href = '/minibar'}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(2)}
          >
            Minibar Price List in Room
          </button>


        </div>

        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(2)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(2)}
          >
            Instructions for using electrical appliances
          </button>
          {isTabOpen(2) && (
            <div className="accordion-content-Hiden">
              <div className="sub-accordion-Hiden">
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("2-1");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("2-1")}
                  >
                    Turning on electricity
                  </button>
                  {isTabOpen("2-1") && (
                    <div className="sub-accordion-content-Hiden">
                      <p>
                        - The main power switch is located next to the entrance
                        door
                      </p>
                      <p>- Turn on the main circuit breaker (if needed)</p>
                      <p>- Check that electrical devices are working</p>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("2-2");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("2-2")}
                  >
                    Using the stove
                  </button>
                  {isTabOpen("2-2") && (
                    <div className="sub-accordion-content-Hiden">
                      <p>
                        - Induction stove: Press the power button to turn on
                      </p>
                      <p>- Adjust to appropriate temperature (levels 1-9)</p>
                      <p>- Remember to clean the stove after use</p>
                      <button
                        onClick={() => setShowPopup("2-2")}
                        className="guide-button-Hiden"
                      >
                        View detailed instructions
                      </button>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("2-3");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("2-3")}
                  >
                    Using the washing machine
                  </button>
                  {isTabOpen("2-3") && (
                    <div className="sub-accordion-content-Hiden">
                      <img
                        src="https://i.ibb.co/3y7TNhd6/maygiat.jpg"
                        alt="Instructions for using the washing machine"
                        className="guide-image-Hiden"
                      />
                      <button
                        onClick={() => setShowPopup("2-3")}
                        className="guide-button-Hiden"
                      >
                        View detailed instructions
                      </button>
                    </div>
                  )}
                </div>
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("2-4");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("2-4")}
                  >
                    Water Heater Usage
                  </button>
                  {isTabOpen("2-4") && (
                    <div className="sub-accordion-content-Hiden">
                      <p>- Turn it on and wait 30 minutes</p>
                      <img
                        src="https://i.ibb.co/ZRywD02k/2.jpg"
                        alt=""
                        className="guide-image-Hiden"
                      />
                    </div>
                  )}
                </div>
                {/* Bathtub usage instructions (moved from Electrical Device User Guide) */}
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("8-1");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("8-1")}
                  >
                    Bathtub Usage
                  </button>
                  {isTabOpen("8-1") && (
                    <div className="sub-accordion-content-Hiden">
                      <button
                        onClick={() => setShowPopup("8-1")}
                        className="guide-button-Hiden"
                      >
                        View detailed instructions
                      </button>
                    </div>
                  )}
                </div>
                {/* Electric curtain usage instructions (moved from Electrical Device User Guide) */}
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("8-2");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("8-2")}
                  >
                    Electric Curtain Usage{" "}
                    <span>(Only in Tower A)</span>
                  </button>
                  {isTabOpen("8-2") && (
                    <div className="sub-accordion-content-Hiden">
                      <button
                        onClick={() => setShowPopup("8-2")}
                        className="guide-button-Hiden"
                      >
                        View detailed instructions
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p>
                {" "}
                <strong>IMPORTANT NOTE</strong> There is a trash can
                located ** <strong>under the kitchen area </strong>** – please
                dispose of trash properly to maintain public hygiene. Thank you!
              </p>
            </div>
          )}
        </div>
        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(3)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(3)}
          >
            Elevator Instructions
          </button>
          {isTabOpen(3) && (
            <div className="accordion-content-Hiden">
              <p>- Swipe your key card before selecting the floor</p>
              <p>- Red emergency button for assistance if needed</p>
              <button
                onClick={() => setShowPopup("3")}
                className="guide-button-Hiden"
              >
                Watch video
              </button>
            </div>
          )}
        </div>
        <div className="accordion-item-Hiden">
          <button
            className="accordion-header-Hiden"
            onClick={() => toggleTab(9)}
            aria-expanded={isTabOpen(9)}
          >
            Emergency Ladder User Guide
          </button>
          {isTabOpen(9) && (
            <div className="accordion-content-Hiden">
              <p>- No card required for use</p>
              <button
                onClick={() => setShowPopup("9")}
                className="guide-button-Hiden"
              >
                Watch video
              </button>
            </div>
          )}
        </div>
        <div className="accordion-item-Hiden">
          <button
            className="accordion-header-Hiden"
            onClick={() => toggleTab(11)}
            aria-expanded={isTabOpen(11)}
          >
            Instructions to Locate the Trash Disposal Room
          </button>
          {isTabOpen(11) && (
            <div className="accordion-content-Hiden">
              <p>- No card required for use</p>
              <button
                onClick={() => setShowPopup("11")}
                className="guide-button-Hiden"
              >
                Watch video
              </button>
            </div>
          )}
        </div>

        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(4)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(4)}
          >
            Important Stay Information
          </button>
          {isTabOpen(4) && (
            <div className="accordion-content-Hiden" style={{ textAlign: "left", alignItems: "flex-start", justifyContent: "flex-start", width: "100%" }}>
              <p>
                <strong>General Rules:</strong>
              </p>
              <p>- Check-in time: 15:00, check-out time: 12:00</p>
              <p>- No smoking in the apartment</p>
              <p>- No noise after 22:00</p>
              <p>
                - Do not cook seafood or use strong-smelling items such as
                shrimp paste or durian in the room.
              </p>
              <p>- Do not stain or damage the sofa.</p>
              <p>- Strictly no use of illegal drugs or substances.</p>
              <p>
                <span>VIOLATION FINE: 500,000 VND</span>
              </p>
              <p>
                - During your stay, if you need additional towels or trash bags,
                please contact the reception for assistance(free).
              </p>
              <p>
                <span>ROOM SERVICE POLICY</span>
              </p>
              <p>
                Towels, bottled water, tea, coffee, and amenities are provided
                daily after 4:00 PM.
              </p>
              <p>
                For guests staying two nights or more, room cleaning is
                complimentary during the stay. Please inform the front desk
                before 9:00 AM to arrange a suitable cleaning time.
              </p>

              <p>
                <strong>Safety:</strong>
              </p>
              <p>- Ensure doors are locked when leaving</p>
              <p>- Turn off electrical devices when not in use</p>
              <strong>Contact:</strong>
              <p>
                +84 84 227 2772 (Reception) <br />
                <span>Support for inquiries during your stay</span>
              </p>
              <p>
                +84 38 494 5614 (Customer Service) <br />
                <span>
                  Receiving and handling customer complaints during the stay
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(5)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(5)}
          >
            Equipment Information and Pricing
          </button>
          {isTabOpen(5) && (
            <div className="accordion-content-Hiden">
              <div className="sub-accordion-Hiden">
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("5-1");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("5-1")}
                  >
                    Porcelain Items Table
                  </button>
                  {isTabOpen("5-1") && (
                    <div className="sub-accordion-content-Hiden">
                      <table className="compensation-table-Hiden">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Compensation Price (VND)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Rice bowl</td>
                            <td>Once</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Ashtray</td>
                            <td>Once</td>
                            <td>55,000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Round plate F20</td>
                            <td>Once</td>
                            <td>55,000</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Round plate F25</td>
                            <td>Once</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Tea cup saucer</td>
                            <td>Once</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>Soup bowl</td>
                            <td>Once</td>
                            <td>95,000</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Dipping bowl</td>
                            <td>Once</td>
                            <td>25,000</td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Soup spoon</td>
                            <td>Once</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>Small coffee spoon</td>
                            <td>Once</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>Knife</td>
                            <td>Once</td>
                            <td>110,000</td>
                          </tr>
                          <tr>
                            <td>11</td>
                            <td>Fork</td>
                            <td>Once</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>12</td>
                            <td>Chopsticks</td>
                            <td>Pair</td>
                            <td>15,000</td>
                          </tr>
                          <tr>
                            <td>13</td>
                            <td>Room glass</td>
                            <td>Once</td>
                            <td>145,000</td>
                          </tr>
                          <tr>
                            <td>14</td>
                            <td>Tea cup</td>
                            <td>Once</td>
                            <td>65,000</td>
                          </tr>
                          <tr>
                            <td>15</td>
                            <td>Tablespoon</td>
                            <td>Once</td>
                            <td>60,000</td>
                          </tr>
                          <tr>
                            <td>16</td>
                            <td>Non-stick pan</td>
                            <td>Once</td>
                            <td>340,000</td>
                          </tr>
                          <tr>
                            <td>17</td>
                            <td>Stainless steel cookware set</td>
                            <td>Once</td>
                            <td>980,000</td>
                          </tr>
                          <tr>
                            <td>18</td>
                            <td>Rice cooker</td>
                            <td>Once</td>
                            <td>950,000</td>
                          </tr>
                          <tr>
                            <td>19</td>
                            <td>Plastic cutting board</td>
                            <td>Once</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>20</td>
                            <td>Wooden cutting board</td>
                            <td>Once</td>
                            <td>190,000</td>
                          </tr>
                          <tr>
                            <td>21</td>
                            <td>Room condiment set</td>
                            <td>Set</td>
                            <td>205,000</td>
                          </tr>
                          <tr>
                            <td>22</td>
                            <td>Cutting knife 22cm</td>
                            <td>Once</td>
                            <td>255,000</td>
                          </tr>
                          <tr>
                            <td>23</td>
                            <td>Cutting knife 24cm</td>
                            <td>Once</td>
                            <td>120,000</td>
                          </tr>
                          <tr>
                            <td>24</td>
                            <td>Cooking spatula</td>
                            <td>Once</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>25</td>
                            <td>Kitchen scissors</td>
                            <td>Once</td>
                            <td>70,000</td>
                          </tr>
                          <tr>
                            <td>26</td>
                            <td>Plastic basket</td>
                            <td>Once</td>
                            <td>80,000</td>
                          </tr>
                          <tr>
                            <td>27</td>
                            <td>Room basket</td>
                            <td>Once</td>
                            <td>190,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("5-2");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("5-2")}
                  >
                    Ceramic Tableware Price List
                  </button>
                  {isTabOpen("5-2") && (
                    <div className="sub-accordion-content-Hiden">
                      <table className="compensation-table-Hiden">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Compensation Price (VND)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Bowl</td>
                            <td>Piece</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Ashtray</td>
                            <td>Piece</td>
                            <td>55,000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Round disc F20</td>
                            <td>Piece</td>
                            <td>55,000</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Round disc F25</td>
                            <td>Piece</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>A plate with a cup of tea</td>
                            <td>Piece</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>Bowl of soup</td>
                            <td>Piece</td>
                            <td>95,000</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Dipping bowl</td>
                            <td>Piece</td>
                            <td>25,000</td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Spoon</td>
                            <td>Piece</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>Small coffee spoon</td>
                            <td>Piece</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>Butter knife</td>
                            <td>Piece</td>
                            <td>110,000</td>
                          </tr>
                          <tr>
                            <td>11</td>
                            <td>Plate</td>
                            <td>Piece</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>12</td>
                            <td>Chopsticks</td>
                            <td>Pair</td>
                            <td>15,000</td>
                          </tr>
                          <tr>
                            <td>13</td>
                            <td>Room glass</td>
                            <td>Piece</td>
                            <td>45,000</td>
                          </tr>
                          <tr>
                            <td>14</td>
                            <td>Teacup</td>
                            <td>Piece</td>
                            <td>65,000</td>
                          </tr>
                          <tr>
                            <td>15</td>
                            <td>Soup ladle</td>
                            <td>Piece</td>
                            <td>60,000</td>
                          </tr>
                          <tr>
                            <td>16</td>
                            <td>Non-stick pan</td>
                            <td>Piece</td>
                            <td>340,000</td>
                          </tr>
                          <tr>
                            <td>17</td>
                            <td>Stainless steel pots and pans set</td>
                            <td>Piece</td>
                            <td>980,000</td>
                          </tr>
                          <tr>
                            <td>18</td>
                            <td>Rice cooker</td>
                            <td>Piece</td>
                            <td>950,000</td>
                          </tr>
                          <tr>
                            <td>19</td>
                            <td>Plastic cutting board in CH room</td>
                            <td>Piece</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>20</td>
                            <td>Wooden cutting board in CH's room</td>
                            <td>Piece</td>
                            <td>190,000</td>
                          </tr>
                          <tr>
                            <td>21</td>
                            <td>Spice set in the room</td>
                            <td>Set</td>
                            <td>205,000</td>
                          </tr>
                          <tr>
                            <td>22</td>
                            <td>Hair dryer</td>
                            <td>Once</td>
                            <td>254,000</td>
                          </tr>
                          <tr>
                            <td>23</td>
                            <td>Landline</td>
                            <td>Once</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>24</td>
                            <td>Room key</td>
                            <td>Once</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>25</td>
                            <td>TV 40 inch</td>
                            <td>Once</td>
                            <td>6,410,000</td>
                          </tr>
                          <tr>
                            <td>26</td>
                            <td>TV 45 inch</td>
                            <td>Once</td>
                            <td>8,114,000</td>
                          </tr>
                          <tr>
                            <td>27</td>
                            <td>Double sofa (1.6m or 1.8m)</td>
                            <td>Once</td>
                            <td>7,000,000</td>
                          </tr>
                          <tr>
                            <td>28</td>
                            <td>Sofa cushion</td>
                            <td>Once</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>29</td>
                            <td>Single wooden chair</td>
                            <td>Once</td>
                            <td>1,500,000</td>
                          </tr>
                          <tr>
                            <td>30</td>
                            <td>Round wooden table</td>
                            <td>Once</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>31</td>
                            <td>Glass panel</td>
                            <td>Once</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>32</td>
                            <td>Foot towel (45*80)</td>
                            <td>Once</td>
                            <td>140,000</td>
                          </tr>
                          <tr>
                            <td>33</td>
                            <td>Face towel (34*34)</td>
                            <td>Once</td>
                            <td>45,000</td>
                          </tr>
                          <tr>
                            <td>34</td>
                            <td>Bath towel (70*90)</td>
                            <td>Once</td>
                            <td>184,000</td>
                          </tr>
                          <tr>
                            <td>35</td>
                            <td>Wicker basket</td>
                            <td>Once</td>
                            <td>190,000</td>
                          </tr>
                          <tr>
                            <td>36</td>
                            <td>Lamp shade</td>
                            <td>Once</td>
                            <td>405,000</td>
                          </tr>
                          <tr>
                            <td>37</td>
                            <td>Floor lamp</td>
                            <td>Once</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>38</td>
                            <td>Wall painting (70*90)</td>
                            <td>Once</td>
                            <td>485,000</td>
                          </tr>
                          <tr>
                            <td>39</td>
                            <td>Wall painting (45*45)</td>
                            <td>Once</td>
                            <td>690,000</td>
                          </tr>
                          <tr>
                            <td>40</td>
                            <td>Wall painting (40*40)</td>
                            <td>Once</td>
                            <td>450,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("5-3");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("5-3")}
                  >
                    Compensation Price List
                  </button>
                  {isTabOpen("5-3") && (
                    <div className="sub-accordion-content-Hiden">
                      <table className="compensation-table-Hiden">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Item Type (Species)</th>
                            <th>Size</th>
                            <th>Price (C&B) (VND)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>BED 110*200 (Shafts 3,5,11,12)</td>
                            <td>110*200</td>
                            <td>250,000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Mattress protection</td>
                            <td>190*280</td>
                            <td>380,000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Sheets</td>
                            <td>180*235</td>
                            <td>700,000</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Quilt cover</td>
                            <td>180*235</td>
                            <td>760,000</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Blanket intestines</td>
                            <td>180*235</td>
                            <td>765,000</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>BED 160*200 (Axis 8,9,10)</td>
                            <td>160*200</td>
                            <td>340,000</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Mattress protection</td>
                            <td>230*235</td>
                            <td>815,000</td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Quilt cover</td>
                            <td>230*235</td>
                            <td>890,000</td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>Blanket intestines</td>
                            <td>230*235</td>
                            <td>890,000</td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>BED 180*200 (Axis 1,2,6,7)</td>
                            <td>180*200</td>
                            <td>320,000</td>
                          </tr>
                          <tr>
                            <td>11</td>
                            <td>Mattress protection</td>
                            <td>180*200</td>
                            <td>320,000</td>
                          </tr>
                          <tr>
                            <td>12</td>
                            <td>Sheets</td>
                            <td>260*280</td>
                            <td>490,000</td>
                          </tr>
                          <tr>
                            <td>13</td>
                            <td>Quilt cover</td>
                            <td>250*235</td>
                            <td>925,000</td>
                          </tr>
                          <tr>
                            <td>14</td>
                            <td>Pillowcase</td>
                            <td>50*70</td>
                            <td>90,000</td>
                          </tr>
                          <tr>
                            <td>15</td>
                            <td>Blanket intestines</td>
                            <td>250*235</td>
                            <td>960,000</td>
                          </tr>
                          <tr>
                            <td>16</td>
                            <td>Gut pillow</td>
                            <td>50*70</td>
                            <td>210,000</td>
                          </tr>
                          <tr>
                            <td>17</td>
                            <td>Pillowcase</td>
                            <td>60*80</td>
                            <td>140,000</td>
                          </tr>
                          <tr>
                            <td>18</td>
                            <td>Gut pillow</td>
                            <td>60*80</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>19</td>
                            <td>Swimsuit</td>
                            <td>-</td>
                            <td>435,000</td>
                          </tr>
                          <tr>
                            <td>20</td>
                            <td>BED 220*200 (paired 3,5,11,12)</td>
                            <td>200*200</td>
                            <td>365,000</td>
                          </tr>
                          <tr>
                            <td>21</td>
                            <td>Mattress protection</td>
                            <td>200*200</td>
                            <td>365,000</td>
                          </tr>
                          <tr>
                            <td>22</td>
                            <td>Sheets</td>
                            <td>300*280</td>
                            <td>575,000</td>
                          </tr>
                          <tr>
                            <td>23</td>
                            <td>Quilt cover</td>
                            <td>290*235</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>24</td>
                            <td>Blanket intestines</td>
                            <td>290*235</td>
                            <td>1,115,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("5-4");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("5-4")}
                  >
                    Tools and Equipment Table
                  </button>
                  {isTabOpen("5-4") && (
                    <div className="sub-accordion-content-Hiden">
                      <table className="compensation-table-Hiden">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Compensation Price (VND)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Room trash can (metal)</td>
                            <td>Once</td>
                            <td>329,000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Room trash can (leather)</td>
                            <td>Once</td>
                            <td>366,000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Minibar tray</td>
                            <td>Once</td>
                            <td>569,000</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Tea/coffee tray</td>
                            <td>Once</td>
                            <td>283,000</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Amenities tray</td>
                            <td>Once</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>Leather room service cover</td>
                            <td>Once</td>
                            <td>344,000</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Leather note pad cover</td>
                            <td>Once</td>
                            <td>195,000</td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Cashier leather cover</td>
                            <td>Once</td>
                            <td>302,000</td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>Menu leather cover</td>
                            <td>Once</td>
                            <td>405,000</td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>Tissue box</td>
                            <td>Once</td>
                            <td>344,000</td>
                          </tr>
                          <tr>
                            <td>11</td>
                            <td>Leather door hanger</td>
                            <td>Once</td>
                            <td>165,000</td>
                          </tr>
                          <tr>
                            <td>12</td>
                            <td>Table clock</td>
                            <td>Once</td>
                            <td>473,000</td>
                          </tr>
                          <tr>
                            <td>13</td>
                            <td>Soap dish (black)</td>
                            <td>Once</td>
                            <td>50,000</td>
                          </tr>
                          <tr>
                            <td>14</td>
                            <td>TV remote</td>
                            <td>Once</td>
                            <td>300,000</td>
                          </tr>
                          <tr>
                            <td>15</td>
                            <td>Air conditioner remote</td>
                            <td>Once</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>16</td>
                            <td>Desk lamp</td>
                            <td>Once</td>
                            <td>245,000</td>
                          </tr>
                          <tr>
                            <td>17</td>
                            <td>Living room night lamp</td>
                            <td>Once</td>
                            <td>403,000</td>
                          </tr>
                          <tr>
                            <td>18</td>
                            <td>Floor lamp</td>
                            <td>Once</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>19</td>
                            <td>Wooden clothes hanger</td>
                            <td>Once</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>20</td>
                            <td>Clothes hanger with clips</td>
                            <td>Once</td>
                            <td>25,000</td>
                          </tr>
                          <tr>
                            <td>21</td>
                            <td>Electric kettle</td>
                            <td>Once</td>
                            <td>194,000</td>
                          </tr>
                          <tr>
                            <td>22</td>
                            <td>Hair dryer</td>
                            <td>Once</td>
                            <td>254,000</td>
                          </tr>
                          <tr>
                            <td>23</td>
                            <td>Landline</td>
                            <td>Piece</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>24</td>
                            <td>Room key</td>
                            <td>Piece</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>25</td>
                            <td>40 inch TV</td>
                            <td>Piece</td>
                            <td>6,410,000</td>
                          </tr>
                          <tr>
                            <td>26</td>
                            <td>45 inch TV</td>
                            <td>Piece</td>
                            <td>8,114,000</td>
                          </tr>
                          <tr>
                            <td>27</td>
                            <td> Sofa (1.6m or 1.8m)</td>
                            <td>Piece</td>
                            <td>7,000,000</td>
                          </tr>
                          <tr>
                            <td>28</td>
                            <td>Sofa pillow</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>29</td>
                            <td>Wooden chair</td>
                            <td>Piece</td>
                            <td>1,500,000</td>
                          </tr>
                          <tr>
                            <td>30</td>
                            <td>Wooden round table</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>31</td>
                            <td>Glass surface</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>32</td>
                            <td>Foot towel (45*80)</td>
                            <td>Piece</td>
                            <td>140,000</td>
                          </tr>
                          <tr>
                            <td>33</td>
                            <td>Washcloth (34*34)</td>
                            <td>Piece</td>
                            <td>45,000</td>
                          </tr>
                          <tr>
                            <td>34</td>
                            <td>Towel (70*90)</td>
                            <td>Piece</td>
                            <td>184,000</td>
                          </tr>
                          <tr>
                            <td>35</td>
                            <td>Basket</td>
                            <td>Piece</td>
                            <td>190,000</td>
                          </tr>
                          <tr>
                            <td>36</td>
                            <td>Lamp</td>
                            <td>Piece</td>
                            <td>405,000</td>
                          </tr>
                          <tr>
                            <td>37</td>
                            <td>Tree lights</td>
                            <td>Piece</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>38</td>
                            <td>Wall painting (70*90)</td>
                            <td>Piece</td>
                            <td>485,000</td>
                          </tr>
                          <tr>
                            <td>39</td>
                            <td>Wall painting (45*45)</td>
                            <td>Piece</td>
                            <td>690,000</td>
                          </tr>
                          <tr>
                            <td>40</td>
                            <td>Wall painting (40*40)</td>
                            <td>Piece</td>
                            <td>450,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("5-5");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("5-5")}
                  >
                    Example Tool Map
                  </button>
                  {isTabOpen("5-5") && (
                    <div className="sub-accordion-content-Hiden">
                      <table className="compensation-table-Hiden">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>PRODUCT</th>
                            <th>UNIT</th>
                            <th>COMPENSATION PRICE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Iron trash bin (room)</td>
                            <td>Piece</td>
                            <td>329,000</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Leather trash bin (room)</td>
                            <td>Piece</td>
                            <td>366,000</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Minibar tray</td>
                            <td>Piece</td>
                            <td>569,000</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Tea/coffee tray</td>
                            <td>Piece</td>
                            <td>283,000</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Amenities tray</td>
                            <td>Piece</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>Room service leather cover</td>
                            <td>Piece</td>
                            <td>344,000</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>Note pad leather cover</td>
                            <td>Piece</td>
                            <td>195,000</td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>Cashier leather cover</td>
                            <td>Piece</td>
                            <td>302,000</td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>Menu leather cover</td>
                            <td>Piece</td>
                            <td>405,000</td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>Tissue box</td>
                            <td>Piece</td>
                            <td>344,000</td>
                          </tr>
                          <tr>
                            <td>11</td>
                            <td>Leather door hanger</td>
                            <td>Piece</td>
                            <td>165,000</td>
                          </tr>
                          <tr>
                            <td>12</td>
                            <td>Clock</td>
                            <td>Piece</td>
                            <td>473,000</td>
                          </tr>
                          <tr>
                            <td>13</td>
                            <td>Soap dish (black)</td>
                            <td>Piece</td>
                            <td>50,000</td>
                          </tr>
                          <tr>
                            <td>14</td>
                            <td>TV remote</td>
                            <td>Piece</td>
                            <td>300,000</td>
                          </tr>
                          <tr>
                            <td>15</td>
                            <td>Air-conditioner remote</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>16</td>
                            <td>Desk lamp</td>
                            <td>Piece</td>
                            <td>245,000</td>
                          </tr>
                          <tr>
                            <td>17</td>
                            <td>Living room night lamp</td>
                            <td>Piece</td>
                            <td>403,000</td>
                          </tr>
                          <tr>
                            <td>18</td>
                            <td>Tree-shaped lamp</td>
                            <td>Piece</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>19</td>
                            <td>Wooden hanger</td>
                            <td>Piece</td>
                            <td>30,000</td>
                          </tr>
                          <tr>
                            <td>20</td>
                            <td>Hanger with clips</td>
                            <td>Piece</td>
                            <td>25,000</td>
                          </tr>
                          <tr>
                            <td>21</td>
                            <td>Electric kettle</td>
                            <td>Piece</td>
                            <td>194,000</td>
                          </tr>
                          <tr>
                            <td>22</td>
                            <td>Hair dryer</td>
                            <td>Piece</td>
                            <td>254,000</td>
                          </tr>
                          <tr>
                            <td>23</td>
                            <td>Landline phone</td>
                            <td>Piece</td>
                            <td>200,000</td>
                          </tr>
                          <tr>
                            <td>24</td>
                            <td>Room key</td>
                            <td>Piece</td>
                            <td>100,000</td>
                          </tr>
                          <tr>
                            <td>25</td>
                            <td>40-inch TV</td>
                            <td>Piece</td>
                            <td>6,410,000</td>
                          </tr>
                          <tr>
                            <td>26</td>
                            <td>45-inch TV</td>
                            <td>Piece</td>
                            <td>8,114,000</td>
                          </tr>
                          <tr>
                            <td>27</td>
                            <td>Double sofa (1.6m–1.8m)</td>
                            <td>Piece</td>
                            <td>7,000,000</td>
                          </tr>
                          <tr>
                            <td>28</td>
                            <td>Sofa cushion</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>29</td>
                            <td>Single wooden chair</td>
                            <td>Piece</td>
                            <td>1,500,000</td>
                          </tr>
                          <tr>
                            <td>30</td>
                            <td>Wooden round table</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>31</td>
                            <td>Glass table top</td>
                            <td>Piece</td>
                            <td>1,000,000</td>
                          </tr>
                          <tr>
                            <td>32</td>
                            <td>Foot towel (45×80)</td>
                            <td>Piece</td>
                            <td>140,000</td>
                          </tr>
                          <tr>
                            <td>33</td>
                            <td>Face towel (34×34)</td>
                            <td>Piece</td>
                            <td>45,000</td>
                          </tr>
                          <tr>
                            <td>34</td>
                            <td>Bath towel (70×90)</td>
                            <td>Piece</td>
                            <td>184,000</td>
                          </tr>
                          <tr>
                            <td>35</td>
                            <td>Laundry basket</td>
                            <td>Piece</td>
                            <td>190,000</td>
                          </tr>
                          <tr>
                            <td>36</td>
                            <td>Lamp</td>
                            <td>Piece</td>
                            <td>405,000</td>
                          </tr>
                          <tr>
                            <td>37</td>
                            <td>Tree lights</td>
                            <td>Piece</td>
                            <td>1,015,000</td>
                          </tr>
                          <tr>
                            <td>38</td>
                            <td>Wall painting (70×90)</td>
                            <td>Piece</td>
                            <td>485,000</td>
                          </tr>
                          <tr>
                            <td>39</td>
                            <td>Wall painting (45×45)</td>
                            <td>Piece</td>
                            <td>690,000</td>
                          </tr>
                          <tr>
                            <td>40</td>
                            <td>Wall painting (40×40)</td>
                            <td>Piece</td>
                            <td>450,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(6)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(6)}
          >
            Hotel Map
          </button>
          {isTabOpen(6) && (
            <div className="accordion-content-Hiden">
              <div className="hotel-map-Hiden">
                <div className="floor-plan-Hiden">
                  <div className="floor-level-Hiden">
                    <h3>Hotel Floor Plan Image</h3>
                    <div className="floor-areas-Hiden">
                      <img
                        style={{ width: "70vw" }}
                        src="https://i.ibb.co/HfPXRbX9/image-1.png"
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="floor-level-Hiden">
                    <h3>Basement (B1–B2)</h3>
                    <div className="floor-areas-Hiden">
                      <div className="area-Hiden">
                        Parking Area: For residents and hotel guests
                      </div>
                      <div className="area-Hiden">
                        Technical Zone: Includes electrical, water, and security
                        systems
                      </div>
                    </div>
                  </div>

                  <div className="floor-level-Hiden">
                    <h3>Ground Floor (1st Floor)</h3>
                    <div className="floor-areas-Hiden">
                      <div className="area-Hiden">
                        Reception Lobby: A luxurious welcoming area for guests
                      </div>
                      <div className="area-Hiden">
                        Front Desk: Where check-in and check-out procedures are
                        handled
                      </div>
                      <div className="area-Hiden">
                        Waiting Area: Comfortable seating space for waiting
                        guests
                      </div>
                      <div className="area-Hiden">
                        Security Post: Ensures 24/7 safety and monitoring
                      </div>
                    </div>
                  </div>

                  <div className="floor-level-Hiden">
                    <h3>Floors 2–5</h3>
                    <div className="floor-areas-Hiden">
                      <div className="area-Hiden">
                        Meeting and Conference Rooms: Fully equipped with modern
                        facilities
                      </div>
                      <div className="area-Hiden">
                        Gym: Fitness and exercise area
                      </div>
                      <div className="area-Hiden">
                        <span> Floor 3: Children’s Play Area (Free)</span>
                      </div>

                      <div className="area-Hiden">
                        Common Area: A relaxing and socializing space
                      </div>
                    </div>
                  </div>

                  <div className="floor-level-Hiden">
                    <h3>40 Floor</h3>
                    <div className="floor-areas-Hiden">
                      <div className="area-Hiden">
                        Infinity Pool: Located at the top level with sweeping
                        views of Ha Long Bay
                      </div>
                      <div className="area-Hiden">
                        Sky Bar: Outdoor bar serving drinks and hosting events
                      </div>
                      <div className="area-Hiden">
                        Relaxation Zone: Loungers and greenery for leisure and
                        rest
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="accordion-item-Hiden">
          <button
            className="accordion-header-Hiden"
            onClick={() =>
              window.open("https://zalo.me/g/vwxouf293", "_blank")
            }
          >
            Anstay Ha Long Guest Community (Zalo)
          </button>
        </div>
        {/*  {isTabOpen(10) && (
            <div className="accordion-content-Hiden">
              <div className="sub-accordion-Hiden">
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("10-1");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("10-1")}
                  >
                    Need a motorbike to get around?
                  </button>
                  {isTabOpen("10-1") && (
                    <div className="sub-accordion-content-Hiden">
                      <p>Zalo/Whatsapp: 0936.486.890</p>
                      <p>Phone: 0982.461.015</p>
                      <img
                        style={{ width: "74vw" }}
                        src="https://i.ibb.co/chPHm58X/image-2.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div className="sub-accordion-item-Hiden">
                  <button
                    className="sub-accordion-header-Hiden"
                    onClick={() =>
                      window.open("https://zalo.me/g/vwxouf293", "_blank")
                    }
                  >
                    Zalo – Order Food Delivered to Your Room 24/7
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(12)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(12)}
          >
          </button>
          {isTabOpen(12) && (
            <div className="accordion-content-Hiden">
              <div className="sub-accordion-Hiden">
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("12-1");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("12-1")}
                  >
                    Food
                  </button>
                  {isTabOpen("12-1") && (
                    <div className="sub-accordion-content-Hiden">
                      <div className="food-all">
                        <div className="food">
                          <div className="descriptionFood food-left">
                            <h2>Breakfast</h2>
                            <p>
 Huong Beo Crab Noodle – Tan Mai St., Cai Dam,
                              Bai Chay (50k/bowl)
                            </p>
                            <p>
 Ngoc Ha Seafood Noodle – 334 Ha Long St., Bai
                              Chay (from 40k/bowl)
                            </p>
                            <p>
 Cua Fish Cake Noodle, Rice Roll with Squid – Co
                              Tuyet Garden, Cai Dam, Bai Chay (from 35k/set)
                            </p>
                            <p>
 Tuan Hieu Chicken Pho – 352 Cai Dam (from
                              40k/bowl)
                            </p>
                            <p>
 Hanoi Chicken Pho – Rang Dua, Cai Dam, Bai Chay
                              (from 50k/bowl)
                            </p>
                            <p>
 Crab Paste Noodle with Fried Fat – 1124 Ha Long
                              St., Bai Chay (from 35k/serving)
                            </p>
                            <p>
 Dipping Fish Noodle – Garden, Cai Dam, Bai Chay
                              (from 35k/serving)
                            </p>
                            <p>
 Hue Beef Noodle – Phuong Dong Garden, Cai Dam,
                              Bai Chay (from 35k/serving)
                            </p>
                            <p>
 Thuy Thuy Delicious Banh Mi – 420 Cai Dam (from
                              20k)
                            </p>
                            <p>
 Pork Rib Bamboo Shoot Noodle – Garden, Cai Dam,
                              Bai Chay (from 35k/bowl)
                            </p>
                          </div>
                          <div className="img-food">
                            <img
                              src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/7/21/1219307/Bun-Cu-Ky.jpeg"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="food">
                          <div className="img-food">
                            <img
                              src="https://hotel84.com/hotel84-images/news/photo/nhahang-cua-vang-halong.jpg"
                              alt=""
                            />
                            <img
                              src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/487729480_1185500953368411_2510347861964589143_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=lxTcEOeEcvkQ7kNvwGtzSpm&_nc_oc=AdmuH3iBX_CYDU09x7cTO7bXBHg-XbxBZKIJYQWfhWoZeMPzET9t8BeSv3knQPH_uXw&_nc_zt=23&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=SFJJIjGDsRp4WvPq307ilg&oh=00_AfIONJ7R0Qp3BJndsEPR5m4c-XeqE0RB7_hICLIO0uxu1g&oe=683D99AF"
                              alt=""
                            />
                          </div>
                          <div className="descriptionFood food-right">
                            <h2>Restaurants/Seafood/Main meals</h2>
                            <p>Ngoc Phuong Nam Restaurant</p>
                            <p>Hong Hanh 3 – 50 Ha Long, Bai Chay</p>
                            <p>
 Hong Hanh 6 – Group 11C, Zone 4A, Hung Thang
                              Ward
                            </p>
                            <p>
 Cua Vang Restaurant – 32 Phan Chau Trinh, Bai
                              Chay
                            </p>
                            <p>
 Green Restaurant – No.2 Hoang Quoc Viet, Cai
                              Dam, Bai Chay
                            </p>
                            <p>
 Thuy Linh Restaurant – Opposite Newlife
                              apartment, Hoang Quoc Viet St.
                            </p>
                            <p>
 Thien Anh Restaurant – 11 Phan Boi Chau, Bai
                              Chay
                            </p>
                            <p>
 Sakurajima Corner Japanese Restaurant – Block
                              A, Green Bay Village (buffet from 399k)
                            </p>
                            <p>
 Som Maul Korean Restaurant – Rang Dua, Cai Dam
                              (buffet from 170k)
                            </p>
                            <p>
 Won Korean Restaurant – Next to Blue Sky Hotel
                              (from 150k/person)
                            </p>
                            <p>
 YnY Chinese Restaurant – Rang Dua, Cai Dam
                              (from 50k/person)
                            </p>
                            <p>
 Shu Xiang Yuan Chinese Restaurant – No.2 Rang
                              Dua, Cai Dam (from 50k/person)
                            </p>
                            <p>
 Ba Toa 1900 Beef Hotpot – Rang Dua, Cai Dam
                              (from 150k/person)
                            </p>
                            <p>
 Kiwi Grilled Hotpot – Vinegar Dipped Beef – 1st
                              floor, Newlife Building A (from 150k/person)
                            </p>
                            <p>
 Mapa Bistro – 409 Ha Long St., Bai Chay (from
                              250k/person)
                            </p>
                          </div>
                        </div>
                        <div className="food">
                          <div className="descriptionFood food-left">
                            <h2>Snacks & Light Meals</h2>
                            <p>
 Fried Skewers, Light Snacks – To Cafe, 50 Hung
                              Thang (from 50k/person)
                            </p>
                            <p>
 Bun Dau Mam Tom – Anh Em Restaurant, Garden
                              Zone Cai Dam (from 40k/set)
                            </p>
                            <p>
 Fujicow Volcano Grilled Beef – 551 Ha Long St.,
                              Bai Chay (from 80k/set)
                            </p>
                            <p>
 Jinju Kimbap – Garden Zone, Cai Dam (from
                              50k/person)
                            </p>
                            <p>
 Vườn Đào Night Market Snacks (from 50k/person)
                            </p>
                            <p>
 Bau Pizza – No.29, Group 10, Zone 5 Bai Chay
                              (from 80k/pizza)
                            </p>
                            <p>Lotteria – 676 Ha Long</p>
                            <p>
 Quân Fried Rice & Pho – Garden, Cai Dam (from
                              45k/set)
                            </p>
                            <p>
 Nem Nuong & Yogurt – Behind Building C, Newlife
                              Apartment
                            </p>
                            <p>
 Quê Gifts Cooperative – 1132 Ha Long, Ao Ca
                            </p>
                          </div>
                          <div className="img-food">
                            <img
                              src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/487828241_8895413127230861_7865375941938956231_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=THIXI6XdQGgQ7kNvwGgcS6x&_nc_oc=AdkkKOEXk7elg1tOm93Os3xEHoVubYVbcvLK5QG_dzVIo6zxWUGcnw1THvJpWJDV-HI&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=fFHedRwi1zgmdgujkZjT9Q&oh=00_AfLg1vQMxSL15f4uUK9WM3jUhZMyZFpOa8UTy5eMzrWaOg&oe=683F00FF"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="food">
                          <div className="img-food">
                            <img
                              src="https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/468951126_1288895119091087_4787621595311610663_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=aVJBIrkYWQ4Q7kNvwHTCUCa&_nc_oc=AdkYGN3zFWskIqzIG5-E4WDqvnwx9ZsfRKnuuu7WuwuuK6UKd46vDPBfa_HxdWbePtY&_nc_zt=23&_nc_ht=scontent.fsgn5-3.fna&_nc_gid=a97BhvzzKVnlEbMOKGvNkQ&oh=00_AfL4eXxS1dD554nRY6xaEUDIgq6WZGc18Tdt4hhd0bPZIQ&oe=683CAE1C"
                              alt=""
                            />
                          </div>
                          <div className="descriptionFood food-right">
                            <h2>Late Night Eats</h2>
                            <p>
 Ba Lan Beo Night Food – Entrance of Vuon Dao
                              Market
                            </p>
                            <p>
 Minh Tuan Night Food – Hau Can St., Bai Chay
                            </p>
                            <p>Lan Thu Night Food – 444 Cai Dam</p>
                            <p>Co Huong Night Food – No.186 Gieng Day</p>
                          </div>
                        </div>
                        <div className="food">
                          <div className="descriptionFood food-left">
                            <h2>Snail Restaurants</h2>
                            <p>
 Oc Chull – Near Cua Vang Restaurant, Cai Dam
                            </p>
                            <p>Oc Nang Dau – 228 EC Hung Thang</p>
                            <p>Oc Ngoc Son – 538 Cai Dam</p>
                            <p>
 Oc Gieng Day – No.14, Group 4, Zone 4, Gieng
                              Day
                            </p>
                          </div>
                          <div className="img-food">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1kTB2ZfJ2gvvYwFWb2mVvLwqZqa4fTdE7-w&s"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="sub-accordion-item-Hiden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTab("12-2");
                    }}
                    className="sub-accordion-header-Hiden"
                    aria-expanded={isTabOpen("12-2")}
                  >
                    Drinks
                  </button>
                  {isTabOpen("12-2") && (
                    <div className="sub-accordion-content-Hiden">
                      <div className="food-all">
                        <div className="food">
                          <div className="img-food">
                            <img
                              src="https://dulichtoday.vn/wp-content/uploads/2023/08/la-luna-coffee-ha-long-2-1.jpg"
                              alt=""
                            />
                          </div>
                          <div className="descriptionFood food-right">
                            <h2>
                              Drinks – Cafés, Chill Places, Beverage Spots
                            </h2>
                            <p>La Luna Coffee – Monaco Hill, Bai Chay</p>
                            <p>
 Cai Quan – 2A Cao Dat, Bai Chay (Ao Ca
                              Lakefront)
                            </p>
                            <p>Laika Beach Café – Coastal Road, Bai Chay</p>
                            <p>
 Thong Zeo – Naval Canteen, Naval Hill, Vuon
                              Dao, Bai Chay
                            </p>
                            <p>
 To Café (also serves fried skewers & light
                              meals) – 50 Hung Thang
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

       Popups for video guides
      {showPopup && (
        <>
          <div
            className="popup-overlay-Hiden"
            onClick={() => setShowPopup(null)}
          >
            <div
              className="popup-content-Hiden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                style={{
                  opacity: 2,
                  filter: "none",
                  backdropFilter: "none",
                  zIndex: 9999,
                  position: "relative",
                  display: "block",
                  background: "#000",
                }}
              >
                <source src={getVideoUrl(showPopup)} type="video/mp4" />
              </video>
              <button
                onClick={() => setShowPopup(null)}
                className="close-popup-Hiden"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {true && (
        <div className="accordion-item-Hiden">
          <button
            onClick={() => toggleTab(0)}
            className="accordion-header-Hiden"
            aria-expanded={isTabOpen(0)}
          >
          </button>
          {isTabOpen(0) && (
            <div className="accordion-content-Hiden">
              <div className="guide-button-open">
                <div className="apart-own">
                  <div className="image-own">
                    <img src="https://i.ibb.co/m5RxVt4W/anh2.jpg" alt="" />
                    <img src="https://i.ibb.co/CpKqbd90/anh1.jpg" alt="" />
                  </div>
                  <div className="text-own">
                    <h4>Welcome to the world of Anstay's resort living!</h4>
                    <p>
                      You're enjoying your stay in a lovely apartment – but what
                      if you could own one just like this?
                    </p>
                    <p>
                      For just over 2 billion VND, you can become the legal
                      owner – with a permanent red book – of your dream
                      apartment!
                    </p>
                    <p>
                      High rental performance – you can earn stable monthly
                      income (money keeps coming in while you're relaxing...)
                    </p>
                    <p>
                      Bank support up to 70–80%, with quick and easy transfer
                      procedures.
                    </p>
                    <p>
                      💬“If you’ve fallen for that bed, or that luxurious
                      balcony view – we can turn that dream into reality for
                      you!”
                    </p>
                    <p>
                      Click{" "}
                      <button
                        className="contact-button"
                        onClick={() => {
                          handleWould();
                        }}
                      >
                        I want to buy
                      </button>{" "}
                      – the Anstay team is ready to assist you right away!
                    </p>
                    <p>
                      Contact us via Zalo :{" "}
                      <a href="http://id.zalo.me/account?continue=http%3A%2F%2Fzalo.me%2F0916612772">
                        <strong> Anstay Residence</strong>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>  */}
      </div>

      <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "15px", margin: "20px 0", textAlign: "center" }}>
        <p style={{ color: "#856404", fontSize: "15px", margin: "0", fontWeight: "500" }}>
          Anstay supports guests to use kites and boomerangs for free.
        </p>
        <p style={{ color: "#856404", fontSize: "15px", margin: "8px 0 0 0", fontWeight: "500" }}>
          If damaged or lost, an additional fee of <strong>150,000đ/item</strong> applies.
        </p>
      </div>

      {/* Popups for video guides */}
      {showPopup && (
        <>
          <div
            className="popup-overlay-Hiden"
            onClick={() => setShowPopup(null)}
          >
            <div
              className="popup-content-Hiden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                style={{
                  opacity: 2,
                  filter: "none",
                  backdropFilter: "none",
                  zIndex: 9999,
                  position: "relative",
                  display: "block",
                  background: "#000",
                }}
              >
                <source src={getVideoUrl(showPopup)} type="video/mp4" />
              </video>
              <button
                onClick={() => setShowPopup(null)}
                className="close-popup-Hiden"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default HidenEn;