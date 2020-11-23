import React from "react";
import "./sidebar.scss";
import Avatar from "../Avatar/Avatar";
import IconButton from "./../buttons/IconButton";
import SearchField from "../SearchField/SearchField";

const SideBar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header_left">
          <Avatar avatar="http//:placehold.it/60x60" />
          CChat
        </div>
        <div className="sidebar__header_right">
          <IconButton icon="icon-logout" label="Logout" />
        </div>
      </div>
      <div className="sidebar__search">
        <SearchField />
      </div>
      <div className="sidebar__chats"></div>
    </aside>
  );
};

export default SideBar;
