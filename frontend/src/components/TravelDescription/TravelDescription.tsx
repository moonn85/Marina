import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Card, Form, Input, Button, message } from "antd";
import "./TravelDescription.css";
import { Avatar, List } from "antd";
import { useLocation } from "react-router-dom";
const { TabPane } = Tabs;
import dayjs from "dayjs";

const { TextArea } = Input;

interface Detail {
  id: number;
  schedule_id: number | null;
  timeSlot: string;
  description: string;
}

interface Schedule {
  id: number;
  tourId: number;
  dayNumber: number;
  title: string;
  description: string;
  details: Detail[];
}

interface TourImage {
  id: number;
  tourId: number;
  imageUrl: string;
  isFeatured: boolean;
  featured: boolean;
}

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  discountPercent: number;
  createdAt: string;
  schedules: Schedule[];
  images: TourImage[];
  area: string;
  transportation: string;
  hotel: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  address: string;
  role: string;
  dob: string;
  gender: string;
  verified: boolean;
}

interface Comment {
  id: number;
  userId: number;
  targetType: string;
  targetId: number;
  comment: string;
  createdAt: string;
  user?: User; // Will attach user info here
}

const data = [
  {
    title: "Ant Design Title 1",
    date: dayjs().format("DD/MM/YYYY"),
    img: "https://nano-ceramic.vn/wp-content/uploads/2024/12/300-hinh-anh-dai-dien-dep-cho-facebook-tiktok-zalo-79.jpg",
  },
  { title: "Ant Design Title 2", date: dayjs().format("DD/MM/YYYY") },
  { title: "Ant Design Title 3", date: dayjs().format("DD/MM/YYYY") },
  { title: "Ant Design Title 4", date: dayjs().format("DD/MM/YYYY") },
];

interface TravelDescriptionProps {
  description?: string;
}

const TravelDescription = ({ description }: TravelDescriptionProps) => {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location1 = useLocation();
  const listingId = location1.state?.listingId;
  console.log("listingId111111111:", listingId); // Add console log

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch(
          `https://anstay.com.vn/api/tours/${listingId}`
        );
        const data = await response.json();
        setTour(data[0]);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    if (listingId) {
      fetchTourData();
    }
  }, [listingId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://anstay.com.vn/api/comments/TOUR/${listingId}`
      );
      const commentsData = await response.json();
      const commentsWithUser = await Promise.all(
        commentsData.map(async (comment: Comment) => {
          const userResponse = await fetch(
            `https://anstay.com.vn/api/users/${comment.userId}`
          );
          const userData = await userResponse.json();
          return { ...comment, user: userData };
        })
      );
      // Sort comments by date, newest first
      const sortedComments = commentsWithUser.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchComments();
    }
  }, [listingId]);

  const checkAuth = () => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      message.error("Vui lòng đăng nhập để bình luận!");
      return null;
    }
    return JSON.parse(userJson);
  };

  const handleSubmitComment = async (values: { comment: string }) => {
    const user = checkAuth();
    if (!user) return;

    try {
      const response = await fetch("https://anstay.com.vn/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          targetType: "TOUR",
          targetId: id,
          comment: values.comment,
        }),
      });

      if (response.ok) {
        message.success("Gửi bình luận thành công!");
        form.resetFields();
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      message.error("Có lỗi xảy ra khi gửi bình luận!");
    }
  };

  useEffect(() => {
    const checkUser = () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        setCurrentUser(JSON.parse(userJson));
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();
    // Add event listener for storage changes
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLoginClick = () => {
    const currentPath = window.location.pathname + window.location.search;
    console.log("Saving return URL:", currentPath);
    localStorage.setItem("returnUrl", currentPath);
    window.location.href = "/login";
  };

  const formatTimeSlot = (timeSlot: string) => {
    // Assuming timeSlot is in format "HH:mm:ss" or similar
    const time = timeSlot.split(":");
    if (time.length >= 2) {
      return `${time[0]}:${time[1]}`; // Returns only HH:mm
    }
    return timeSlot; // Return original if can't parse
  };

  if (!tour) {
    return <div>Loading...</div>;
  }

  return (
    <div className="travel-container">
      <Tabs defaultActiveKey="1" className="custom-tabs">
        <TabPane
          tab={<button className="tab-button active">Mô Tả</button>}
          key="1"
        >
          <Card className="travel-card">
            <h2 className="title">{tour.name}</h2>
            {tour.schedules.map((schedule) => (
              <>
                {schedule.description.split(/[.:]/).map((sentence, index) => {
                  if (!sentence.trim()) return null;

                  const previousText = schedule.description.slice(
                    0,
                    schedule.description.indexOf(sentence)
                  );
                  const isAfterColon = previousText.endsWith(":");
                  const delimiter = previousText.endsWith(":") ? ":" : ".";

                  return (
                    <div
                      key={`${schedule.id}-${index}`}
                      style={{
                        display: "flex",
                        marginBottom: "8px",
                        // paddingLeft: isAfterColon ? "20px" : "0",
                      }}
                    >
                      {!isAfterColon ? (
                        <p style={{ margin: 0 }}>
                          {sentence.trim()}
                          {delimiter}
                        </p>
                      ) : (
                        <div style={{ display: "flex", width: "100%" }}>
                          <span style={{ minWidth: "200px" }}>
                            {sentence.trim()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}

            <h3>Lịch Trình Chi Tiết:</h3>
            {tour.schedules.map((schedule) => (
              <div key={schedule.id} className="day-itinerary">
                <h4 className="day-title" style={{ textAlign: "left" }}>
                  {schedule.title}
                </h4>
                <div className="list-interary">
                  {schedule.details.map((detail) => (
                    <div key={detail.id} className="activity">
                      <strong>{formatTimeSlot(detail.timeSlot)}</strong>:{" "}
                      {detail.description}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </TabPane>
        <TabPane
          tab={<button className="tab-button">Bình Luận</button>}
          key="2"
        >
          <Card className="travel-card">
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.user?.avatar || "https://defaultavatar.com"}
                        />
                      }
                      title={
                        <>
                          <span className="list-title">
                            {item.user?.fullName}
                          </span>{" "}
                          <span className="list-date">
                            {dayjs(item.createdAt).format("DD/MM/YYYY")}
                          </span>
                        </>
                      }
                      description={item.comment}
                      className="custom-meta"
                    />
                  </List.Item>
                )}
              />
            </div>
            {currentUser ? (
              <Form form={form} onFinish={handleSubmitComment}>
                <Form.Item
                  name="comment"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung bình luận!",
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="Viết bình luận..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Gửi bình luận
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 20px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  margin: "20px 0",
                }}
              >
                <h3
                  style={{
                    marginBottom: "15px",
                    color: "#595959",
                    fontSize: "16px",
                  }}
                >
                  Vui lòng đăng nhập để chia sẻ ý kiến của bạn
                </h3>
              </div>
            )}
          </Card>
        </TabPane>
        <TabPane
          tab={<button className="tab-button">Ảnh Nổi Bật</button>}
          key="3"
        >
          <Card className="travel-card">
            <div className="gallery-grid">
              {tour.images
                .filter((image) => image.featured === true)
                .map((image) => (
                  <img
                    key={image.id}
                    src={image.imageUrl}
                    alt={`Tour image ${image.id}`}
                  />
                ))}
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TravelDescription;
