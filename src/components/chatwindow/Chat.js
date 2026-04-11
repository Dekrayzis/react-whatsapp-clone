/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";

//-- Components
import Avatar from "../Avatar/Avatar";
import IconButton from "./../buttons/IconButton";
import { useStateValue } from "./../../StateProvider";
import EmojiPicker from "../emoji/EmojiPicker";
import DropdownMenu from "../dropdown/DropdownMenu";
import { actionTypes } from "../../store/Reducer";

//-- Store
import db from "../../firebase";

//-- Style
import "./chat.scss";
import FileModal from "../modal/FileModal";

// SVG Icons
const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm5.694 0c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-.003-3.5c-2.035 0-3.89-1.171-4.77-2.996a.638.638 0 0 1 1.147-.563c.66 1.37 2.06 2.254 3.623 2.254s2.963-.884 3.623-2.254a.638.638 0 0 1 1.147.563c-.88 1.825-2.735 2.996-4.77 2.996z" />
  </svg>
);

const AttachIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.501.501 1.137.847 1.793.971.636.123 1.198.015 1.583-.37l6.236-6.236a.476.476 0 0 0-.672-.672l-6.236 6.236a.96.96 0 0 1-.673.17 2.238 2.238 0 0 1-1.269-.673c-.707-.707-.768-1.542-.189-2.121l7.916-7.916c1.042-1.041 2.824-.943 3.99.225.587.586.913 1.304.966 2.014.056.726-.227 1.38-.798 1.952l-9.547 9.548a4.595 4.595 0 0 1-3.3 1.374c-1.246 0-2.417-.487-3.3-1.37a4.634 4.634 0 0 1-1.374-3.301c0-1.246.487-2.417 1.374-3.3l8.576-8.576a.476.476 0 0 0-.672-.672L3.463 12.26c-1.065 1.065-1.647 2.471-1.647 3.296z" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H4.761c0 3.885 3.177 7.12 7.06 7.473v3.296H13.18v-3.296c3.884-.353 7.06-3.588 7.06-7.473h-2.003z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.257-3.386 5.207 5.207 0 1 0-5.207 5.207 5.184 5.184 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.998-4.006zm-4.806 0a3.597 3.597 0 0 1-3.6-3.6 3.597 3.597 0 0 1 3.6-3.6 3.597 3.597 0 0 1 3.6 3.6 3.597 3.597 0 0 1-3.6 3.6z" />
  </svg>
);

const MenuDotsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.239 1.816-13.239 1.817-.011 7.912z" />
  </svg>
);

const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatLastSeen = (date) => {
  if (!date) return "";
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return `today at ${formatTime(date)}`;
  if (days === 1) return `yesterday at ${formatTime(date)}`;
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDateLabel = (date) => {
  if (!date) return null;
  const now = new Date();
  const msgDate = new Date(date);
  const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";
  return msgDate
    .toLocaleDateString([], {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
};

// ── Settings helpers ──
const loadSetting = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(`cchat_${key}`);
    return raw !== null ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const Chat = () => {
  const [{ user, starredMessages }, dispatch] = useStateValue();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [fileUrl, setURL] = useState(null);
  const [modal, setModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { roomId } = useParams();
  const history = useHistory();
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const recordingRef = useRef(null);

  // ── Live settings ──
  const [enterIsSend, setEnterIsSend] = useState(() => loadSetting("chat_enter", true));
  const [fontSize, setFontSize] = useState(() => loadSetting("chat_fontsize", "medium"));
  const [showDoodle, setShowDoodle] = useState(() => loadSetting("theme_doodle", true));
  const [readReceipts, setReadReceipts] = useState(() => loadSetting("priv_read", true));
  const [lastSeenPref, setLastSeenPref] = useState(() => loadSetting("priv_lastseen", "everyone"));
  const [disappearing, setDisappearing] = useState(() => loadSetting("priv_disappearing", "off"));
  const [autoPhotos, setAutoPhotos] = useState(() => loadSetting("chat_auto_photos", true));
  const [notifMessage, setNotifMessage] = useState(() => loadSetting("notif_message", true));
  const [notifSound, setNotifSound] = useState(() => loadSetting("notif_sound", true));
  const [notifPreview, setNotifPreview] = useState(() => loadSetting("notif_preview", true));
  const [downloadedImages, setDownloadedImages] = useState(new Set());
  const prevMessageCountRef = useRef(0);

  // Re-read settings when they change in another component
  useEffect(() => {
    const onStorage = () => {
      setEnterIsSend(loadSetting("chat_enter", true));
      setFontSize(loadSetting("chat_fontsize", "medium"));
      setShowDoodle(loadSetting("theme_doodle", true));
      setReadReceipts(loadSetting("priv_read", true));
      setLastSeenPref(loadSetting("priv_lastseen", "everyone"));
      setDisappearing(loadSetting("priv_disappearing", "off"));
      setAutoPhotos(loadSetting("chat_auto_photos", true));
      setNotifMessage(loadSetting("notif_message", true));
      setNotifSound(loadSetting("notif_sound", true));
      setNotifPreview(loadSetting("notif_preview", true));
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cchat-settings-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cchat-settings-changed", onStorage);
    };
  }, []);

  const fontSizeClass = fontSize === "small" ? "chatWindow--fontSmall" : fontSize === "large" ? "chatWindow--fontLarge" : "";

  // ── Disappearing messages filter ──
  const getDisappearingMs = () => {
    switch (disappearing) {
      case "24h": return 24 * 60 * 60 * 1000;
      case "7d": return 7 * 24 * 60 * 60 * 1000;
      case "90d": return 90 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

  const filterDisappearing = (msgs) => {
    const ttl = getDisappearingMs();
    if (!ttl) return msgs;
    const now = Date.now();
    return msgs.filter((msg) => {
      const msgTime = msg.timestamp?.toDate?.();
      if (!msgTime) return true; // keep messages without timestamps (pending)
      return now - msgTime.getTime() < ttl;
    });
  };

  const createMessage = (overrideText) => {
    const message = {
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
      setURL(null);
    } else {
      message["message"] = overrideText || newMessage;
    }
    return message;
  };

  const sendMessage = (ev) => {
    if (ev) ev.preventDefault();
    if (!newMessage.trim() && fileUrl === null) return;
    const message = createMessage();
    db.collection("rooms").doc(roomId).collection("messages").add(message);
    setNewMessage("");
    setShowEmoji(false);
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapShot) => {
          const data = snapShot.data();
          setRoomName(data?.name || "");
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapShot) => {
          const newMessages = snapShot.docs.map((doc) => doc.data());
          setMessages(newMessages);

          // ── Browser notifications for new incoming messages ──
          if (prevMessageCountRef.current > 0 && newMessages.length > prevMessageCountRef.current) {
            const latest = newMessages[newMessages.length - 1];
            if (latest && latest.name !== user.displayName && notifMessage) {
              // Request permission if not yet granted
              if (Notification.permission === "default") {
                Notification.requestPermission();
              }
              if (Notification.permission === "granted") {
                const body = notifPreview
                  ? (latest.message || "📷 Photo")
                  : "New message";
                try {
                  new Notification(latest.name, {
                    body,
                    icon: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(latest.name)}&backgroundColor=00a884&textColor=ffffff`,
                    tag: `cchat-${roomId}`,
                  });
                } catch (e) { /* notifications not supported */ }
              }
              // Play sound
              if (notifSound) {
                try {
                  const audio = new Audio("data:audio/wav;base64,UklGRl9vT19teleVBmb3JtYXQAAQABAEARAABAAQACABAAZGF0YU" + "tvT19t");
                  audio.volume = 0.3;
                  audio.play().catch(() => {});
                } catch (e) {}
              }
            }
          }
          prevMessageCountRef.current = newMessages.length;
        });
    }
  }, [roomId, notifMessage, notifSound, notifPreview, user.displayName]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (recording) {
      recordingRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingRef.current);
  }, [recording]);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleMicClick = () => {
    if (recording) {
      setRecording(false);
    } else {
      setRecording(true);
    }
  };

  const handleSendRecording = () => {
    // Send a voice message placeholder
    const message = {
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: `🎤 Voice message (${formatRecordingTime(recordingTime)})`,
    };
    db.collection("rooms").doc(roomId).collection("messages").add(message);
    setRecording(false);
  };

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleUpload = (file, metaData) => {
    const uploadTask = firebase.storage().ref(`/images/${file.name}`).put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload progress:", progress + "%");
      },
      (error) => {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
      },
      () => {
        // Upload complete — get URL and send message
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          // Directly add the image message to firestore
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
              name: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              image: url,
            });
        });
      }
    );
  };

  // Remove the fileUrl-based send since we now send directly in handleUpload
  // useEffect for fileUrl no longer needed

  const isImage = (message) =>
    message.hasOwnProperty("image") && !message.hasOwnProperty("message");

  const isStarred = (msg) =>
    starredMessages?.some(
      (m) =>
        m.message === msg.message &&
        m.name === msg.name &&
        m.roomId === roomId
    );

  const toggleStar = (msg) => {
    if (isStarred(msg)) {
      dispatch({
        type: actionTypes.UNSTAR_MESSAGE,
        message: msg,
        roomId,
      });
    } else {
      dispatch({
        type: actionTypes.STAR_MESSAGE,
        message: msg,
        roomId,
        roomName,
      });
    }
  };

  const lastMessageDate = messages[messages.length - 1]?.timestamp?.toDate?.();

  const chatMenuItems = [
    {
      label: "Contact info",
      onClick: () => alert(`Room: ${roomName}\nMessages: ${messages.length}`),
    },
    {
      label: "Search messages",
      onClick: () => {
        setShowSearch(true);
        setChatSearch("");
      },
    },
    { divider: true },
    {
      label: "Clear messages",
      onClick: () => {
        if (
          window.confirm(
            "Clear all messages in this room? This cannot be undone."
          )
        ) {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .get()
            .then((snapshot) => {
              const batch = db.batch();
              snapshot.docs.forEach((doc) => batch.delete(doc.ref));
              return batch.commit();
            });
        }
      },
    },
    {
      label: "Delete room",
      onClick: () => {
        if (window.confirm(`Delete "${roomName}"? This cannot be undone.`)) {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .get()
            .then((snapshot) => {
              const batch = db.batch();
              snapshot.docs.forEach((doc) => batch.delete(doc.ref));
              return batch.commit();
            })
            .then(() => db.collection("rooms").doc(roomId).delete())
            .then(() => history.push("/"));
        }
      },
    },
  ];

  // Apply disappearing messages filter
  const visibleMessages = filterDisappearing(messages);

  // Filter messages by search
  const displayMessages = chatSearch
    ? visibleMessages.map((msg) => ({
        ...msg,
        _highlighted:
          msg.message?.toLowerCase().includes(chatSearch.toLowerCase()) ||
          false,
      }))
    : visibleMessages;

  // Room avatar based on room name initials
  const roomAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    roomName
  )}&backgroundColor=2a3942&textColor=e9edef`;

  if (!roomId) {
    return (
      <div className="chatWindow chatWindow--empty">
        <div className="chatWindow__empty">
          <h2>CChat</h2>
          <p>Select a conversation or start a new one</p>
        </div>
      </div>
    );
  }

  let lastDateLabel = null;

  return (
    <div className={`chatWindow ${fontSizeClass} ${!showDoodle ? "chatWindow--noDoodle" : ""}`}>
      <div className="chatWindow__header">
        <Avatar avatar={roomAvatar} />
        <div className="chatWindow__header_info">
          <h3>{roomName}</h3>
          <p>
            {lastSeenPref !== "nobody" && lastMessageDate
              ? `Last seen ${formatLastSeen(lastMessageDate)}`
              : lastSeenPref === "nobody" ? "" : ""}
          </p>
        </div>
        <div className="chatWindow__headerRight">
          <IconButton
            onClick={() => {
              setShowSearch(!showSearch);
              setChatSearch("");
            }}
          >
            <SearchIcon />
          </IconButton>
          <div className="chatWindow__menuWrapper">
            <IconButton onClick={() => setShowChatMenu(!showChatMenu)}>
              <MenuDotsIcon />
            </IconButton>
            {showChatMenu && (
              <DropdownMenu
                items={chatMenuItems}
                onClose={() => setShowChatMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* In-chat search bar */}
      {showSearch && (
        <div className="chatWindow__searchBar">
          <input
            type="text"
            placeholder="Search messages..."
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
            autoFocus
          />
          <span className="chatWindow__searchCount">
            {chatSearch
              ? `${
                  displayMessages.filter((m) => m._highlighted).length
                } found`
              : ""}
          </span>
          <button
            className="chatWindow__searchClose"
            onClick={() => {
              setShowSearch(false);
              setChatSearch("");
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="chatWindow__body" ref={bodyRef}>
        {displayMessages.length > 0 &&
          displayMessages.map((msg, index) => {
            const msgDate = msg.timestamp?.toDate?.();
            const dateLabel = getDateLabel(msgDate);
            let showDivider = false;
            if (dateLabel && dateLabel !== lastDateLabel) {
              showDivider = true;
              lastDateLabel = dateLabel;
            }

            const isSent = msg.name === user.displayName;
            const dimmed = chatSearch && !msg._highlighted;

            return (
              <React.Fragment key={index}>
                {showDivider && (
                  <div className="chat__dateDivider">
                    <span>{dateLabel}</span>
                  </div>
                )}
                <div
                  className={`chat__message ${isSent ? "chat__receiver" : ""} ${
                    msg._highlighted ? "chat__message--highlighted" : ""
                  } ${dimmed ? "chat__message--dimmed" : ""}`}
                  onDoubleClick={() => toggleStar(msg)}
                  title="Double-click to star"
                >
                  {isStarred(msg) && (
                    <span className="chat__star">⭐</span>
                  )}
                  {!isSent && <span className="chat__name">{msg.name}</span>}
                  {isImage(msg) ? (
                    autoPhotos || downloadedImages.has(index) ? (
                      <img src={msg.image} alt="shared" />
                    ) : (
                      <div className="chat__mediaPlaceholder" onClick={() => setDownloadedImages(prev => new Set(prev).add(index))}>
                        <span className="chat__mediaPlaceholderIcon">📷</span>
                        <span className="chat__mediaPlaceholderText">Photo</span>
                        <button className="chat__mediaDownloadBtn">Download</button>
                      </div>
                    )
                  ) : (
                    <span className="chat__text">{msg.message}</span>
                  )}
                  {disappearing !== "off" && (
                    <span className="chat__disappearing" title="Disappearing message">⏱️</span>
                  )}
                  <span className="chat__timestamp">
                    {formatTime(msgDate)}
                    {isSent && readReceipts && <span className="chat__checkmarks"> ✓✓</span>}
                    {isSent && !readReceipts && <span className="chat__checkSingle"> ✓</span>}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
      </div>

      <div className="chatWindow__footer">
        {recording ? (
          <div className="chatWindow__recording">
            <span className="chatWindow__recording_dot" />
            <span className="chatWindow__recording_time">
              {formatRecordingTime(recordingTime)}
            </span>
            <span className="chatWindow__recording_text">Recording...</span>
            <button
              className="chatWindow__recording_cancel"
              onClick={() => setRecording(false)}
            >
              Cancel
            </button>
            <button
              className="chatWindow__recording_send"
              onClick={handleSendRecording}
            >
              Send
            </button>
          </div>
        ) : (
          <>
            <div className="chatWindow__footerBtn">
              <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                <EmojiIcon />
              </IconButton>
            </div>
            <IconButton onClick={openModal}>
              <AttachIcon />
            </IconButton>
          </>
        )}

        {!recording && (
          <form onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && enterIsSend) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <button type="submit">Send</button>
          </form>
        )}

        {!recording &&
          (newMessage.trim() ? (
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleMicClick}>
              <MicIcon />
            </IconButton>
          ))}

        {showEmoji && (
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmoji(false)}
          />
        )}
      </div>

      {modal && (
        <FileModal
          closeModal={closeModal}
          modal={modal}
          uploadFile={handleUpload}
        />
      )}
    </div>
  );
};

export default Chat;
