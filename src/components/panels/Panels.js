import React, { useState, useRef } from "react";
import ImageCropModal from "./ImageCropModal";
import db from "../../firebase";
import "./panels.scss";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.33a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const CancelIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 8.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm9-2.6h-2.6c-.2 0-.5-.2-.6-.4l-.8-1.7C16.7 3.4 16 3 15.2 3H8.8c-.8 0-1.5.4-1.8 1.1l-.8 1.7c-.1.2-.3.4-.6.4H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2zm-9 12.5A5.45 5.45 0 0 1 6.5 13.2 5.45 5.45 0 0 1 12 7.7a5.45 5.45 0 0 1 5.5 5.5A5.45 5.45 0 0 1 12 18.7z" />
  </svg>
);

const NameIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const AboutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const ProfilePanel = ({ user, onClose, onUpdateProfile }) => {
  const fileInputRef = useRef(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Inline editing states
  const [editingField, setEditingField] = useState(null); // 'name' | 'about'
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editAbout, setEditAbout] = useState("Hey there! I am using CChat");

  // Local overrides (shown until page reload)
  const [localName, setLocalName] = useState(null);
  const [localAbout, setLocalAbout] = useState(null);

  const displayName = localName ?? user?.displayName ?? "Unknown";
  const displayAbout = localAbout ?? "Hey there! I am using CChat";
  const displayAvatar =
    avatarPreview || user?.photoURL || "https://placehold.co/200x200";

  // ── Avatar selection ──
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
    // Reset so same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = (blobUrl, blob) => {
    setAvatarPreview(blobUrl);
    setCropImageSrc(null);

    // Notify parent to persist if needed
    if (onUpdateProfile) {
      onUpdateProfile({ photoBlob: blob, photoURL: blobUrl });
    }
  };

  // ── Inline field editing ──
  const startEditing = (field) => {
    if (field === "name") {
      setEditName(displayName);
    } else if (field === "about") {
      setEditAbout(displayAbout);
    }
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const saveField = () => {
    if (editingField === "name" && editName.trim()) {
      setLocalName(editName.trim());
      if (onUpdateProfile) {
        onUpdateProfile({ displayName: editName.trim() });
      }
    } else if (editingField === "about") {
      setLocalAbout(editAbout.trim() || "Hey there! I am using CChat");
      if (onUpdateProfile) {
        onUpdateProfile({ about: editAbout.trim() });
      }
    }
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveField();
    if (e.key === "Escape") cancelEditing();
  };

  return (
    <div className="panel panel--sidebar">
      <div className="panel__header">
        <button className="panel__back" onClick={onClose}>
          <BackIcon />
        </button>
        <h3>Profile</h3>
      </div>
      <div className="panel__body">
        {/* Avatar section with decorative background */}
        <div className="panel__profileAvatar" onClick={handleAvatarClick}>
          <div className="panel__profileAvatarBg" />
          <div className="panel__profileAvatarWrapper">
            <img src={displayAvatar} alt="profile" />
            <div className="panel__profileCameraBadge">
              <CameraIcon />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div className="panel__profileField">
          <span className="panel__profileFieldIcon">
            <NameIcon />
          </span>
          {editingField === "name" ? (
            <div className="panel__profileFieldContent panel__profileFieldContent--editing">
              <input
                className="panel__profileInput"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                maxLength={40}
              />
              <div className="panel__profileInputMeta">
                <span className="panel__profileCharCount">
                  {40 - editName.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="panel__profileFieldContent">
              <span className="panel__profileFieldLabel">Your name</span>
              <span className="panel__profileFieldValue">{displayName}</span>
            </div>
          )}
          {editingField === "name" ? (
            <div className="panel__profileEditActions">
              <button
                className="panel__profileEditBtn"
                onClick={cancelEditing}
                title="Cancel"
              >
                <CancelIcon />
              </button>
              <button
                className="panel__profileEditBtn panel__profileEditBtn--confirm"
                onClick={saveField}
                title="Save"
              >
                <CheckIcon />
              </button>
            </div>
          ) : (
            <button
              className="panel__profileEditBtn"
              onClick={() => startEditing("name")}
            >
              <EditIcon />
            </button>
          )}
        </div>
        <div className="panel__profileHint">
          This name will be visible to your contacts and can be edited from the
          app on your mobile device.
        </div>

        {/* About */}
        <div className="panel__profileField">
          <span className="panel__profileFieldIcon">
            <AboutIcon />
          </span>
          {editingField === "about" ? (
            <div className="panel__profileFieldContent panel__profileFieldContent--editing">
              <textarea
                className="panel__profileInput panel__profileTextarea"
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelEditing();
                }}
                autoFocus
                maxLength={140}
                rows={3}
              />
              <div className="panel__profileInputMeta">
                <span className="panel__profileCharCount">
                  {140 - editAbout.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="panel__profileFieldContent">
              <span className="panel__profileFieldLabel">About</span>
              <span className="panel__profileFieldValue">{displayAbout}</span>
            </div>
          )}
          {editingField === "about" ? (
            <div className="panel__profileEditActions">
              <button
                className="panel__profileEditBtn"
                onClick={cancelEditing}
                title="Cancel"
              >
                <CancelIcon />
              </button>
              <button
                className="panel__profileEditBtn panel__profileEditBtn--confirm"
                onClick={saveField}
                title="Save"
              >
                <CheckIcon />
              </button>
            </div>
          ) : (
            <button
              className="panel__profileEditBtn"
              onClick={() => startEditing("about")}
            >
              <EditIcon />
            </button>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="panel__profileField">
          <span className="panel__profileFieldIcon">
            <PhoneIcon />
          </span>
          <div className="panel__profileFieldContent">
            <span className="panel__profileFieldLabel">Email</span>
            <span className="panel__profileFieldValue">
              {user?.email || "Not set"}
            </span>
          </div>
          <button className="panel__profileEditBtn" disabled>
            <EditIcon />
          </button>
        </div>
      </div>

      {/* Crop modal */}
      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCrop={handleCropComplete}
          onClose={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
};

// ── Reusable Controls ──
const Toggle = ({ checked, onChange, label, description }) => (
  <div className="settingsCtrl__row" onClick={() => onChange(!checked)}>
    <div className="settingsCtrl__rowText">
      <span className="settingsCtrl__label">{label}</span>
      {description && (
        <span className="settingsCtrl__desc">{description}</span>
      )}
    </div>
    <div className={`settingsCtrl__toggle ${checked ? "settingsCtrl__toggle--on" : ""}`}>
      <div className="settingsCtrl__toggleThumb" />
    </div>
  </div>
);

const RadioGroup = ({ options, value, onChange, name }) => (
  <div className="settingsCtrl__radioGroup">
    {options.map((opt) => (
      <label
        key={opt.value}
        className={`settingsCtrl__radio ${value === opt.value ? "settingsCtrl__radio--selected" : ""}`}
        onClick={() => onChange(opt.value)}
      >
        <div className="settingsCtrl__radioDot">
          {value === opt.value && <div className="settingsCtrl__radioDotInner" />}
        </div>
        <div className="settingsCtrl__radioText">
          <span className="settingsCtrl__label">{opt.label}</span>
          {opt.description && (
            <span className="settingsCtrl__desc">{opt.description}</span>
          )}
        </div>
      </label>
    ))}
  </div>
);

const Select = ({ label, value, onChange, options, description }) => (
  <div className="settingsCtrl__selectRow">
    <div className="settingsCtrl__rowText">
      <span className="settingsCtrl__label">{label}</span>
      {description && (
        <span className="settingsCtrl__desc">{description}</span>
      )}
    </div>
    <select
      className="settingsCtrl__select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ActionButton = ({ label, icon, onClick, variant }) => (
  <button
    className={`settingsCtrl__action ${variant === "danger" ? "settingsCtrl__action--danger" : ""}`}
    onClick={onClick}
  >
    {icon && <span className="settingsCtrl__actionIcon">{icon}</span>}
    {label}
  </button>
);

const SectionDivider = ({ title }) => (
  <div className="settingsCtrl__divider">
    {title && <span>{title}</span>}
  </div>
);

// ── localStorage helpers ──
const loadSettings = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(`cchat_${key}`);
    return raw !== null ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveSettings = (key, val) => {
  localStorage.setItem(`cchat_${key}`, JSON.stringify(val));
  // Notify same-tab listeners
  window.dispatchEvent(new Event("cchat-settings-changed"));
};

// ── Sub-Panel: Notifications ──
const NotificationsSubPanel = ({ onBack }) => {
  const [messageNotif, setMessageNotif] = useState(() => loadSettings("notif_message", true));
  const [groupNotif, setGroupNotif] = useState(() => loadSettings("notif_group", true));
  const [callRingtone, setCallRingtone] = useState(() => loadSettings("notif_call", true));
  const [reactionNotif, setReactionNotif] = useState(() => loadSettings("notif_reaction", true));
  const [msgPreview, setMsgPreview] = useState(() => loadSettings("notif_preview", true));
  const [sound, setSound] = useState(() => loadSettings("notif_sound", true));

  const toggle = (setter, key) => (v) => {
    setter(v);
    saveSettings(key, v);
  };

  return (
    <div className="panel__subPanel">
      <div className="panel__header">
        <button className="panel__back" onClick={onBack}><BackIcon /></button>
        <h3>Notifications</h3>
      </div>
      <div className="panel__body">
        <div className="settingsCtrl__section">
          <Toggle label="Message notifications" description="Show notifications for new messages" checked={messageNotif} onChange={toggle(setMessageNotif, "notif_message")} />
          <Toggle label="Group notifications" description="Show notifications for group messages" checked={groupNotif} onChange={toggle(setGroupNotif, "notif_group")} />
          <Toggle label="Reaction notifications" description="Show notifications when someone reacts" checked={reactionNotif} onChange={toggle(setReactionNotif, "notif_reaction")} />
        </div>
        <SectionDivider title="Sounds" />
        <div className="settingsCtrl__section">
          <Toggle label="Notification sounds" description="Play sounds for incoming messages" checked={sound} onChange={toggle(setSound, "notif_sound")} />
          <Toggle label="Call ringtone" description="Play ringtone for incoming calls" checked={callRingtone} onChange={toggle(setCallRingtone, "notif_call")} />
        </div>
        <SectionDivider title="Previews" />
        <div className="settingsCtrl__section">
          <Toggle label="Message preview" description="Show message text in notifications" checked={msgPreview} onChange={toggle(setMsgPreview, "notif_preview")} />
        </div>
      </div>
    </div>
  );
};

// ── Sub-Panel: Privacy ──
const PrivacySubPanel = ({ onBack }) => {
  const [lastSeen, setLastSeen] = useState(() => loadSettings("priv_lastseen", "everyone"));
  const [profilePhoto, setProfilePhoto] = useState(() => loadSettings("priv_photo", "everyone"));
  const [aboutVisibility, setAboutVisibility] = useState(() => loadSettings("priv_about", "everyone"));
  const [readReceipts, setReadReceipts] = useState(() => loadSettings("priv_read", true));
  const [disappearing, setDisappearing] = useState(() => loadSettings("priv_disappearing", "off"));

  const visibilityOpts = [
    { value: "everyone", label: "Everyone" },
    { value: "contacts", label: "My contacts" },
    { value: "nobody", label: "Nobody" },
  ];

  const disappearingOpts = [
    { value: "off", label: "Off" },
    { value: "24h", label: "24 hours" },
    { value: "7d", label: "7 days" },
    { value: "90d", label: "90 days" },
  ];

  const handleSelect = (setter, key) => (v) => {
    setter(v);
    saveSettings(key, v);
  };

  return (
    <div className="panel__subPanel">
      <div className="panel__header">
        <button className="panel__back" onClick={onBack}><BackIcon /></button>
        <h3>Privacy</h3>
      </div>
      <div className="panel__body">
        <div className="settingsCtrl__section">
          <Select label="Last seen & online" description="Who can see when you were last online" value={lastSeen} onChange={handleSelect(setLastSeen, "priv_lastseen")} options={visibilityOpts} />
          <Select label="Profile photo" description="Who can see your profile photo" value={profilePhoto} onChange={handleSelect(setProfilePhoto, "priv_photo")} options={visibilityOpts} />
          <Select label="About" description="Who can see your About info" value={aboutVisibility} onChange={handleSelect(setAboutVisibility, "priv_about")} options={visibilityOpts} />
        </div>
        <SectionDivider />
        <div className="settingsCtrl__section">
          <Toggle label="Read receipts" description="If turned off, you won't send or receive read receipts" checked={readReceipts} onChange={(v) => { setReadReceipts(v); saveSettings("priv_read", v); }} />
        </div>
        <SectionDivider title="Disappearing messages" />
        <div className="settingsCtrl__section">
          <Select label="Default message timer" description="Start new chats with disappearing messages" value={disappearing} onChange={handleSelect(setDisappearing, "priv_disappearing")} options={disappearingOpts} />
        </div>
        <SectionDivider title="Blocked contacts" />
        <div className="settingsCtrl__section">
          <div className="settingsCtrl__infoBox">
            <span>🚫</span>
            <div>
              <span>No blocked contacts</span>
              <span className="settingsCtrl__desc">Block contacts from their chat menu by clicking the ⋮ icon in the chat header.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sub-Panel: Theme ──
const ThemeSubPanel = ({ onBack }) => {
  const [theme, setTheme] = useState(() => loadSettings("theme", "dark"));
  const [doodle, setDoodle] = useState(() => loadSettings("theme_doodle", true));

  const handleTheme = (v) => {
    setTheme(v);
    saveSettings("theme", v);
    if (v === "system") {
      // Remove explicit theme so CSS media query takes over
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", v);
    }
  };

  const themeOptions = [
    { value: "system", label: "System default", description: "Uses your device's theme setting" },
    { value: "light", label: "Light", description: "Always use light theme" },
    { value: "dark", label: "Dark", description: "Always use dark theme" },
  ];

  return (
    <div className="panel__subPanel">
      <div className="panel__header">
        <button className="panel__back" onClick={onBack}><BackIcon /></button>
        <h3>Theme</h3>
      </div>
      <div className="panel__body">
        <SectionDivider title="Choose theme" />
        <div className="settingsCtrl__section">
          <RadioGroup name="theme" options={themeOptions} value={theme} onChange={handleTheme} />
        </div>
        <SectionDivider title="Chat wallpaper" />
        <div className="settingsCtrl__section">
          <Toggle label="Wallpaper doodle" description="Show the WhatsApp doodle pattern on chat backgrounds" checked={doodle} onChange={(v) => { setDoodle(v); saveSettings("theme_doodle", v); }} />
        </div>
      </div>
    </div>
  );
};

// ── Sub-Panel: Chats ──
const ChatsSubPanel = ({ onBack }) => {
  const [enterSend, setEnterSend] = useState(() => loadSettings("chat_enter", true));
  const [fontSize, setFontSize] = useState(() => loadSettings("chat_fontsize", "medium"));
  const [autoPhotos, setAutoPhotos] = useState(() => loadSettings("chat_auto_photos", true));
  const [autoAudio, setAutoAudio] = useState(() => loadSettings("chat_auto_audio", true));
  const [autoVideo, setAutoVideo] = useState(() => loadSettings("chat_auto_video", false));
  const [autoDocs, setAutoDocs] = useState(() => loadSettings("chat_auto_docs", true));
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const fontOpts = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const handleConfirm = async (action) => {
    setActionInProgress(true);
    try {
      const roomsSnapshot = await db.collection("rooms").get();

      if (action === "archive") {
        // Set archived:true on all rooms
        const batch = db.batch();
        roomsSnapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { archived: true });
        });
        await batch.commit();
      } else if (action === "clear") {
        // Batch-delete all messages in every room
        for (const roomDoc of roomsSnapshot.docs) {
          const messagesSnapshot = await roomDoc.ref.collection("messages").get();
          if (messagesSnapshot.empty) continue;
          // Firestore batch limit is 500
          let batch = db.batch();
          let count = 0;
          for (const msgDoc of messagesSnapshot.docs) {
            batch.delete(msgDoc.ref);
            count++;
            if (count >= 450) {
              await batch.commit();
              batch = db.batch();
              count = 0;
            }
          }
          if (count > 0) await batch.commit();
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} chats:`, err);
    } finally {
      setActionInProgress(false);
      setConfirmDialog(null);
    }
  };

  const handleExport = async () => {
    setActionInProgress(true);
    try {
      const roomsSnapshot = await db.collection("rooms").get();
      const exportData = {
        exported: new Date().toISOString(),
        version: "1.0.0",
        rooms: [],
      };

      for (const roomDoc of roomsSnapshot.docs) {
        const messagesSnapshot = await roomDoc.ref
          .collection("messages")
          .orderBy("timestamp", "asc")
          .get();

        const messages = messagesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            sender: data.name || "Unknown",
            text: data.message || null,
            image: data.image || null,
            timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
          };
        });

        exportData.rooms.push({
          id: roomDoc.id,
          name: roomDoc.data().name || "Unnamed",
          messageCount: messages.length,
          messages,
        });
      }

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cchat_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  const toggleSave = (setter, key) => (v) => {
    setter(v);
    saveSettings(key, v);
  };

  return (
    <div className="panel__subPanel">
      <div className="panel__header">
        <button className="panel__back" onClick={onBack}><BackIcon /></button>
        <h3>Chats</h3>
      </div>
      <div className="panel__body">
        <div className="settingsCtrl__section">
          <Toggle label="Enter is send" description="Press Enter to send a message" checked={enterSend} onChange={toggleSave(setEnterSend, "chat_enter")} />
          <Select label="Font size" value={fontSize} onChange={(v) => { setFontSize(v); saveSettings("chat_fontsize", v); }} options={fontOpts} />
        </div>
        <SectionDivider title="Media auto-download" />
        <div className="settingsCtrl__section">
          <Toggle label="Photos" description="Automatically display photos in chat" checked={autoPhotos} onChange={toggleSave(setAutoPhotos, "chat_auto_photos")} />
          <Toggle label="Audio" checked={autoAudio} onChange={toggleSave(setAutoAudio, "chat_auto_audio")} />
          <Toggle label="Video" checked={autoVideo} onChange={toggleSave(setAutoVideo, "chat_auto_video")} />
          <Toggle label="Documents" checked={autoDocs} onChange={toggleSave(setAutoDocs, "chat_auto_docs")} />
        </div>
        <SectionDivider title="Chat actions" />
        <div className="settingsCtrl__section">
          <ActionButton label="Archive all chats" icon="📦" onClick={() => setConfirmDialog("archive")} disabled={actionInProgress} />
          <ActionButton label="Clear all chats" icon="🗑️" onClick={() => setConfirmDialog("clear")} variant="danger" disabled={actionInProgress} />
          <ActionButton label="Export chat history" icon="📤" onClick={handleExport} disabled={actionInProgress} />
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirmDialog && (
        <div className="settingsCtrl__dialogOverlay" onClick={() => !actionInProgress && setConfirmDialog(null)}>
          <div className="settingsCtrl__dialog" onClick={(e) => e.stopPropagation()}>
            <h4>{confirmDialog === "archive" ? "Archive all chats?" : "Clear all chats?"}</h4>
            <p>
              {confirmDialog === "archive"
                ? "All your chats will be archived. They will be hidden from the sidebar but can be restored."
                : "All message history will be permanently deleted from all rooms. This action cannot be undone."}
            </p>
            <div className="settingsCtrl__dialogActions">
              <button className="settingsCtrl__dialogBtn" onClick={() => setConfirmDialog(null)} disabled={actionInProgress}>Cancel</button>
              <button
                className={`settingsCtrl__dialogBtn settingsCtrl__dialogBtn--confirm ${confirmDialog === "clear" ? "settingsCtrl__dialogBtn--danger" : ""}`}
                onClick={() => handleConfirm(confirmDialog)}
                disabled={actionInProgress}
              >
                {actionInProgress ? "Processing..." : confirmDialog === "archive" ? "Archive" : "Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-Panel: Help ──
const HelpSubPanel = ({ onBack, onShowHelpContent }) => {
  const sections = [
    { key: "faq", label: "FAQ", icon: "📖" },
    { key: "contact", label: "Contact us", icon: "✉️" },
    { key: "privacy", label: "Privacy policy", icon: "🔐" },
    { key: "terms", label: "Terms of service", icon: "📋" },
  ];

  return (
    <div className="panel__subPanel">
      <div className="panel__header">
        <button className="panel__back" onClick={onBack}><BackIcon /></button>
        <h3>Help</h3>
      </div>
      <div className="panel__body">
        <div className="settingsCtrl__section">
          {sections.map((s) => (
            <div
              key={s.key}
              className="settingsCtrl__link"
              onClick={() => onShowHelpContent && onShowHelpContent(s.key)}
              role="button"
              tabIndex={0}
            >
              <span className="settingsCtrl__linkIcon">{s.icon}</span>
              <span className="settingsCtrl__label">{s.label}</span>
              <span className="settingsCtrl__linkArrow">›</span>
            </div>
          ))}
        </div>
        <SectionDivider title="App info" />
        <div className="settingsCtrl__section">
          <div className="settingsCtrl__appInfo">
            <div className="settingsCtrl__appInfoLogo">💬</div>
            <span className="settingsCtrl__appInfoName">CChat</span>
            <span className="settingsCtrl__appInfoVersion">Version 1.0.0</span>
            <span className="settingsCtrl__desc">Built with React & Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Right-arrow chevron for settings rows ──
const ChevronRight = () => (
  <svg viewBox="0 0 10 18" width="10" height="18" fill="currentColor" style={{ opacity: 0.4 }}>
    <path d="M1 1l7 8-7 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const SettingsPanel = ({ user, onClose, onLogout, onShowProfile, onShowHelpContent }) => {
  const [subPanel, setSubPanel] = useState(null);

  return (
    <div className="panel panel--sidebar">
      {/* Main settings list */}
      <div className={`panel__settingsMain ${subPanel ? "panel__settingsMain--hidden" : ""}`}>
        <div className="panel__header">
          <button className="panel__back" onClick={onClose}>
            <BackIcon />
          </button>
          <h3>Settings</h3>
        </div>
        <div className="panel__body">
          <div
            className="panel__settingsItem"
            onClick={onShowProfile}
            role="button"
            tabIndex={0}
          >
            <img
              className="panel__settingsAvatar"
              src={user?.photoURL || "https://placehold.co/60x60"}
              alt="avatar"
            />
            <div className="panel__settingsInfo">
              <span className="panel__settingsName">
                {user?.displayName || "Unknown"}
              </span>
              <span className="panel__settingsAbout">
                Hey there! I am using CChat
              </span>
            </div>
          </div>

          <div className="panel__settingsList">
            <div className="panel__settingsRow" onClick={() => setSubPanel("notifications")}>
              <span className="panel__settingsIcon">🔔</span>
              <div className="panel__settingsRowText">
                <span className="panel__settingsLabel">Notifications</span>
                <span className="panel__settingsDesc">
                  Message, group & call tones
                </span>
              </div>
              <ChevronRight />
            </div>
            <div className="panel__settingsRow" onClick={() => setSubPanel("privacy")}>
              <span className="panel__settingsIcon">🔒</span>
              <div className="panel__settingsRowText">
                <span className="panel__settingsLabel">Privacy</span>
                <span className="panel__settingsDesc">
                  Block contacts, disappearing messages
                </span>
              </div>
              <ChevronRight />
            </div>
            <div className="panel__settingsRow" onClick={() => setSubPanel("theme")}>
              <span className="panel__settingsIcon">🌙</span>
              <div className="panel__settingsRowText">
                <span className="panel__settingsLabel">Theme</span>
                <span className="panel__settingsDesc">Dark mode</span>
              </div>
              <ChevronRight />
            </div>
            <div className="panel__settingsRow" onClick={() => setSubPanel("chats")}>
              <span className="panel__settingsIcon">💬</span>
              <div className="panel__settingsRowText">
                <span className="panel__settingsLabel">Chats</span>
                <span className="panel__settingsDesc">
                  Wallpaper, archive, chat history
                </span>
              </div>
              <ChevronRight />
            </div>
            <div className="panel__settingsRow" onClick={() => setSubPanel("help")}>
              <span className="panel__settingsIcon">❓</span>
              <div className="panel__settingsRowText">
                <span className="panel__settingsLabel">Help</span>
                <span className="panel__settingsDesc">
                  FAQ, contact us, privacy policy
                </span>
              </div>
              <ChevronRight />
            </div>
          </div>

          <button className="panel__logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Sub-panels slide in from the right */}
      {subPanel === "notifications" && <NotificationsSubPanel onBack={() => setSubPanel(null)} />}
      {subPanel === "privacy" && <PrivacySubPanel onBack={() => setSubPanel(null)} />}
      {subPanel === "theme" && <ThemeSubPanel onBack={() => setSubPanel(null)} />}
      {subPanel === "chats" && <ChatsSubPanel onBack={() => setSubPanel(null)} />}
      {subPanel === "help" && <HelpSubPanel onBack={() => setSubPanel(null)} onShowHelpContent={onShowHelpContent} />}
    </div>
  );
};

const StarredPanel = ({ starredMessages, onClose }) => {
  return (
    <div className="panel">
      <div className="panel__header">
        <button className="panel__back" onClick={onClose}>
          <BackIcon />
        </button>
        <h3>Starred Messages</h3>
      </div>
      <div className="panel__body">
        {starredMessages.length === 0 ? (
          <div className="panel__empty">
            <span className="panel__emptyIcon">⭐</span>
            <p>No starred messages</p>
            <span className="panel__emptyHint">
              Tap and hold on any message to star it
            </span>
          </div>
        ) : (
          <div className="panel__starredList">
            {starredMessages.map((msg, i) => (
              <div key={i} className="panel__starredItem">
                <div className="panel__starredRoom">{msg.roomName}</div>
                <div className="panel__starredBubble">
                  <span className="panel__starredName">{msg.name}</span>
                  <span>{msg.message || "📷 Photo"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Help Content Panel (covers chat window area) ──
const helpContent = {
  faq: {
    title: "Frequently Asked Questions",
    icon: "📖",
    sections: [
      {
        q: "How do I start a new chat?",
        a: "Click the 'New Chat' icon at the top of the sidebar. You can create a new room by entering a room name. Once created, the room will appear in your sidebar and you can start messaging.",
      },
      {
        q: "Can I send images and files?",
        a: "Yes! Click the attachment (📎) icon in the chat footer to open the file picker. You can upload images that will be shared in the conversation. The files are stored securely in Firebase Storage.",
      },
      {
        q: "How do I star a message?",
        a: "Double-click on any message to star or unstar it. Starred messages can be viewed from the sidebar menu under 'Starred Messages' for quick reference.",
      },
      {
        q: "How do I change my profile picture?",
        a: "Open Settings from the sidebar menu, click on your profile at the top, then click on your avatar photo. You'll be able to select and crop a new image.",
      },
      {
        q: "How do I search within a chat?",
        a: "Click the search icon (🔍) in the chat header or use the dropdown menu and select 'Search messages'. Type your search term to filter and highlight matching messages.",
      },
      {
        q: "How do I delete a room?",
        a: "Open the dropdown menu (⋮) in the chat header and select 'Delete room'. Note: this will permanently remove the room and all its messages. This action cannot be undone.",
      },
      {
        q: "Are my messages encrypted?",
        a: "Messages are transmitted securely via Firebase's encrypted connections. Data is stored in Google Cloud Firestore with enterprise-grade security and access controls.",
      },
      {
        q: "Can I use CChat on multiple devices?",
        a: "Yes! Since CChat runs in the browser, you can sign in with your Google account on any device. Your chats will sync automatically across all sessions.",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    icon: "✉️",
    content: "contact_form",
  },
  privacy: {
    title: "Privacy Policy",
    icon: "🔐",
    paragraphs: [
      { heading: "Information We Collect", text: "CChat collects minimal personal information to provide the messaging service. When you sign in with Google, we receive your display name, email address, and profile photo URL. Message content is stored in Firebase Firestore to enable real-time chat functionality." },
      { heading: "How We Use Your Information", text: "Your information is used solely to provide the CChat messaging service. We use your display name and photo to identify you in conversations. Your email address is used for authentication purposes only. We do not sell, share, or monetize your personal data." },
      { heading: "Data Storage & Security", text: "All data is stored securely in Google Cloud Firebase with industry-standard encryption. Messages are transmitted over encrypted connections (HTTPS/WSS). Your profile settings are stored locally in your browser's localStorage and are not transmitted to any server." },
      { heading: "Media & File Uploads", text: "Images and files shared in conversations are stored in Firebase Storage. These files are accessible only to participants in the chat room. You can delete shared media by clearing chat messages." },
      { heading: "Cookies & Local Storage", text: "CChat uses browser localStorage to persist your application settings (theme, notification preferences, etc.). No third-party tracking cookies are used. Authentication state is managed by Firebase Auth." },
      { heading: "Your Rights", text: "You can delete your account data at any time. All your messages, profile information, and uploaded media can be removed. Contact us if you need assistance with data deletion or have questions about your data." },
      { heading: "Changes to This Policy", text: "We may update this privacy policy from time to time. Changes will be effective immediately upon posting. Continued use of CChat after changes constitutes acceptance of the updated policy." },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: "📋",
    paragraphs: [
      { heading: "Acceptance of Terms", text: "By accessing and using CChat, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. CChat reserves the right to modify these terms at any time." },
      { heading: "Description of Service", text: "CChat is a web-based messaging application built for demonstration and educational purposes. It provides real-time chat, media sharing, and user management features powered by Google Firebase." },
      { heading: "User Accounts", text: "You must sign in with a valid Google account to use CChat. You are responsible for maintaining the security of your account credentials. You must not impersonate other users or create accounts for fraudulent purposes." },
      { heading: "Acceptable Use", text: "You agree not to use CChat for any unlawful purposes, to harass or abuse other users, to distribute malware or harmful content, to attempt to gain unauthorized access to the service, or to violate the intellectual property rights of others." },
      { heading: "Content Guidelines", text: "You are solely responsible for the content you share through CChat. You must not share content that is illegal, offensive, defamatory, or infringes on the rights of others. CChat reserves the right to remove content that violates these guidelines." },
      { heading: "Limitation of Liability", text: "CChat is provided 'as is' without warranties of any kind. We are not liable for any damages arising from the use or inability to use the service, including data loss, security breaches, or service interruptions." },
      { heading: "Termination", text: "We reserve the right to terminate or suspend your access to CChat at any time, with or without cause. You may also delete your account and data at any time. Upon termination, your right to use the service ceases immediately." },
    ],
  },
};

const HelpContentPanel = ({ section, onClose }) => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const data = helpContent[section];
  if (!data) return null;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection("feedback").add({
        ...contactForm,
        createdAt: new Date().toISOString(),
      });
      setContactSent(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setContactSent(false), 4000);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="helpContent">
      <div className="helpContent__header">
        <button className="helpContent__back" onClick={onClose}>
          <BackIcon />
        </button>
        <span className="helpContent__icon">{data.icon}</span>
        <h3>{data.title}</h3>
      </div>
      <div className="helpContent__body">
        {/* FAQ */}
        {data.sections && (
          <div className="helpContent__faq">
            {data.sections.map((item, i) => (
              <details key={i} className="helpContent__faqItem">
                <summary className="helpContent__faqQuestion">{item.q}</summary>
                <p className="helpContent__faqAnswer">{item.a}</p>
              </details>
            ))}
          </div>
        )}

        {/* Contact Form */}
        {data.content === "contact_form" && (
          <div className="helpContent__contact">
            {contactSent ? (
              <div className="helpContent__contactSuccess">
                <span className="helpContent__contactSuccessIcon">✅</span>
                <h4>Message sent!</h4>
                <p>We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form className="helpContent__contactForm" onSubmit={handleContactSubmit}>
                <div className="helpContent__formGroup">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="helpContent__formGroup">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="helpContent__formGroup">
                  <label>Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="account">Account issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="helpContent__formGroup">
                  <label>Message</label>
                  <textarea
                    placeholder="Describe your issue or feedback..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="helpContent__submitBtn">
                  Send message
                </button>
              </form>
            )}
          </div>
        )}

        {/* Privacy / Terms paragraphs */}
        {data.paragraphs && (
          <div className="helpContent__legal">
            <p className="helpContent__legalDate">Last updated: April 2026</p>
            {data.paragraphs.map((p, i) => (
              <div key={i} className="helpContent__legalSection">
                <h4>{p.heading}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { ProfilePanel, SettingsPanel, StarredPanel, HelpContentPanel };
