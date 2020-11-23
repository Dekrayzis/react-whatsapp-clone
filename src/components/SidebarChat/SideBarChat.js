import React from "react";
import "./sidebarChat.scss";
import ChatLink from "./ChatLink";

const SideBarChat = () => {
  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    if (roomName) {
    }
  };
  return (
    <div className="sidebarChat">
      <div className="sidebarChat__header">
        <div className="sidebarChat__header_title" onClick={createChat}>
          CHATS (5)
        </div>
        <ChatLink />
      </div>
    </div>
  );
};

export default SideBarChat;
