import React from "react";
import "./buttons.scss";

const IconButton = ({ icon, label, onClick }) => {
  return (
    <>
      <button className="btn" onClick={onClick}>
        <span className="label">{label}</span>
        <i class={`demo-icon ${icon}`} />
      </button>
    </>
  );
};

export default IconButton;
