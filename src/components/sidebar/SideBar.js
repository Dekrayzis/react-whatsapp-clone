import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import IconButton from "./../buttons/IconButton";
import SearchField from "../SearchField/SearchField";
import SideBarChat from "../SidebarChat/SideBarChat";
import DropdownMenu from "../dropdown/DropdownMenu";
import { useStateValue } from "./../../StateProvider";
import { auth } from "../../firebase";
import { actionTypes } from "../../store/Reducer";
import db from "../../firebase";

import "./sidebar.scss";

// SVG icons
const CommunityIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const StatusIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

const ChannelsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M4.54 5c-.26.35-1.54 2.02-1.54 2.02L10 14v6h4v-6l7-6.98S19.46 5.35 19.2 5H4.54z" />
  </svg>
);

const SideBar = ({ activePanel, setActivePanel }) => {
  const [{ user, starredMessages }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch({ type: actionTypes.SET_USER, user: null });
    });
  };

  const handleNewGroup = () => {
    const roomName = prompt("Enter a name for the new group:");
    if (roomName) {
      db.collection("rooms").add({ name: roomName });
    }
  };

  const menuItems = [
    { label: "New group", onClick: handleNewGroup },
    {
      label: "Starred messages",
      onClick: () => setActivePanel("starred"),
    },
    { divider: true },
    { label: "Settings", onClick: () => setActivePanel("settings") },
    { label: "Log out", onClick: handleLogout },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header_left">
          <div
            onClick={() => setActivePanel("profile")}
            style={{ cursor: "pointer" }}
          >
            <Avatar avatar={user?.photoURL || "https://placehold.co/40x40"} />
          </div>
        </div>
        <div className="sidebar__header_right">
          <IconButton onClick={handleNewGroup}>
            <CommunityIcon />
          </IconButton>
          <IconButton onClick={() => setActivePanel("starred")}>
            <StatusIcon />
          </IconButton>
          <IconButton>
            <ChannelsIcon />
          </IconButton>
          <div className="sidebar__menuWrapper">
            <IconButton onClick={() => setShowMenu(!showMenu)}>
              <MenuIcon />
            </IconButton>
            {showMenu && (
              <DropdownMenu
                items={menuItems}
                onClose={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="sidebar__search">
        <SearchField value={searchTerm} onChange={setSearchTerm} />
        <button
          className={`sidebar__filter ${
            filterUnread ? "sidebar__filter--active" : ""
          }`}
          onClick={() => setFilterUnread(!filterUnread)}
          title={filterUnread ? "Show all chats" : "Show unread only"}
        >
          <FilterIcon />
        </button>
      </div>

      <SideBarChat searchTerm={searchTerm} filterUnread={filterUnread} />
    </aside>
  );
};

export default SideBar;
