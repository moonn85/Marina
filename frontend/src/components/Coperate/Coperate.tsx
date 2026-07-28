import React from 'react';
import './Coperate.css';

interface Partner {
  name: string;
  logo: string;
  website: string;
}

const partners: Partner[] = [
  { name: "DAEWOO E&C", logo: "https://wikiland.vn/wp-content/uploads/don-vi-xay-dung/daewoo-ec/logo-daewoo-e-c.png", website: "https://daewooencvina.vn/" },
  { name: "Vinhomes", logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vinhomes.png", website: "https://vinhomes.vn/" },
  { name: "Tân Hoàng Minh", logo: "https://bachkhoaland.com/wp-content/uploads/2022/06/tan-hoang-minh-1.png", website: "https://tanhoangminhgroup.com/" }
];

const bookingPlatforms: Partner[] = [
  { name: "Agoda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Agoda_logo_2019.svg/1024px-Agoda_logo_2019.svg.png", website: "https://www.agoda.com/vi-vn/view-bien-natural-wonders-ha-long-bay/hotel/h-long-vn.html?finalPriceView=1&isShowMobileAppPrice=false&cid=1555740&numberOfBedrooms=&familyMode=false&adults=2&children=0&rooms=1&maxRooms=0&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=VND&isFreeOccSearch=false&los=1&searchrequestid=131d2054-4947-451f-8e26-1d6c2a1b58e6&ds=dL4T8lz2ZndDh%2BaH&checkin=2025-09-04" },
  { name: "Expedia", logo: "https://img-cache.coccoc.com/image2?i=1&l=9/328396931", website: "https://www.expedia.com.vn/Ha-Long-Khach-San-Blue-Kites-Residence-By-A-La-Carte.h105653595.Thong-tin-khach-san?chkin=2025-09-03&chkout=2025-09-06&x_pwa=1&rfrr=HSR&pwa_ts=1756864962870&referrerUrl=aHR0cHM6Ly93d3cuZXhwZWRpYS5jb20udm4vSG90ZWwtU2VhcmNo&useRewards=false&rm1=a2&regionId=6055449&destination=H%E1%BA%A1+Long%2C+Qu%E1%BA%A3ng+Ninh+%28t%E1%BB%89nh%29%2C+Vi%C3%AA%CC%A3t+Nam&destType=MARKET&selected=105653595&latLong=20.950279%2C107.08297&sort=RECOMMENDED&top_dp=870136&top_cur=VND&userIntent=&selectedRoomType=324828434&selectedRatePlan=395948811&searchId=35e417c9-e941-4e97-b8db-f939631784f5" },
  { name: "Booking.com", logo: "https://logowik.com/content/uploads/images/252_booking_logo.jpg", website: "https://www.booking.com/Share-o4SlLcB" },
  { name: "Airbnb", logo: "data:image/png;base64,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", website: "https://www.airbnb.com.vn/rooms/1167002551623133967?guests=1&adults=1&s=67&unique_share_id=aa8b1796-e934-473f-87f5-2489ce99dba0" }
];

const customers: Partner[] = [
  {
    name:"SamSung",logo:"https://ibrand.vn/wp-content/uploads/2024/08/dc36c1d02dfe2ec192b7ec6d2289cb2d-1.png",website:"http://samsung.com/vn/offer/megasale/?cid=vn_pd_ppc_google_vd+da-promotion_always-on_ALON-IMCE-D2C-AWO-MAR2025-HOS_search-text-ads_734693528377-samsung%20com%20vn-b-SSFesawo_none_pfm_3rd-Party-Targeting_conversion_brand-generic_keywords&utm_source=google&utm_medium=search&utm_campaign=ALON-IMCE-D2C-AWO-MAR2025-HOS&utm_term=Hot&utm_content=none&gclid=Cj0KCQjwhYS_BhD2ARIsAJTMMQYrrY9TFlLSAQ41TZCHydFzqB6Sev8zoIGpEf2j1OPBdZ4IklJvrDwaArQYEALw_wcB"
  },
  {
    name:"LG",logo:"https://images.squarespace-cdn.com/content/v1/502a8efb84ae42cbccf920c4/1585574686746-VCDIHSO21O76WR72WIAD/LG-Logo.png",website:"https://www.lg.com/vn/dieu-hoa/?ec_model_status_code=ACTIVE&sortCriteria=%40ec_spotlights_order_no+descending%2C%40ec_stock_status+ascending%2C%40ec_model_release_date+descending&utm_source=google-ads&utm_medium=cpc&utm_campaign=HQ-ES-SEM_ES_RAC_VN_AO_NA_CNS_PSE_consideration_BRA_VI_lg.com_NA_BM_tCPA_BCL_google-ads_AO&utm_content=20250214_Generic_NA_BCL&utm_term=NA&gad_source=1&gclid=Cj0KCQjwhYS_BhD2ARIsAJTMMQZxEnV_qNgZuWhBBgwn84cbj1MN2ym2zOO7YpyONKoXEJiE2CHXZHoaAhkYEALw_wcB"
  }
];

const Coperate: React.FC = () => {
  return (
    <div className="coperate-container">
      <h1 className="coperate-title">Giới thiệu đối tác & khách hàng</h1>

      {/* Chủ đầu tư */}
      <div className="coperate-section">
        <h2 className="coperate-subtitle">Các chủ đầu tư lớn:</h2>
        <div className="coperate-grid">
          {partners.map((partner) => (
            <a key={partner.name} href={partner.website} target="_blank" rel="noopener noreferrer" className="partner-card">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
              <p>{partner.name}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Nền tảng đặt phòng */}
      <div className="coperate-section">
        <h2 className="coperate-subtitle">Các nền tảng đặt phòng trực tuyến:</h2>
        <div className="coperate-grid">
          {bookingPlatforms.map((platform) => (
            <a key={platform.name} href={platform.website} target="_blank" rel="noopener noreferrer" className="partner-card">
              <img src={platform.logo} alt={platform.name} className="partner-logo" />
              <p>{platform.name}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Khách hàng */}
      <div className="coperate-section">
        <h2 className="coperate-subtitle">Khách hàng doanh nghiệp & cá nhân:</h2>
        <div className="coperate-grid">
          {customers.map((platform) => (
            <a key={platform.name} href={platform.website} target="_blank" rel="noopener noreferrer" className="partner-card">
              <img src={platform.logo} alt={platform.name} className="partner-logo" />
              <p>{platform.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coperate;