import React, { useState, useEffect } from "react";
import "./sidebarChat.scss";
import ChatLink from "./ChatLink";
import db from "../../firebase";

const SideBarChat = ({ searchTerm = "", filterUnread = false }) => {
  const [currentChats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapShot) =>
      setChats(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  // Filter chats by search term and archived status
  const filteredChats = currentChats
    .filter((chat) => !chat.data.archived) // Hide archived rooms
    .filter((chat) =>
      chat.data.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="sidebarChat">
      <div
        className="sidebarChat__addRoom"
        onClick={createChat}
        role="button"
        tabIndex={0}
      >
        <span className="sidebarChat__addRoom_icon">+</span>
        <span>Add new chat</span>
      </div>
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <ChatLink
            key={chat.id}
            id={chat.id}
            name={chat.data.name}
            filterUnread={filterUnread}
          />
        ))
      ) : (
        <div className="sidebarChat__empty">
          {searchTerm
            ? `No chats matching "${searchTerm}"`
            : "No chats yet. Create one!"}
        </div>
      )}
    </div>
  );
};

export default SideBarChat;
