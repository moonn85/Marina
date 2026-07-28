import React from "react";
import "./Mapcty.css";
const Mapcty = () => {
  return (
    <div className="map-cty-main">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.9507648614167!2d107.00194373598717!3d20.954492274147686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5f8118acfff7%3A0x5cda7725e937f7!2sAnstay%20Marina%20Hotel%20Ha%20Long!5e0!3m2!1svi!2s!4v1784101464815!5m2!1svi!2s"
        width="1920px"
        height="500px"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Cinema Location Map"
      ></iframe>
    </div>
  );
};

export default Mapcty;
