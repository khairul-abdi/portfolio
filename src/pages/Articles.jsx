import { CalendarDays, ArrowRight } from "lucide-react";
import { articles, localizedField } from "../data/articles.js";
import { SectionHeader } from "../components/SectionHeader.jsx";

export function Articles({ locale, t }) {
  return (
    <>
      <section className="page-hero section">
        <span className="eyebrow">{t.articles.eyebrow}</span>
        <h1>{t.articles.title}</h1>
        <p>{t.articles.description}</p>
      </section>

      <section className="section compact">
        <SectionHeader eyebrow={t.articles.listLabel} title={`${articles.length} ${t.work.projects}`} />
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.slug}>
              <img src={article.image} alt={localizedField(article.imageAlt, locale)} loading="lazy" />
              <div className="article-card-body">
                <div className="project-meta">
                  <span>{localizedField(article.category, locale)}</span>
                </div>
                <h2>{localizedField(article.title, locale)}</h2>
                <p>{localizedField(article.description, locale)}</p>
                <div className="article-date">
                  <CalendarDays size={17} />
                  <span>{article.publishedAt}</span>
                </div>
                <a className="article-link" href={`#/${locale}/article/${article.slug}`}>
                  {t.common.readArticle} <ArrowRight size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
