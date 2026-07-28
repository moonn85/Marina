import { useState } from "react";
import {
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Radio,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import "./Booking.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Booking = () => {
  const [form] = Form.useForm();
  const [totalPrice, setTotalPrice] = useState(4390000);

  return (
    <div className="booking-container">
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card>
            <Form form={form} layout="vertical" requiredMark>
              <div className="section">
                <Title level={5} className="section-title">
                  <UserOutlined className="section-title-icon" />
                  Đặt tour
                </Title>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="tourType" label="Chọn loại tour" required>
                      <Select placeholder="Tour Trong Nước">
                        <Option value="domestic">Tour Trong Nước</Option>
                        <Option value="international">Tour Nước Ngoài</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="tourName" label="Chọn tour" required>
                      <Select placeholder="HÀ NỘI - SAPA 4 NGÀY 3 ĐÊM">
                        <Option value="hanoi-sapa">
                          HÀ NỘI - SAPA 4 NGÀY 3 ĐÊM
                        </Option>
                        <Option value="other">Tour khác</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="adults" label="Người lớn" required>
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="children" label="Trẻ em">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="smallChildren"
                      label="Trẻ nhỏ (2 - 5 tuổi)"
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="infants" label="Em bé">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="departureDate" label="Ngày khởi hành" required>
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </div>

              <div className="section">
                <Title level={5} className="section-title">
                  <UserOutlined className="section-title-icon" />
                  Thông tin khách hàng
                </Title>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="fullName" label="Họ và tên" required>
                      <Input placeholder="Họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Điện thoại" required>
                      <Input placeholder="Điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="email" label="Email" required>
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="address" label="Địa chỉ" required>
                      <Input placeholder="Địa chỉ" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="province" label="Chọn tỉnh/thành" required>
                      <Select placeholder="Chọn tỉnh/thành">
                        <Option value="hanoi">Hà Nội</Option>
                        <Option value="hcm">TP Hồ Chí Minh</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="district" label="Chọn quận/huyện" required>
                      <Select placeholder="Chọn quận/huyện">
                        <Option value="district1">Quận 1</Option>
                        <Option value="district2">Quận 2</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="ward" label="Chọn phường/xã" required>
                  <Select placeholder="Chọn phường/xã">
                    <Option value="ward1">Phường 1</Option>
                    <Option value="ward2">Phường 2</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                  <TextArea rows={4} placeholder="Ghi chú" />
                </Form.Item>
              </div>

              <div className="section">
                <Title level={5} className="section-title">
                  <CreditCardOutlined className="section-title-icon" />
                  Hình thức thanh toán
                </Title>

                <Form.Item name="paymentMethod">
                  <div>
                    <Radio.Group>
                      <Space className="payment-methods-row">
                        <Radio value="company">
                          <div className="payment-company">
                            <BankOutlined className="company-icon" />
                            Thanh toán tại công ty
                          </div>
                        </Radio>

                        <Radio value="online">
                          <Button
                            type="primary"
                            className="payment-online-btn"
                            icon={<CreditCardOutlined />}
                          >
                            Thanh toán trực tuyến
                          </Button>
                        </Radio>

                        <Radio value="transfer">
                          <div className="payment-transfer">
                            <img
                              src="https://via.placeholder.com/24"
                              alt="bank"
                              className="bank-icon"
                            />
                            Thanh toán chuyển khoản
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>

                    <div className="company-address-container">
                      <Text>55 Đỗ Quang Đẩu, P. Phạm Ngũ Lão, Quận 1,</Text>
                      <br />
                      <Text>Thành Phố Hồ Chí Minh, Vietnam</Text>
                    </div>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Title level={5}>Thông tin đặt tour</Title>
            <Text strong>Tên:</Text>
            <Text> HÀ NỘI - SAPA 4 NGÀY 3 ĐÊM</Text>

            <Divider className="divider" />

            <Row>
              <Col span={8}>
                <Text>Thời gian:</Text>
              </Col>
              <Col span={16}>
                <Text>4 Ngày 3 Đêm</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text>Phương tiện:</Text>
              </Col>
              <Col span={16}>
                <Text>Ô tô/ Máy bay</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text>Lưu trú:</Text>
              </Col>
              <Col span={16}>
                <Text>Khách sạn 2-5 sao</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text>Khởi hành:</Text>
              </Col>
              <Col span={16}>
                <Text>Hàng tuần</Text>
              </Col>
            </Row>

            <Divider className="divider" />

            <Row className="price-row">
              <Col span={12}>
                <Text strong>Tổng tiền</Text>
              </Col>
              <Col span={12} className="total-price">
                <Text strong style={{ color: "red" }}>
                  {totalPrice.toLocaleString()} vnd
                </Text>
              </Col>
            </Row>

            <Row className="price-row">
              <Col span={12}>
                <Text strong>Thành tiền</Text>
              </Col>
              <Col span={12}></Col>
            </Row>

            <Button type="primary" block size="large">
              Thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Booking;
