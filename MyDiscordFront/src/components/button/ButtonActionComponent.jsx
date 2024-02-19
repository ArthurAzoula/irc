import React from "react";
import "./ButtonActionComponent.css";

const ButtonActionComponent = ({ className, icon, text, onClick}) => {
  return (
    <button className={`${className} buttonactioncomponent_button`} onClick={onClick}>
      <div className={`buttonactioncomponent_container ${className}`}>
        <span className="buttonactioncomponent_text">{text}</span>
        {icon}
      </div>
    </button>
  );
};

export default ButtonActionComponent;
