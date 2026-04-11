import React, { useRef, useEffect } from "react";
import "./emojipicker.scss";

const EMOJI_LIST = [
  "😀", "😂", "🤣", "😊", "😍", "🥰", "😘", "😎", "🤔", "😏",
  "😢", "😭", "😤", "🤬", "🤯", "😱", "🥳", "😴", "🤢", "🤮",
  "👍", "👎", "👏", "🙌", "🤝", "✌️", "🤞", "💪", "🙏", "❤️",
  "🔥", "⭐", "🎉", "🎊", "💯", "✅", "❌", "⚡", "🌟", "💎",
  "😇", "🤗", "🤩", "😋", "😜", "🤪", "😝", "🤑", "🤫", "🤭",
  "👋", "🖐️", "✋", "🤚", "👌", "🤌", "🤏", "✍️", "💅", "🫶",
  "🐕", "🐈", "🦁", "🐻", "🐼", "🐨", "🐯", "🦊", "🐸", "🐵",
  "🍕", "🍔", "🌮", "🍜", "🍣", "🍩", "🎂", "🍦", "☕", "🍺",
];

const EmojiPicker = ({ onSelect, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="emojiPicker" ref={ref}>
      <div className="emojiPicker__header">
        <span>Emojis</span>
      </div>
      <div className="emojiPicker__grid">
        {EMOJI_LIST.map((emoji, i) => (
          <button
            key={i}
            className="emojiPicker__emoji"
            onClick={() => onSelect(emoji)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
