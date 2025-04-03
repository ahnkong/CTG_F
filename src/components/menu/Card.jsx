import React from "react";
import "styles/menu/menu.css";

const Card = ({ image, title, description, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p style={{ whiteSpace: "pre-line" }}>{description}</p> {/* 줄바꿈 처리 */}
    </div>
  );
};

export default Card;
