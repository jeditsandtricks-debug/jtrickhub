import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SettingsProvider } from "./context/SettingsContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
