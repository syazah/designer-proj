import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserAuthProvider } from "./context/UserAuthProvider.jsx";
import { PanelContextProvider } from "./context/PanelContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthProvider>
      <PanelContextProvider>
        <App />
      </PanelContextProvider>
    </UserAuthProvider>
  </React.StrictMode>
);
