import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { loadContent } from "./lib/content"

// Le contenu publié est chargé avant l'affichage ; les pages sont importées ensuite.
loadContent().then(async () => {
  const { default: App } = await import("./App")
  ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
})
