import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./components/AppShell.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Work } from "./pages/Work.jsx";
import { Contact } from "./pages/Contact.jsx";
import "./styles.css";

const pages = {
  home: Home,
  about: About,
  work: Work,
  contact: Contact,
};

function getRoute() {
  const route = window.location.hash.replace("#/", "").replace("#", "");
  return pages[route] ? route : "home";
}

function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  const Page = useMemo(() => pages[route], [route]);

  return (
    <AppShell route={route}>
      <Page />
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
