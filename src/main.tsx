import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
