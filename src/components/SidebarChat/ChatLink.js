import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import Badge from "../Notifications/Badge";
import { Link } from "react-router-dom";
import db from "../../firebase";

const ChatLink = ({ id, name }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return (
    <Link to={`/rooms/${id}`}>
      <div className="chat_info">
        <Avatar avatar="https://avatars.dicebear.com/api/human/vincent.svg" />
        <div className="chat_info_details">
          <h2 className="chat_info_details_name">{name}</h2>
          <p className="chat_info_details_msg">{messages[0]?.message}</p>
        </div>

        <div className="chat_info_notifies">
          <span className="timestamp">1min</span>
          <Badge count={2} />
        </div>
      </div>
    </Link>
  );
};

export default ChatLink;
