import React from "react";
import { useParams } from "react-router-dom";
import "./ExploSub.css";
const articles = [
  {
    slug: "learn-more",
    title: "Lên kế hoạch cho sự kiện xã hội của bạn",
    description: "Hãy vươn lên trong hoàn cảnh",
    bannerUrl: "https://i.ibb.co/rKZfyYtg/1.jpg",
    title2: "Kết nối, đoàn tụ, kỷ niệm",
    description2:
      "Dù là dịp nào, hãy đưa lễ kỷ niệm tiếp theo của bạn lên một tầm cao mới. Cho dù bạn đang muốn tổ chức các buổi họp mặt gia đình thân mật, các cuộc đoàn tụ lớn, tiệc mừng trưởng thành hay bất kỳ sự kiện nào khác, bạn sẽ tìm thấy địa điểm tổ chức sự kiện hoàn hảo tại hơn 30 thương hiệu khách sạn trên toàn thế giới. Với các chuyên gia đáng tin cậy, dịch vụ phục vụ ăn uống và các tính năng công nghệ của chúng tôi bên cạnh, bạn có thể tập trung vào việc kết nối lại trong khi chúng tôi chăm chút cho mọi chi tiết.",
  },
  {
    slug: "family-gatherings",
    title: "Các buổi họp mặt gia đình",
    description: "Biến mọi sự kiện thành một kỷ niệm",
    bannerUrl: "https://i.ibb.co/0jw57NQj/2.jpg",
    title2:
      "Tập hợp gia đình và bạn bè – Chúng tôi sẽ chăm sóc họ như chính con mình",
    description2:
      "Những khoảnh khắc đặc biệt của cuộc sống đòi hỏi những lễ hội, và chúng tôi ở đây để biến điều đó thành hiện thực. Từ các cuộc đoàn tụ gia đình đến các bữa tối ngày lễ cho đến các bữa tiệc độc thân và tiệc chia tay cuộc sống độc thân đầy nhiệt huyết, đội ngũ chuyên gia của chúng tôi có thể hướng dẫn bạn lập kế hoạch cho sự kiện tiếp theo của mình, đến từng chi tiết nhỏ nhất. Địa điểm phù hợp tạo nên tất cả sự khác biệt: Khám phá nhiều không gian đa dạng của chúng tôi tại các cơ sở trên khắp cả nước – và toàn cầu – để tìm địa điểm hoàn hảo cho buổi tụ họp của bạn.",
    extraImageUrl: "https://i.ibb.co/HfJJcn3R/check-in-H-Long.jpg",
  },
  {
    slug: "venues",
    title: "Không gian và địa điểm",
    description: "Không gian vượt ra ngoài tiêu chuẩn",
    bannerUrl: "https://i.ibb.co/V0mYK6wv/3.jpg",
    title2: "Khám phá không gian và địa điểm tổ chức sự kiện của chúng tôi",
    description2:
      "Lên kế hoạch cho một lễ kỷ niệm để lại ấn tượng lâu dài. Chúng tôi có địa điểm cho mọi dịp: Từ các buổi họp mặt gia đình đến tiệc sinh nhật xa hoa, bạn sẽ tìm thấy địa điểm hoàn hảo để tổ chức lễ kỷ niệm tại hơn 30 thương hiệu khách sạn trên toàn thế giới. Lựa chọn từ nhiều địa điểm trong nhà và ngoài trời linh hoạt để phù hợp với các sự kiện xã hội ở mọi quy mô. Cho dù bạn đang tìm kiếm một ốc đảo sa mạc nhỏ chỉ dành cho những người bạn thân thiết hay một bãi biển rộng lớn cho toàn bộ gia đình mở rộng, hãy khám phá nhiều không gian và phong cách khác nhau tại các điểm đến tuyệt đẹp.",
  },
  {
    slug: "catering",
    title: "Thức ăn và đồ uống",
    description: "Mang đến trải nghiệm hương vị ẩm thực",
    bannerUrl: "https://i.ibb.co/m55zJBDg/4.jpg",
    title2: "Hương vị ẩm thực mang đến trải nghiệm",
    description2:
      "Thật đơn giản: Đồ ăn đưa chúng ta lại gần nhau hơn. Chia sẻ bữa ăn với gia đình và bạn bè thúc đẩy sự gắn kết xã hội, tăng cường sức khỏe và trên hết là cách đáng nhớ để ăn mừng và tưởng nhớ. Các chuyên gia ẩm thực của chúng tôi luôn sẵn sàng hướng dẫn bạn lập kế hoạch cho trải nghiệm ăn uống phù hợp với tầm nhìn của bạn, từ bữa tối ngồi xuống thanh lịch đến giờ cocktail trên sân thượng sáng tạo cho đến tiệc tráng miệng (xin chào, bánh que và tháp bánh nướng nhỏ). Nhóm của chúng tôi theo dõi các xu hướng thực phẩm mới nhất và sẽ tạo ra các thực đơn tùy chỉnh phù hợp với mọi dịp. Chúng tôi cũng kết hợp các biện pháp bền vững, làm việc trên toàn bộ chuỗi cung ứng của mình để giúp đảm bảo rằng các thành phần của chúng tôi có nguồn gốc có trách nhiệm theo góc độ môi trường và xã hội.",
    extraImageUrl: "https://i.ibb.co/xtnKvWxH/d.jpg",
  },
  {
    slug: "destination-celebrations",
    title: "Điểm đến",
    description:
      "Ở đây, ở đó, khắp mọi nơi: Biến sự kiện của bạn thành một cuộc phiêu lưu.",
    bannerUrl: "https://i.ibb.co/BHM6nBJG/5.jpg",
    title2: "Tổ chức một chuyến đi đáng nhớ cho buổi họp mặt của bạn",
    description2:
      "Hãy tưởng tượng về cuộc đoàn tụ gia đình tiếp theo của bạn – trên một bãi biển Caribe đầy nắng. Hoặc một sinh nhật quan trọng trên một mái nhà sôi động của Thành phố New York. Một bữa tiệc tốt nghiệp tại một nơi nghỉ dưỡng hoang dã ở Tây Bắc Thái Bình Dương. Chúng tôi không chỉ có thể sắp xếp bất kỳ loại hình tụ họp xã hội nào mà bạn mong muốn mà còn có những điểm đến phù hợp. Thêm một chút phiêu lưu vào chuyến đi tiếp theo của bạn và kết nối với nhóm chuyên gia của chúng tôi để bắt đầu lập kế hoạch",
    extraImageUrl: "https://i.ibb.co/TBh9HzLC/7.jpg",
  },
  {
    slug: "accommodations",

    title: "Chỗ ở",
    description:
      "Hãy để chúng tôi phục vụ bạn: Phòng nghỉ cho tất cả mọi người",
    bannerUrl: "https://i.ibb.co/xVM7sLz/6.jpg",
    title2: "Phòng nghỉ với đầy đủ tiện nghi mà bạn mong muốn",
    description2:
      "Tụ tập cho những dịp đặc biệt, sau đó nghỉ ngơi theo phong cách tại các thương hiệu khách sạn có thể phục vụ mọi người. Hoàn hảo cho các nhóm với mọi quy mô, thật đơn giản để ở cùng nhau với các khối phòng và tiếp tục tiệc tùng lâu dài sau khi tiệc kết thúc. Đặt phòng nghỉ hoặc phòng suite rộng rãi, hoặc chọn phòng thông nhau để thuận tiện tối đa. Từ phòng bên hồ bơi có giường ban ngày cho các chuyến đi chơi của bạn gái đến chỗ ở thoải mái để tiếp đón bạn bè ở gần xa đến dự tiệc sinh nhật lần thứ 50, hãy tận hưởng tất cả các tiện nghi mà các thương hiệu khách sạn của chúng tôi cung cấp. Phòng nghỉ là một phần của trải nghiệm cũng như chính sự kiện và chúng tôi cam kết cung cấp sự phù hợp nhất cho bạn và đoàn của bạn.",
    extraImageUrl: "https://i.ibb.co/qLPdKjfw/N009539.jpg",
  },
];

const ExploSub = () => {
  const { slug } = useParams();

  const article = articles.find((item) => item.slug === slug);

  if (!article) return <div className="not-found">Bài viết không tồn tại.</div>;
  return (
    <div className="article-page">
      <div className="banner-section">
        <img
          src={article.bannerUrl}
          alt={article.title}
          className="banner-img"
        />
        <div className="banner-overlay" />
        <div className="banner-text-wrapper">
          <div className="banner-text">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </div>
        </div>
      </div>

      <div className="article-content">
        <h2>{article.title2}</h2>
        <p>{article.description2}</p>
        {article.extraImageUrl && (
          <img
            src={article.extraImageUrl}
            alt="extra"
            className="article-extra-img"
          />
        )}
      </div>
    </div>
  );
};

export default ExploSub;
