import React from "react";
import { Card } from "antd";
import {
  ShoppingCartOutlined,
  SafetyOutlined,
  EditOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "./Should.css";

const features = [
  {
    icon: <ShoppingCartOutlined className="vtg-icon" />,
    title: "GIÁ TỐT - NHIỀU ƯU ĐÃI",
    description: "Ưu đãi và quà tặng hấp dẫn khi mua tour online",
  },
  {
    icon: <SafetyOutlined className="vtg-icon" />,
    title: "THANH TOÁN AN TOÀN",
    description: "Được bảo mật bởi tổ chức quốc tế",
  },
  {
    icon: <EditOutlined className="vtg-icon" />,
    title: "TƯ VẤN MIỄN PHÍ",
    description: "Hỗ trợ tư vấn offline/ online miễn phí",
  },
  {
    icon: <StarOutlined className="vtg-icon" />,
    title: "THƯƠNG HIỆU UY TÍN",
    description: "Thương hiệu lữ hành hàng đầu Việt Nam",
  },
];

const Should = () => {
  return (
    <div className="vtg-container">
      <h2 className="vtg-title">Dù hành trình ở đâu, tinh tế và giá trị xứng đáng vẫn theo chân bạn</h2>
      <p className="vtg-description">
      Anstay Group đồng hành cùng bạn trên mọi chuyến đi, mang đến trải nghiệm nghỉ dưỡng đẳng cấp, an tâm và xứng đáng với giá trị bạn lựa chọn.
      </p>
      <div className="vtg-grid-container">
        {features.map((feature, index) => (
          <Card key={index} className="vtg-feature-card">
            <div className="vtg-icon-wrapper">{feature.icon}</div>
            <h3 className="vtg-feature-title">{feature.title}</h3>
            <p className="vtg-feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Should;
