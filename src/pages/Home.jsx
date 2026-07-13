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
import { profile, skills, stats } from "../data/portfolio.js";
import { SectionHeader } from "../components/SectionHeader.jsx";

const highlights = [
  {
    icon: Server,
    title: "Backend systems",
    text: "REST APIs, gRPC services, PostgreSQL, Redis, and production-ready service boundaries.",
  },
  {
    icon: Workflow,
    title: "Distributed architecture",
    text: "Microservices, event-driven flows with Kafka/RabbitMQ, and clean architecture practices.",
  },
  {
    icon: ShieldCheck,
    title: "Fintech reliability",
    text: "Secure payment gateway services, token auth, request signatures, routing, and observability.",
  },
];

export function Home() {
  return (
    <>
      <section className="hero section">
        <div className="hero-copy">
          <div className="status-pill">
            <span />
            Available for backend and fullstack roles
          </div>
          <h1>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-summary">{profile.summary}</p>

          <div className="hero-actions">
            <a className="btn primary" href="#/work">
              View Work <ArrowRight size={18} />
            </a>
            <a className="btn secondary" href={`mailto:${profile.email}`}>
              Contact Me
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
            <span className="eyebrow">Based in</span>
            <h2>
              <MapPin size={22} />
              {profile.location}
            </h2>
            <p>
              Building scalable services for fintech, digital transformation,
              and real-time monitoring platforms.
            </p>
          </div>
        </aside>
      </section>

      <section className="stats-grid section compact">
        {stats.map((item) => (
          <div className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Engineering focus"
          title="Systems that are readable, observable, and built to survive production traffic."
          description="The portfolio is now centered around backend credibility, fintech experience, and technical depth."
        />
        <div className="feature-grid">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <Icon size={26} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Core stack"
          title="Technologies used across backend, fullstack, infrastructure, and delivery."
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
