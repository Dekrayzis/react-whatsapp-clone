import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase";

//-- Components
import Avatar from "../Avatar/Avatar";
import IconButton from "./../buttons/IconButton";
import { useStateValue } from "./../../StateProvider";

//-- Store
import db from "../../firebase";

//-- Style
import "./chat.scss";

const Chat = () => {
  const [{ user }, dispatch] = useStateValue();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();

  const sendMessage = (ev) => {
    ev.preventDefault();

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: newMessage,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewMessage("");
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapShot) => setRoomName(snapShot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapShot) =>
          setMessages(snapShot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  return (
    <div className="chatWindow">
      <div className="chatWindow__header">
        <Avatar avatar="http://placehold.it/40x40" />
        <div className="chatWindow__header_info">
          <h3>{roomName}</h3>
          <p>
            Last message...
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chatWindow__headerRight"></div>
      </div>
      <div className="chatWindow__body">
        {messages.length > 0 &&
          messages.map((msg) => (
            <div
              className={`chat__message ${
                msg.name === user.displayName && "chat__receiver"
              }`}
            >
              <span className="chat__name">{msg.name}</span>
              {msg.message}
              <span className="chat__timestamp">
                {new Date(msg.timestamp?.toDate()).toUTCString()}
              </span>
            </div>
          ))}
      </div>
      <div className="chatWindow__footer">
        <IconButton icon="icon-logout" />
        <form action="/">
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button type="submit" onClick={sendMessage}>
            Send message
          </button>
        </form>
        <IconButton icon="icon-logout" />
      </div>
    </div>
  );
};

export default Chat;
