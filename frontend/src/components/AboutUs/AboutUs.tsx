import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";
import { CircleChevronRight } from "lucide-react";
import BeSearchForm from "../BeForms/BeSearchForm.tsx";
import { useTranslation } from "@/localization";

const AboutUs = () => {
  const { t } = useTranslation('about');
  const items = [
    {
      title: t('about.menu.company', 'Anstay'),
      image: "/pictures/aboutUs1.png",
      link: "/about-us/company",
    },
    {
      title: t('about.menu.group', 'Sơ đồ Công Ty'),
      image: "/pictures/aboutUs2.png",
      link: "/about-us/groupcompany",
    },
    {
      title: t('about.menu.culture', 'Văn Hoá Công Ty'),
      image: "/pictures/aboutUs3.png",
      link: "/about-us/culture",
    },
    {
      title: t('about.menu.story', 'Câu chuyện Anstay'),
      image: "/pictures/aboutUs4.png",
      link: "/about-us/our-story",
    },
  ];

  return (
    <>
      <div className="container-about-us">
        {items.map((item, index) => (
          <Link to={item.link} className="item">
            <img src={item.image} alt="" loading="lazy" />
            <div className="description">
              <div className="des-title">{item.title}</div>
              <div className="des-icon">
                <CircleChevronRight size={30} color="white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
export default AboutUs;
