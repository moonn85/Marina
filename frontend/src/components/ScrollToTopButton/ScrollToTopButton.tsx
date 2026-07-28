import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton = ({ showAt = 500 }) => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > showAt);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAt]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-to-top ${showScroll ? "visible" : "hidden"}`}
      onClick={handleScrollToTop}
      aria-label="Cuộn lên đầu trang"
    >
      <span className="scroll-icon" aria-hidden="true">↑</span>
    </button>
  );
};

export default ScrollToTopButton;
