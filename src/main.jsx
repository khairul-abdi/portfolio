import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./components/AppShell.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Work } from "./pages/Work.jsx";
import { Contact } from "./pages/Contact.jsx";
import "./styles.css";

const siteUrl = "https://khairul-abdi-dongoran.com";
const defaultImage = `${siteUrl}/images/photo.png`;

const seo = {
  home: {
    title: "Khairul Abdi Dongoran - Backend Developer",
    description:
      "Khairul Abdi Dongoran is a Fullstack, Backend, and Golang Developer in Medan, Indonesia with 6+ years of experience in fintech APIs, microservices, and scalable systems.",
    path: "/",
  },
  about: {
    title: "About Khairul Abdi Dongoran - Backend Engineer",
    description:
      "Experience, skills, education, and backend engineering background of Khairul Abdi Dongoran, focused on Golang, Java Spring Boot, Laravel, APIs, payments, and distributed systems.",
    path: "/about.html",
  },
  work: {
    title: "Portfolio Work - Khairul Abdi Dongoran",
    description:
      "Selected backend, fullstack, fintech, payment gateway, microservice, and frontend projects by Khairul Abdi Dongoran.",
    path: "/work.html",
  },
  contact: {
    title: "Contact Khairul Abdi Dongoran",
    description:
      "Contact Khairul Abdi Dongoran for backend engineering, fullstack development, API design, payment systems, and scalable service work.",
    path: "/contact.html",
  },
};

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

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function updateSeo(route) {
  const currentSeo = seo[route] || seo.home;
  const canonical = `${siteUrl}${currentSeo.path}`;

  document.title = currentSeo.title;
  setMeta('meta[name="description"]', "content", currentSeo.description);
  setMeta('meta[property="og:title"]', "content", currentSeo.title);
  setMeta('meta[property="og:description"]', "content", currentSeo.description);
  setMeta('meta[property="og:url"]', "content", canonical);
  setMeta('meta[property="og:image"]', "content", defaultImage);
  setMeta('meta[name="twitter:title"]', "content", currentSeo.title);
  setMeta('meta[name="twitter:description"]', "content", currentSeo.description);
  setMeta('meta[name="twitter:image"]', "content", defaultImage);
  setMeta('link[rel="canonical"]', "href", canonical);
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
    updateSeo(route);
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
