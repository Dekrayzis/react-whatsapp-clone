import React from "react";
import Avatar from "../Avatar/Avatar";
import Badge from "../Notifications/Badge";

const ChatLink = () => {
  return (
    <div className="chat_info">
      <Avatar avatar="https://avatars.dicebear.com/api/human/vincent.svg" />
      <div className="chat_info_details">
        <h2 className="chat_info_details_name">Room name</h2>
        <p className="chat_info_details_msg">Last message...</p>
      </div>

      <div className="chat_info_notifies">
        <span className="timestamp">1min</span>
        <Badge count={2} />
      </div>
    </div>
  );
};

export default ChatLink;
