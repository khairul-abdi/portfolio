import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { profile, skills } from "../data/portfolio.js";
import { SectionHeader } from "../components/SectionHeader.jsx";

const highlightIcons = [Server, Workflow, ShieldCheck];

export function Home({ locale, t }) {
  return (
    <>
      <section className="hero section">
        <div className="hero-copy">
          <div className="status-pill">
            <span />
            {t.profile.availability}
          </div>
          <h1>{profile.name}</h1>
          <p className="hero-title">{t.profile.title}</p>
          <p className="hero-summary">{t.profile.summary}</p>

          <div className="hero-actions">
            <a className="btn primary" href={`#/${locale}/work`}>
              {t.common.viewWork} <ArrowRight size={18} />
            </a>
            <a className="btn secondary" href={`mailto:${profile.email}`}>
              {t.common.contactMe}
            </a>
          </div>

          <div className="social-row" aria-label="Social links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={20} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={20} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>
              <Mail size={20} /> Email
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Profile summary">
          <img src="images/photo.png" alt="Khairul Abdi Dongoran" />
          <div>
            <span className="eyebrow">{t.profile.basedIn}</span>
            <h2>
              <MapPin size={22} />
              {profile.location}
            </h2>
            <p>{t.profile.heroPanel}</p>
          </div>
        </aside>
      </section>

      <section className="stats-grid section compact">
        {t.home.stats.map(([value, label]) => (
          <div className="stat-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <SectionHeader
          eyebrow={t.home.focusEyebrow}
          title={t.home.focusTitle}
          description={t.home.focusDescription}
        />
        <div className="feature-grid">
          {t.home.highlights.map(([title, text], index) => {
            const Icon = highlightIcons[index];
            return (
              <article className="feature-card" key={title}>
                <Icon size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow={t.home.stackEyebrow}
          title={t.home.stackTitle}
        />
        <div className="skill-cloud">
          {skills.slice(0, 18).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
    </>
  );
}
