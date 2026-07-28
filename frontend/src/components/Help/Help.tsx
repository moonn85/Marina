import { useState } from "react";
import { Tabs, Collapse, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Help.css";
import { Form, Input, Button } from "antd";

const { TabPane } = Tabs;
const { Panel } = Collapse;

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const Help = () => {
  const [activeKey, setActiveKey] = useState("1");

  const getTabTitle = () => {
    return activeKey === "1" ? "Các vấn đề thường gặp" : "Tạo issue";
  };

  const troubleshootItems = [
    {
      key: "1",
      label: "1. Mạng",
      children: [
        "Mạng chậm, mạng không kết nối",
        "+ Khởi động lại modem",
        "+ Trong trường hợp không thấy modem thì sẽ sập aptomat và khởi động lại sau 10 giây",
      ],
    },
    {
      key: "2",
      label: "2. Truyền hình Nhật/ Cab",
      children: [
        "Xem bị giật, dừng hình, không kết nối",
        "+ Khởi động lại box Truyền hình Nhật/ Cab",
        "+ Kiểm tra dây HDMI(dây nối giữa TV và box) có đứt hoặc không",
      ],
    },
    {
      key: "3",
      label: "3. Điều hòa không mát",
      children: [
        "+ Tắt điều hòa nghỉ 10 phút. Hoặc sập Aptomat nghỉ 10 phút",
        "+ Sau khi bật điều hòa lại thì set up nhiệt độ không chênh lệch quá 8 độ so với nhiệt độ ngoài trời",
      ],
    },
    {
      key: "4",
      label: "4. Mất điện",
      children: [
        "+ Kiểm tra hành lang và các căn hộ xung quanh xem có bị mất điện không",
        "+ Trong trường hợp chỉ căn hộ khách bị mất điện thì sập Aptomat và khởi động lại",
      ],
    },
    {
      key: "5",
      label: "5. Đồ điện/ điện tử",
      children: [
        "Bếp từ nháy đèn, có tiếng Bip Bip báo động",
        "+ Tắt bếp, nghỉ 3 phút và khởi động lại",
        "+ Sập Aptomat, nghỉ 3 hút và khởi động lại",
        "Bếp từ không hoạt động, hiển thị các chữ cái kí hiệu",
        "+ Bếp từ đang bật chức năng khóa an toàn. Tìm các nút có kí hiệu chìa khóa/Lock hoặc hình ảnh tương tự, chạm và giữ 5 giây đến khi các chữ cái/ kí hiệu biến mất.",
        "Lò vi sóng không hoạt động",
        "+ Rút điện ra cắm lại. Hoặc sập Aptomat và khởi động lại ",
        "+ Trong trường hợp sử dụng liên tục thời gian dài thì cần mở lò cho nguội, các bộ phận, thiết bị trong lò hạt nhiệt rồi sử dụng tiếp",
      ],
    },
    {
      key: "6",
      label: "6. Máy giặt",
      children: [
        "Máy giặt có hiện tượng rung mạnh và kêu to.",
        "+ Điều chỉnh lại vị trí kê máy cho vững chãi và chắc chắn.",
        "Máy giặt kêu to",
        "+ Do quần áo trong lồng giặt bị xoắn, làm rối đội hình giặt hoặc do có vật thể lạ trong máy -> Tắt máy và sắp xếp lại quần áo.",
        "Máy giặt không thực hiện giặt/ xả/ vắt.",
        "+ Kiểm tra thật kỹ xem nắp máy giặt đã đóng chưa.",
        "+ Kiểm tra lại ống xả nước có bị tắc hay không.",
      ],
    },
  ];

  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [showGlobalError, setShowGlobalError] = useState(false);

  const onFinish = async (values: FormData) => {
    try {
      const response = await fetch("https://anstay.com.vn/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Email sent successfully");
        form.resetFields();
        setErrorMessage("Gửi thành công!");
        setShowGlobalError(true);
      } else {
        console.error("Failed to send email");
        setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau!");
        setShowGlobalError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau!");
      setShowGlobalError(true);
    }
  };

  const onFinishFailed = ({ errorFields }: any) => {
    if (errorFields.length === 1) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      setShowGlobalError(true);
    } else {
      setErrorMessage("");
      setShowGlobalError(false);
    }
  };

  return (
    <>
      <div className="help-poster">
        <h1>{getTabTitle()}</h1>
      </div>
      <div className="app-container">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          className="app-tabs"
        >
          <TabPane tab="Các vấn đề thường gặp" key="1">
            <Collapse
              bordered={false}
              expandIconPosition="end"
              className="issues-collapse"
            >
              {troubleshootItems.map((item) => (
                <Panel
                  header={item.label}
                  key={item.key}
                  className="panel-content"
                >
                  {item.children.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </TabPane>
          <TabPane tab="Tạo issue" key="2">
            <div className="create-issue-container">
              <h3>Tạo issue mới</h3>
              <div className="contact-f">
                <Form
                  form={form}
                  layout="vertical"
                  className="custom-form"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <h3>Thông Tin Khách Hàng</h3>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input placeholder="Họ và Tên" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Số điện thoại chỉ được chứa số",
                      },
                    ]}
                  >
                    <Input
                      placeholder="SĐT"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                  <h3>Nội dung</h3>
                  <Form.Item
                    name="message"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nội dung",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Vui lòng nhập nội dung"
                      rows={4}
                    />
                  </Form.Item>
                  {showGlobalError && errorMessage && (
                    <Form.Item>
                      <div className="error-message">{errorMessage}</div>
                    </Form.Item>
                  )}
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="send-button"
                    >
                      GỬI TIN
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Help;
