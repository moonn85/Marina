import './AboutCP.css';
import { Card, Typography, Divider } from "antd";
import BeSearchForm from "../../BeForms/BeSearchForm.tsx";

const { Title, Text } = Typography;

const AboutCP = () => {
  return (
    <div className="aboutcp">
      <div className="banner">
        <div className="banner-img">
          <img src="https://crm.flesta.vn//uploads/about_us/ISN-JUTEC.png" alt="" />
          <div className="banner-des">Thông Tin doanh nghiệp</div>
        </div>
      </div>
      <div className="description-box" >
        <Card title={<span style={{ fontSize: '22px' }}>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ANSTAY</span>} bordered={false} style={{ width: 1000 }}>
          <div className="info-pair">
            <Title level={5}>Thương hiệu <span>:</span></Title>
            <Text>ANSTAY VN</Text>
          </div>
          <Divider />

          <div className="info-pair">
            <Title level={5}>Mô tả doanh nghiệp <span>:</span></Title>
            <Text >
              Cho thuê căn hộ và văn phòng dịch vụ,

              Quản lý căn hộ

              , Bất động sản
            </Text>
          </div>
          <Divider />

          <div className="info-pair">
            <Title level={5}>Đại diện pháp lý<span>:</span></Title>
            <Text>Ông Nghiêm Thành An</Text>
          </div>
          <Divider />

          <div className="info-pair">
            <Title level={5}>Ngày thành lập<span>:</span></Title>
            <Text>06/03/2026</Text>
          </div>
          <Divider />

          <div className="info-pair">
            <Title level={5}>Vốn điều lệ<span>:</span></Title>
            <Text>500,000,000 VND</Text>
          </div>
          <Divider />

          <div className="info-pair">
            <Title level={5}>Trụ sở<span>:</span></Title>
            <Text>
              Nhà số MS-5, khu đô thị dịch vụ Hùng Thắng, Phường Bãi Cháy, Tỉnh Quáng Ninh, Việt Nam
            </Text>
          </div>
          <Divider />
          <div className="info-pair">
            <Title level={5}>Điện thoại (trụ sở chính)<span>:</span></Title>
            <Text>
              096 543 4556
            </Text>
          </div>
          <Divider />
          <div className="info-pair">
            <Title level={5}>Mã số thuế<span>:</span></Title>
            <Text>5702218084</Text>
          </div>
        </Card>
      </div>
    </div>
  )
}
export default AboutCP;