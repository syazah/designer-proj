import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserAuthProvider } from "./context/UserAuthProvider.jsx";
import { PanelContextProvider } from "./context/PanelContextProvider.jsx";
import { NormalContextProvider } from "./context/NormalContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthProvider>
      <NormalContextProvider>
        <PanelContextProvider>
          <App />
        </PanelContextProvider>
      </NormalContextProvider>
    </UserAuthProvider>
  </React.StrictMode>
);
