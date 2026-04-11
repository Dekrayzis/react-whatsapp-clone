import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import Chat from "./components/chatwindow/Chat";
import { ProfilePanel, SettingsPanel, StarredPanel, HelpContentPanel } from "./components/panels/Panels";
import "./styles/app.scss";
import LoginScreen from "./components/login/LoginScreen";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { actionTypes } from "./store/Reducer";

function App() {
  const [{ user, starredMessages }, dispatch] = useStateValue();
  const [activePanel, setActivePanel] = useState(null);
  const [activeHelpSection, setActiveHelpSection] = useState(null);

  // Apply saved theme on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cchat_theme"));
      if (saved && saved !== "system") {
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch({ type: actionTypes.SET_USER, user: null });
    });
  };

  return (
    <div className="app">
      {!user ? (
        <LoginScreen />
      ) : (
        <div className="app__body">
          <SideBar activePanel={activePanel} setActivePanel={setActivePanel} />

          {/* Chat area (or help content panel overlay) */}
          <div className="app__chatArea">
            <Switch>
              <Route path={"/"} exact component={Chat} />
              <Route path={"/rooms/:roomId"} exact component={Chat} />
            </Switch>

            {/* Help content panel overlays the chat window */}
            {activeHelpSection && (
              <HelpContentPanel
                section={activeHelpSection}
                onClose={() => setActiveHelpSection(null)}
              />
            )}
          </div>

          {/* Full-width overlay panels */}
          {activePanel === "profile" && (
            <ProfilePanel
              user={user}
              onClose={() => setActivePanel(null)}
              onUpdateProfile={(updates) => {
                const updatedUser = {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                  ...updates,
                };
                dispatch({ type: actionTypes.SET_USER, user: updatedUser });
              }}
            />
          )}
          {activePanel === "settings" && (
            <SettingsPanel
              user={user}
              onClose={() => setActivePanel(null)}
              onLogout={handleLogout}
              onShowProfile={() => setActivePanel("profile")}
              onShowHelpContent={(section) => setActiveHelpSection(section)}
            />
          )}
          {activePanel === "starred" && (
            <StarredPanel
              starredMessages={starredMessages}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
