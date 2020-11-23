/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
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
import FileModal from "../modal/FileModal";

const Chat = () => {
  const [{ user }, dispatch] = useStateValue();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [uploadState, setUploadState] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(null);

  const [fileUrl, setURL] = useState(null);
  const [modal, setModal] = useState(false);
  const { roomId } = useParams();

  const createMessage = () => {
    const message = {
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
      setURL(null);
    } else {
      message["message"] = newMessage;
    }
    return message;
  };

  const sendMessage = (ev) => {
    if (ev) {
      ev.preventDefault();
    }
    const message = createMessage();

    db.collection("rooms").doc(roomId).collection("messages").add(message);
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
          setMessages((prevState) => snapShot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  const openModal = () => setModal((prev) => !modal);
  const closeModal = () => {
    console.log("closed" + modal);
    setModal(!modal);
  };

  const handleUpload = (file, metaData) => {
    const uploadTask = firebase.storage().ref(`/images/${file.name}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      firebase
        .storage()
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
          setURL(url);
        });
    });
  };

  useEffect(() => {
    if (fileUrl !== null) {
      sendMessage();
    }
  }, [fileUrl]);

  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("message")
    );
  };

  return (
    <>
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
                {isImage(msg) ? (
                  <img src={msg.image} alt="an image" />
                ) : (
                  msg.message
                )}
                <span className="chat__timestamp">
                  {new Date(msg.timestamp?.toDate()).toUTCString()}
                </span>
              </div>
            ))}
        </div>

        <div className="chatWindow__footer">
          <IconButton icon="icon-emo-happy" />
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
          <IconButton icon="icon-attach" onClick={() => openModal(!modal)} />
          <FileModal
            closeModal={closeModal}
            modal={modal}
            uploadFile={handleUpload}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
