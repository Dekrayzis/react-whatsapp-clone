import React from "react";
import "./avatar.scss";

const Avatar = ({ avatar }) => {
  return (
    <div className="avatar">
      <img src={avatar} alt="user" className="user-img" />
    </div>
  );
};

export default Avatar;
