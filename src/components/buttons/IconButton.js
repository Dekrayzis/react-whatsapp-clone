import React from "react";
import "./buttons.scss";

const IconButton = ({ icon, label, onClick, children }) => {
  return (
    <button className="btn" onClick={onClick} type="button">
      {label && <span className="label">{label}</span>}
      {children ? children : <i className={`demo-icon ${icon}`} />}
    </button>
  );
};

export default IconButton;
