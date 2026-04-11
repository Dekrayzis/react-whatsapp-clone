import React, { useState, useRef, useEffect } from "react";
import "./dropdown.scss";

const DropdownMenu = ({ items, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="dropdown" ref={ref}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="dropdown__divider" />
        ) : (
          <div
            key={i}
            className="dropdown__item"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            {item.icon && <span className="dropdown__icon">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        )
      )}
    </div>
  );
};

export default DropdownMenu;
