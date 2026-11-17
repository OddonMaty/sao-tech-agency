import React from "react"
import ReactDOM from "react-dom/client"
import "../index.css"
import AdminApp from "./AdminApp"

if ("serviceWorker" in navigator && !import.meta.env.DEV) navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin/" }).catch(() => {})
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><AdminApp /></React.StrictMode>)
