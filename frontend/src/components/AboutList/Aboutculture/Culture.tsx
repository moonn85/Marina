import React from "react";
import "./Culture.css";
import BeSearchForm from "../../BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

const Culture = () => {
  const { t } = useTranslation('culture');
  return (
    <>
      <div className="container-culture">
        <h2 style={{ textAlign: "center" }}>
          <strong>
            {t('culture.h2.title', 'Văn Hoá Tại Công Ty Chúng Tôi')}
          </strong>
        </h2>

        <p className="description-culture">
          {t(
            'culture.p.desc.line1',
            'Tại công ty chúng tôi, văn hoá không phải là những điều được viết ra cho đẹp, mà là thứ được sống và thể hiện mỗi ngày – trong từng hành động nhỏ nhất, từ cách chúng tôi chào nhau buổi sáng, cách chúng tôi giải quyết một vấn đề, cho đến cách chúng tôi đối xử với khách hàng, đối tác và cộng đồng.'
          )}
          <br />
          {t(
            'culture.p.desc.line2',
            'Ba giá trị cốt lõi: Thần tốc – Tận tâm – Tử tế chính là kim chỉ nam, là “la bàn nội tại” để từng thành viên định hướng hành động và ra quyết định đúng đắn, nhất quán.'
          )}
          <br />
          {t(
            'culture.p.desc.line3',
            'Chúng tôi tin rằng: một công ty mạnh không phải nhờ quy mô, mà nhờ vào văn hoá – thứ định hình nên tinh thần, bản sắc và sức bền nội tại.'
          )}
        </p>

        <div className="culture-value">
          <h2>
            <strong>
              {t('culture.h2.core.title', 'Giá Trị Cốt Lỗi Tại Anstay VN')}
            </strong>
          </h2>

          <div className="value-1">
            <h3 className="title-value">
              <strong>
                {t(
                  'culture.h3.speed.title',
                  'THẦN TỐC – “Nhanh là sống, chậm là chết”'
                )}
              </strong>
            </h3>

            <div className="description-value">
              <p>
                {t(
                  'culture.p.speed.line1',
                  'Thế giới đang thay đổi từng giờ. Cơ hội vụt qua trong tích tắc. Sự chần chừ có thể khiến ta đánh mất tất cả.'
                )}
                <br />
                {t(
                  'culture.p.speed.line2',
                  'Tại đây, chúng tôi chọn cách sống và làm việc với nhịp độ của thời đại số – linh hoạt, quyết đoán và không ngại thử nghiệm.'
                )}
                <br />
              </p>

              <ul className="list-value">
                <li>
                  {t(
                    'culture.li.speed.1',
                    'Nhanh trong tư duy: Không bó mình trong những lối mòn. Tư duy mở, thích nghi nhanh, đổi mới liên tục.'
                  )}
                </li>
                <li>
                  {t(
                    'culture.li.speed.2',
                    'Nhanh trong hành động: Không để công việc tồn đọng. Khi thấy vấn đề – xử lý ngay, không đổ lỗi, không chờ ai khác.'
                  )}
                </li>
                <li>
                  {t(
                    'culture.li.speed.3',
                    'Nhanh nhưng chắc: Tốc độ phải đi cùng trách nhiệm. Không hi sinh chất lượng để lấy thành tích.'
                  )}
                </li>
              </ul>

              <p className="list-value">
                {t(
                  'culture.p.speed.footer.line1',
                  'Thần tốc không phải là làm vội, làm ẩu. Đó là tinh thần làm việc với sự chủ động cao độ, rút ngắn thời gian ra quyết định, tăng tốc độ triển khai, và luôn hướng đến hiệu quả tối đa.'
                )}
                <br />
                {t(
                  'culture.p.speed.footer.line2',
                  'Chúng tôi không ngồi đợi cơ hội – chúng tôi tạo ra nó bằng tốc độ hành động và ý chí không ngừng nghỉ.'
                )}
              </p>
            </div>
          </div>

          <h3 className="title-value">
            <strong>
              {t('culture.h3.dedication.title', 'TẬN TÂM – “Làm gì cũng phải làm đến nơi đến chốn”')}
            </strong>
          </h3>

          <div className="description-value">
            <p className="title-value1">
              {t('culture.p.dedication.intro', 'Chúng tôi tin rằng: thái độ quan trọng hơn trình độ. Một người có thể học để giỏi lên, nhưng không thể dạy ai đó trở nên tận tâm nếu họ thiếu lòng yêu nghề và trách nhiệm.')}
            </p>

            <ul className="list-value">
              <p>{t('culture.p.dedication.section1.title', 'Tận tâm là cách chúng tôi:')}</p>
              <li>{t('culture.li.dedication.1', 'Làm việc như thể đang phục vụ chính mình.')}</li>
              <li>{t('culture.li.dedication.2', 'Đặt lợi ích khách hàng lên hàng đầu.')}</li>
              <li>{t('culture.li.dedication.3', 'Không ngừng cải tiến để mỗi ngày làm việc đều tốt hơn hôm qua.')}</li>

              <p>{t('culture.p.dedication.section2.title', 'Tận tâm với công việc:')}</p>
              <li>{t('culture.li.dedication.work.1', 'Không làm qua loa. Luôn tìm cách làm tốt hơn, gọn hơn, chuyên nghiệp hơn.')}</li>
              <li>{t('culture.li.dedication.work.2', 'Dám chịu trách nhiệm. Nếu làm sai – sửa, nếu chưa tốt – cải thiện.')}</li>
              <li>{t('culture.li.dedication.work.3', 'Chủ động đóng góp, không chỉ làm theo yêu cầu.')}</li>

              <p>{t('culture.p.dedication.section3.title', 'Tận tâm với khách hàng:')}</p>
              <li>{t('culture.li.dedication.customer.1', 'Lắng nghe, thấu hiểu, đồng hành đến cùng.')}</li>
              <li>{t('culture.li.dedication.customer.2', 'Không hứa những điều không thể làm. Nhưng khi đã hứa, nhất định làm tới nơi.')}</li>
              <li>{t('culture.li.dedication.customer.3', 'Luôn nghĩ đến trải nghiệm, cảm xúc và sự hài lòng thực sự của người dùng.')}</li>

              <p>{t('culture.p.dedication.section4.title', 'Tận tâm với đội nhóm:')}</p>
              <li>{t('culture.li.dedication.team.1', 'Hỗ trợ lẫn nhau, chia sẻ kiến thức, cùng tiến bộ.')}</li>
              <li>{t('culture.li.dedication.team.2', 'Không ganh đua nội bộ, không đổ lỗi.')}</li>
              <li>{t('culture.li.dedication.team.3', 'Góp ý xây dựng, hướng đến mục tiêu chung.')}</li>
            </ul>

            <p className="list-value">
              {t('culture.p.dedication.footer', 'Tận tâm chính là thứ khiến công ty khác biệt, khiến khách hàng nhớ đến lâu dài – và khiến chúng tôi cảm thấy tự hào khi nhìn lại hành trình đã đi qua.')}
            </p>
          </div>

          <h3 className="title-value">
            <strong>
              {t('culture.h3.kindness.title', 'TỬ TẾ – “Muốn đi xa, phải đi cùng người tử tế”')}
            </strong>
          </h3>

          <div className="description-value">
            <p className="title-value1">
              {t('culture.p.kindness.intro.line1', 'Chúng tôi tin rằng: tử tế là sức mạnh mềm của một tổ chức lớn mạnh. Khi con người đối xử với nhau bằng lòng chân thành, môi trường làm việc sẽ trở thành nơi đáng sống – không chỉ để làm việc, mà để phát triển, sẻ chia và gắn bó lâu dài.')}
              <br />
              {t('culture.p.kindness.intro.line2', 'Tử tế không phải là yếu mềm. Tử tế là dám sống thật – làm đúng – và đặt tình người lên trên toan tính thiệt hơn.')}
            </p>

            <ul className="list-value">
              <p>{t('culture.p.kindness.section1.title', 'Tử tế trong giao tiếp:')}</p>
              <li>{t('culture.li.kindness.comm.1', 'Nói lời tích cực, tôn trọng lẫn nhau, lắng nghe bằng cả trái tim.')}</li>
              <li>{t('culture.li.kindness.comm.2', 'Không đâm chọt, không chỉ trích cá nhân, không đặt cái tôi lên trên tập thể.')}</li>
              <li>{t('culture.li.kindness.comm.3', 'Sẵn sàng giúp đỡ người khác mà không mong được đáp lại.')}</li>

              <p>{t('culture.p.kindness.section2.title', 'Tử tế với khách hàng:')}</p>
              <li>{t('culture.li.kindness.customer.1', 'Tư vấn đúng nhu cầu, không vì lợi nhuận mà tư vấn sai lệch.')}</li>
              <li>{t('culture.li.kindness.customer.2', 'Minh bạch giá trị – rõ ràng quy trình – trung thực tuyệt đối.')}</li>

              <p>{t('culture.p.kindness.section3.title', 'Tử tế trong văn hoá làm việc:')}</p>
              <li>{t('culture.li.kindness.work.1', 'Không làm điều sai trái để đạt mục tiêu.')}</li>
              <li>{t('culture.li.kindness.work.2', 'Không “qua mặt” quy trình hay đồng nghiệp để nổi bật cá nhân.')}</li>
              <li>{t('culture.li.kindness.work.3', 'Không lừa dối dù không ai biết – vì chúng tôi làm việc không chỉ với người khác, mà còn với chính lương tâm của mình.')}</li>
            </ul>

            <p className="list-value">
              {t('culture.p.kindness.footer', 'Tận tâm chính là thứ khiến công ty khác biệt, khiến khách hàng nhớ đến lâu dài – và khiến chúng tôi cảm thấy tự hào khi nhìn lại hành trình đã đi qua.')}
            </p>
          </div>

        </div>
        <div className="message-ceo">
          <h3>
            "
            {t(
              'culture.ceo.message',
              'Tôi tin rằng một tổ chức chỉ thật sự mạnh khi từng người trong đó cảm thấy được tôn trọng, được truyền cảm hứng và có cơ hội phát triển hết mình. Chúng tôi không cố gắng trở thành công ty to nhất – chúng tôi muốn trở thành công ty tử tế, tận tâm và thần tốc nhất trong lĩnh vực mình đang theo đuổi.'
            )}
            "
            — [<strong>{t('culture.ceo.name', 'CEO : Nghiêm Thành An')}</strong>]
          </h3>
        </div>

      </div>
    </>
  );
};

export default Culture;
