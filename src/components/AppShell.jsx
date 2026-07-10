import { Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "../data/portfolio.js";

const navigation = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export function AppShell({ children, route }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#/home" aria-label="Go to home">
          <span className="brand-mark">
            <img src="favicon.png" alt="" />
          </span>
          <span>
            <strong>Khairul Abdi Dongoran</strong>
            <small>Fullstack Developer</small>
          </span>
        </a>

        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              className={route === item.id ? "active" : ""}
              href={`#/${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={`mailto:${profile.email}`}>
          <Mail size={18} />
          <span>Hire Me</span>
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
        <span>Fullstack Developer | Backend Developer | Golang Developer</span>
      </footer>
    </div>
  );
}
