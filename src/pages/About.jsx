import { Briefcase, GraduationCap, Languages, MapPin, Phone, SearchCheck } from "lucide-react";
import {
  atsKeywords,
  education,
  experiences,
  languages,
  profile,
  skills,
} from "../data/portfolio.js";
import { SectionHeader } from "../components/SectionHeader.jsx";

export function About({ t }) {
  return (
    <>
      <section className="page-hero section">
        <span className="eyebrow">{t.about.eyebrow}</span>
        <h1>{t.about.title}</h1>
        <p>{t.profile.summary}</p>
      </section>

      <section className="about-layout section compact">
        <aside className="profile-card">
          <img src="images/photo.png" alt={profile.name} />
          <h2>{profile.name}</h2>
          <p>{t.profile.title}</p>
          <div className="profile-list">
            <span>
              <MapPin size={18} /> {profile.location}
            </span>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">
              <Phone size={18} /> {profile.phoneDisplay}
            </a>
          </div>
        </aside>

        <div className="content-card">
          <SectionHeader
            eyebrow={t.about.coreSkills}
            title={t.about.coreTitle}
            description={t.about.coreDescription}
          />
          <div className="skill-cloud">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow={t.about.experience}
          title={t.about.experienceTitle}
          description={t.about.experienceDescription}
        />
        <div className="timeline">
          {experiences.map((job) => (
            <article className="timeline-item" key={`${job.company}-${job.period}`}>
              <div className="timeline-dot">
                <Briefcase size={18} />
              </div>
              <div className="timeline-card">
                <div className="timeline-heading">
                  <div>
                    <h3>{job.company}</h3>
                    <p>{job.role}</p>
                  </div>
                  <span>{job.period}</span>
                </div>
                <strong>{job.focus}</strong>
                <ul>
                  {job.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <article className="content-card">
          <SectionHeader eyebrow={t.about.education} title={t.about.educationTitle} />
          <ul className="clean-list">
            {education.map((item) => (
              <li key={item}>
                <GraduationCap size={18} /> {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="content-card">
          <SectionHeader eyebrow={t.about.languages} title={t.about.communication} />
          <ul className="clean-list">
            {languages.map((item) => (
              <li key={item.name}>
                <Languages size={18} /> {item.name}: {item.level}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <article className="content-card">
          <SectionHeader
            eyebrow={t.about.ats}
            title={t.about.atsTitle}
            description={t.about.atsDescription}
          />
          <div className="skill-cloud keyword-cloud">
            {atsKeywords.map((keyword) => (
              <span key={keyword}>
                <SearchCheck size={15} />
                {keyword}
              </span>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
