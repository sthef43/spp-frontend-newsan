import React from "react";
import ReactDOM from "react-dom";
import { CalendarApp } from "./CalendarApp";
import "./styles.css";
// app.js
import "./axiosConfig";
import "tailwindcss/tailwind.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
if (import.meta.env.MODE == "production") {
  // eslint-disable-next-line
  console.log = function () {};
}

const container = document.getElementById("root");
ReactDOM.render(<CalendarApp />, container);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    alert("New version available! Ready to update?");
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  }
});
