import "./styles/app.scss";
import SideBar from "./components/sidebar/SideBar";

function App() {
  return (
    <div className="app">
      <div className="app__body">
        {/* Sidebar */}
        <SideBar />
        {/* chat window */}
      </div>
    </div>
  );
}

export default App;
