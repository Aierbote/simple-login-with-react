import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App, { ContextProvider } from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorBoundary from "./ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));

// // DEBUG : commented out to avoid duplicate of Side Effects during development
// root.render(
//   <React.StrictMode>
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   </React.StrictMode>
// );

root.render(
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
