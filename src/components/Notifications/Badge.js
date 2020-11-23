import React from "react";
import "./notifications.scss";

const Badge = ({ count }) => {
  return (
    <div className="notif_badge">
      <span className="badge-notification">{count}</span>
    </div>
  );
};

export default Badge;
