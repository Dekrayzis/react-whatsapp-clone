import React, { useState, useEffect } from "react";
import "./sidebarChat.scss";
import ChatLink from "./ChatLink";
import db from "../../firebase";

const SideBarChat = () => {
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

  return (
    <div className="sidebarChat">
      <div className="sidebarChat__header">
        <div className="sidebarChat__header_title" onClick={createChat}>
          CHATS (5)
        </div>
        {currentChats.map((chat) => (
          <ChatLink key={chat.id} id={chat.id} name={chat.data.name} />
        ))}
      </div>
    </div>
  );
};

export default SideBarChat;
