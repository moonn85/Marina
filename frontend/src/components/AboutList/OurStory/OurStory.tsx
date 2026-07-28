import "./OurStory.css";
import BeSearchForm from "../../BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

const OurStory = () => {
  const { t } = useTranslation('story');
  return (
    <>
      <div className="about-story-container">
        <div className="about-story-wrapper">
          <h1 className="about-title">
            <strong>
              {t('story.h1.title', 'Câu chuyện Anstay')}
            </strong>
          </h1>

          <p className="about-intro">
            {t(
              'story.p.intro',
              'Thế giới rộng lớn, nhưng nơi ta thuộc về đôi khi chỉ gói gọn trong một căn phòng – nơi có ánh đèn ấm, chiếc rèm khẽ lay và cảm giác được chăm sóc đúng lúc. Đó là nơi Anstay bắt đầu.'
            )}
          </p>

          <div className="about-section">
            <h2>
              {t('story.h2.section1', 'Một giấc mơ nhen nhóm từ hành trình sống thật')}
            </h2>

            <p>
              {t(
                'story.p.section1.1',
                'Hạ Long buổi sớm không ồn ào như trong tưởng tượng. Trên con đường ven biển loang nắng, làn sương mỏng còn đọng trên mái ngói thấp thoáng, chúng tôi — ba người trẻ mang theo những vali lỉnh kỉnh và một giấc mơ mơ hồ — lần đầu đặt chân đến đây.'
              )}
            </p>

            <div className="inline-images">
              <img src="/pictures/ourstory2.jpg" alt="" loading="lazy" />
            </div>

            <p>
              {t(
                'story.p.section1.2.prefix',
                'Căn nhà thuê nhỏ ở Bãi Cháy trở thành văn phòng đầu tiên. Ngày khảo sát, đêm ngồi bệt vẽ tay mô hình căn hộ lý tưởng, chúng tôi tin rằng:'
              )}
              <i>
                {t(
                  'story.p.section1.2.quote',
                  '“Nếu Hạ Long là di sản thiên nhiên, thì không gian sống tại đây cũng xứng đáng là một phần ký ức đẹp đẽ của du khách.”'
                )}
              </i>
            </p>

            <p>
              {t(
                'story.p.section1.3.line1',
                'Một buổi tối, khi đi lạc vào khu phố ven biển, cụ bà bán xôi hỏi: “Các cháu ở đây du lịch à?”'
              )}
              <br />
              {t(
                'story.p.section1.3.line2',
                'Chúng tôi cười: “Không bà ạ, chúng cháu ở đây để tìm cảm giác được sống.”'
              )}
            </p>

            <p>
              {t(
                'story.p.section1.4',
                'Và chúng tôi đã tìm thấy. Trong tiếng sóng đập vào vách đá mỗi sáng, trong ánh nắng tràn vào cửa sổ căn hộ đầu tiên nhìn ra vịnh, trong tiếng rao chiều của chợ địa phương — chúng tôi đã hình dung ra một Anstay mang hình hài rất thật.'
              )}
            </p>

            <p>
              {t(
                'story.p.section1.5',
                'Anstay Hạ Long ra đời từ tinh thần đó. Không phải nơi “check-in sống ảo”, mà là không gian sống thật — nơi bạn có thể nấu bữa sáng, đọc sách bên cửa sổ, lặng ngắm chiều tà và cảm thấy thuộc về.'
              )}
            </p>

            <p>
              {t(
                'story.p.section1.6',
                'Từ gia đình Pháp gửi thư cảm ơn, đến cặp đôi cầu hôn tại ban công căn hộ Anstay, hay bạn trẻ freelancer chọn Hạ Long làm “văn phòng biển” trong 3 tháng — tất cả đã ở lại, không chỉ trong căn hộ, mà ở lại trong hành trình ký ức của chính họ.'
              )}
            </p>

            <p>
              <strong>
                {t('story.p.section1.7.strong.line1', 'Anstay không sinh ra để làm chỗ trọ.')}
                <br />
                {t(
                  'story.p.section1.7.strong.line2',
                  'Anstay ra đời để trở thành một phần của hành trình sống thật — bắt đầu từ Hạ Long.'
                )}
              </strong>
            </p>
          </div>


          <div className="about-section">
            <h2>
              {t('story.section2.h2', 'Mỗi căn phòng là một tâm hồn')}
            </h2>

            <p>
              {t(
                'story.section2.p1',
                'Có những nơi lưu trú khiến người ta chỉ muốn ghé qua. Nhưng cũng có những không gian níu chân – không bởi sự sang trọng, mà bởi cảm giác thuộc về. Mỗi căn hộ của Anstay là một bản thể có linh hồn.'
              )}
            </p>

            <p>
              {t(
                'story.section2.p2',
                'Chúng tôi không chọn nội thất theo catalogue, mà chọn theo câu chuyện mà căn phòng ấy sẽ kể. Là sắc vàng dịu nhẹ trong ánh sáng ban mai cho những ngày đầu khởi nghiệp. Là mùi tinh dầu trầm ấm giúp xoa dịu lòng người xa xứ. Là chiếc rèm lụa mỏng đón gió hồ mỗi sớm, nơi đôi vợ chồng trẻ lưu lại khoảnh khắc đầu tiên của hôn nhân.'
              )}
            </p>

            <p>
              {t(
                'story.section2.p3',
                'Chúng tôi thiết kế từng góc nhỏ với niềm tin rằng: không gian sống không chỉ là nơi ở, mà là nơi chữa lành, nơi khơi gợi cảm hứng và là nơi gói ghém những kỷ niệm sẽ theo bạn suốt hành trình.'
              )}
            </p>
          </div>

          <div className="about-section">
            <h2>
              {t(
                'story.section3.h2',
                'Khách không chỉ là khách, họ là người kể chuyện'
              )}
            </h2>

            <p>
              {t(
                'story.section3.p1',
                'Mỗi người từng dừng chân tại Anstay đều mang theo một câu chuyện – và khi họ rời đi, một phần câu chuyện đó vẫn còn ở lại đây.'
              )}
            </p>

            <p>
              {t(
                'story.section3.p2',
                'Có người là CEO đến từ Tokyo, tìm một không gian yên tĩnh để hoàn tất bản kế hoạch chiến lược quan trọng giữa những ngày bận rộn. Có người là nhà văn Pháp, dành cả tuần sống giữa phố biển chỉ để viết chương cuối cho cuốn tiểu thuyết mới. Có cặp vợ chồng trẻ từ Sài Gòn ra Hà Nội chăm con nhỏ điều trị, chọn Anstay vì căn hộ đủ bếp, đủ máy giặt, và đủ sự ấm áp như nhà.'
              )}
            </p>

            <p>
              {t(
                'story.section3.p3',
                'Những ngày mưa, chúng tôi pha một bình trà nóng đặt sẵn trước cửa. Những đêm khuya, khách để lại lời nhắn “Cảm ơn Anstay đã giúp tôi cảm thấy mình không lẻ loi”. Mỗi dòng tin, mỗi ánh mắt sáng rực khi mở cửa bước vào, là động lực để chúng tôi làm hơn cả những gì gọi là dịch vụ.'
              )}
            </p>

            <p>
              {t(
                'story.section3.p4',
                'Chúng tôi không nhớ hết tên từng người đã ghé qua, nhưng vẫn nhớ tiếng cười trong bữa tiệc sinh nhật nhỏ ở ban công tầng 5. Nhớ chiếc xe đạp đôi được thuê để rong ruổi bên hồ. Nhớ cả ánh mắt lặng lẽ của một người vừa chia tay, chọn Anstay làm nơi “ở lại một chút” để tìm lại mình.'
              )}
            </p>

            <p>
              {t(
                'story.section3.p5',
                'Khách của chúng tôi không chỉ là khách – họ là bạn đồng hành, là người kể chuyện thầm lặng của chính hành trình sống mà Anstay vinh dự được ghi dấu.'
              )}
            </p>
          </div>


          <div className="about-section">
            <h2>{t('story.section4.h2', 'Hệ sinh thái sống linh hoạt, cảm xúc và thông minh')}</h2>

            <p>{t('story.section4.p1',
              'Anstay không chỉ đơn thuần là nơi lưu trú – chúng tôi đang kiến tạo một hệ sinh thái sống toàn diện, nơi nhịp sống hiện đại hòa quyện cùng sự tinh tế của cảm xúc cá nhân.'
            )}</p>

            <p>{t('story.section4.p2',
              'Tại đây, bạn có thể đặt phòng trong vòng vài giây qua điện thoại, nhận mã vân tay cá nhân để mở cửa căn hộ bất kỳ lúc nào mà không cần chờ lễ tân. Mọi tiện ích – từ dịch vụ dọn dẹp, giặt là, gọi taxi hay đặt bữa sáng – đều có thể tích hợp ngay trong một chiếc app gọn nhẹ.'
            )}</p>

            <p>{t('story.section4.p3',
              'Nhưng Anstay không dừng lại ở công nghệ. Chúng tôi tin rằng sự kết nối giữa người với người mới là cốt lõi. Bạn có thể tham gia một buổi coffee talk vào sáng thứ Bảy với những cư dân đang sống cùng toà nhà, hoặc chọn một không gian làm việc chung ngay tại căn hộ – nơi bạn vừa có thể tập trung, vừa cảm thấy gần gũi.'
            )}</p>

            <p>{t('story.section4.p4',
              'Với những ai làm việc từ xa, Anstay là “văn phòng thứ hai” – yên tĩnh, đủ tiện nghi và tràn đầy cảm hứng. Với gia đình, Anstay là nơi mọi người có thể cùng nhau nấu ăn, xem phim, và chia sẻ những khoảnh khắc nhỏ bé mà quý giá. Với khách du lịch, đó là không gian để nghỉ ngơi – không phải kiểu nghỉ, mà là hồi phục.'
            )}</p>

            <p>{t('story.section4.p5',
              'Một hệ sinh thái đúng nghĩa là nơi mọi điều đều được cá nhân hóa, kết nối trọn vẹn, và mang đến cho bạn cảm giác: "Tôi có thể sống ở đây. Lâu hơn dự định."'
            )}</p>
          </div>


          <section className="core-values-section">
            <div className="text-content">
              <h2>{t('story.core.h2', 'Giá trị cốt lõi tại Anstay')}</h2>

              <div className="core-value">
                <strong>
                  {t('story.core.value1',
                    '1. THẦN TỐC – “Nhanh là sống, chậm là chết”…')}
                </strong>
              </div>

              <div className="core-value">
                <strong>
                  {t('story.core.value2',
                    '2. TẬN TÂM – “Làm gì cũng phải làm đến nơi đến chốn”…')}
                </strong>
              </div>

              <div className="core-value">
                <strong>
                  {t('story.core.value3',
                    '3. TỬ TẾ – “Muốn đi xa, phải đi cùng người tử tế”…')}
                </strong>
              </div>
            </div>

            <figure className="image-content" style={{ marginLeft: "40px" }}>
              <img src="/pictures/ourstory1.jpg" alt="Đội ngũ Anstay" height="500px" loading="lazy" />
              <figcaption>
                {t('story.core.figure.caption',
                  'Hành trình của Anstay là hành trình của những con người tin vào sự khác biệt và sống bằng đam mê phụng sự.')}
              </figcaption>
            </figure>
          </section>

          <div className="about-cta">
            <p>
              <strong>{t('story.core.cta', 'ANSTAY - THẦN TỐC - TẬN TÂM - TỬ TẾ')}</strong>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default OurStory;
