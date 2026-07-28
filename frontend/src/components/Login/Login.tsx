
import { useNavigate } from "react-router-dom";
import { Modal, message, Form, Input, Button } from "antd";

interface LoginValues {
  username: string;
  password: string;
}

console.log("✅ ENV:", import.meta.env.VITE_API_URL);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const Login = ({ onCancel }: { onCancel?: () => void }) => {
  const navigate = useNavigate();

  const onFinish = async (values: LoginValues) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Đăng nhập thành công");

        const returnUrl = localStorage.getItem("returnUrl");

        setTimeout(() => {
          if (returnUrl) {
            window.location.replace(returnUrl);
          } else {
            window.location.replace("/");
          }
          localStorage.removeItem("returnUrl");
        }, 500);
      } else {
        message.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <Form
      name="loginForm"
      className="popup-form"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập username!" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập password!" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
