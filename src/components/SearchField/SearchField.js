import React from "react";
import "./searchfield.scss";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.257-3.386 5.207 5.207 0 1 0-5.207 5.207 5.184 5.184 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.998-4.006zm-4.806 0a3.597 3.597 0 0 1-3.6-3.6 3.597 3.597 0 0 1 3.6-3.6 3.597 3.597 0 0 1 3.6 3.6 3.597 3.597 0 0 1-3.6 3.6z" />
  </svg>
);

const SearchField = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <div className="form-group__wrapper">
        <span className="form-group__icon">
          <SearchIcon />
        </span>
        <input
          placeholder="Search or start new chat"
          type="text"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchField;
