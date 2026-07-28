// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    console.log("aaa:", orderId); // Có thể là transactionId
    if (!orderId) {
      setStatus("fail");
      return;
    }
    axios
      .get(`https://anstay.com.vn/api/payments/transaction/${orderId}`)
      .then((res) => {
        if (res.data.status === "COMPLETED") setStatus("success");
        else setStatus("fail");
      })
      .catch(() => setStatus("fail"));
  }, [location]);

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      {status === "checking" && <p>Đang kiểm tra trạng thái thanh toán...</p>}
      {status === "success" && (
        <div>
          <h2 style={{ color: "green" }}>🎉 Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã đặt phòng tại Anstay!</p>
        </div>
      )}
      {status === "fail" && (
        <div>
          <h2 style={{ color: "red" }}>Thanh toán thất bại!</h2>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
