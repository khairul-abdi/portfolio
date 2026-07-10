import { Github, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { profile } from "../data/portfolio.js";

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phoneDisplay,
    href: profile.whatsapp,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: "https://www.google.com/maps/search/?api=1&query=Medan%2C%20Indonesia",
  },
];

export function Contact() {
  return (
    <>
      <section className="contact-hero section">
        <div>
          <span className="eyebrow">Contact</span>
          <h1>Need a backend engineer for APIs, payment systems, or scalable services?</h1>
          <p>
            Reach out through email, WhatsApp, LinkedIn, or GitHub. This page
            uses direct working links instead of a fake contact form.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href={`mailto:${profile.email}`}>
              <Mail size={18} /> Send Email
            </a>
            <a className="btn secondary" href={profile.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="contact-grid section compact">
        {contactCards.map((item) => {
          const Icon = item.icon;
          return (
            <a className="contact-card" key={item.label} href={item.href} target={item.label === "Email" ? undefined : "_blank"} rel="noreferrer">
              <Icon size={24} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </a>
          );
        })}
      </section>

      <section className="section two-column">
        <a className="social-card" href={profile.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={26} />
          <span>LinkedIn</span>
          <strong>khairul-abdi-dongoran</strong>
        </a>
        <a className="social-card" href={profile.github} target="_blank" rel="noreferrer">
          <Github size={26} />
          <span>GitHub</span>
          <strong>github.com/khairul-abdi</strong>
        </a>
      </section>
    </>
  );
}
