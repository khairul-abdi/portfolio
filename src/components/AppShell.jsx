import { Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "../data/portfolio.js";

const navigation = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "articles", label: "articles" },
  { id: "contact", label: "contact" },
];

export function AppShell({ children, route, locale, t, currentPath }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href={`#/${locale}/home`} aria-label={t.nav.home}>
          <span className="brand-mark">
            <img src="favicon.png" alt="" />
          </span>
          <span>
            <strong>Khairul Abdi Dongoran</strong>
            <small>{t.profile.title}</small>
          </span>
        </a>

        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              className={route === item.id ? "active" : ""}
              href={`#/${locale}/${item.id}`}
            >
              {t.nav[item.label]}
            </a>
          ))}
        </nav>

        <div className="language-switcher" aria-label="Language switcher">
          <a className={locale === "id" ? "active" : ""} href={`#/id/${currentPath}`}>
            ID
          </a>
          <a className={locale === "en" ? "active" : ""} href={`#/en/${currentPath}`}>
            EN
          </a>
        </div>

        <a className="header-cta" href={`mailto:${profile.email}`}>
          <Mail size={18} />
          <span>{t.nav.hire}</span>
        </a>

        <button
          className="mobile-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>Khairul Abdi Dongoran</span>
        <span>{t.footer}</span>
      </footer>
    </div>
  );
}
