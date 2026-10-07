import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./components/AppShell.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Work } from "./pages/Work.jsx";
import { Contact } from "./pages/Contact.jsx";
import { Articles } from "./pages/Articles.jsx";
import { ArticleDetail } from "./pages/ArticleDetail.jsx";
import { defaultLocale, getDictionary, isLocale } from "./data/i18n.js";
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
  articles: {
    title: "Articles - Khairul Abdi Dongoran",
    description:
      "Articles, case studies, and technical notes by Khairul Abdi Dongoran about backend engineering, infrastructure, networking, DevOps, and AI.",
    path: "/article.html",
  },
};

const pages = {
  home: Home,
  about: About,
  work: Work,
  articles: Articles,
  contact: Contact,
};

function getRoute() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [maybeLocale, maybePage, maybeSlug] = parts;
  const locale = isLocale(maybeLocale) ? maybeLocale : defaultLocale;
  const page = isLocale(maybeLocale) ? maybePage || "home" : maybeLocale || "home";

  if (page === "article" && maybeSlug) {
    return { locale, page: "article", slug: maybeSlug };
  }

  return { locale, page: pages[page] ? page : "home", slug: null };
}

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function updateSeo(route, locale) {
  const currentSeo = seo[route] || seo.home;
  const canonical = `${siteUrl}${currentSeo.path}`;
  const t = getDictionary(locale);

  document.title = currentSeo.title;
  document.documentElement.lang = t.htmlLang;
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
  const [routeState, setRouteState] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRouteState(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    updateSeo(routeState.page, routeState.locale);
  }, [routeState]);

  const Page = useMemo(() => pages[routeState.page], [routeState.page]);
  const t = useMemo(() => getDictionary(routeState.locale), [routeState.locale]);

  return (
    <AppShell
      route={routeState.page}
      locale={routeState.locale}
      t={t}
      currentPath={routeState.slug ? `${routeState.page}/${routeState.slug}` : routeState.page}
    >
      {routeState.page === "article" ? (
        <ArticleDetail locale={routeState.locale} slug={routeState.slug} t={t} />
      ) : (
        <Page locale={routeState.locale} t={t} />
      )}
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
