import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import Badge from "../Notifications/Badge";
import { Link } from "react-router-dom";
import db from "../../firebase";

const loadSetting = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(`cchat_${key}`);
    return raw !== null ? JSON.parse(raw) : defaultVal;
  } catch { return defaultVal; }
};

const ChatLink = ({ id, name }) => {
  const [messages, setMessages] = useState([]);
  const [readReceipts, setReadReceipts] = useState(() => loadSetting("priv_read", true));

  useEffect(() => {
    const onChange = () => setReadReceipts(loadSetting("priv_read", true));
    window.addEventListener("cchat-settings-changed", onChange);
    return () => window.removeEventListener("cchat-settings-changed", onChange);
  }, []);

  const truncateString = (str, num) => {
    if (!str) return "";
    if (str.length <= num) return str;
    return `${str.slice(0, num)}...`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

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

  const lastMsg = messages[0];

  return (
    <Link to={`/rooms/${id}`}>
      <div className="chat_info">
        <Avatar avatar={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=2a3942&textColor=e9edef`} />
        <div className="chat_info_details">
          <h2 className="chat_info_details_name">{name}</h2>
          <p className="chat_info_details_msg">
            {lastMsg && (
              <span className={`chat_info_readReceipt ${readReceipts ? "" : "chat_info_readReceipt--single"}`}>
                {readReceipts ? "✓✓ " : "✓ "}
              </span>
            )}
            {lastMsg?.image
              ? "📷 Photo"
              : truncateString(lastMsg?.message, 28)}
          </p>
        </div>

        <div className="chat_info_notifies">
          <span className="timestamp">
            {formatTimestamp(lastMsg?.timestamp)}
          </span>
          {messages.length > 0 && <Badge count={messages.length} />}
        </div>
      </div>
    </Link>
  );
};

export default ChatLink;
