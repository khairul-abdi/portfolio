import { ArrowLeft, CalendarDays } from "lucide-react";
import { getArticleBySlug, getArticleContent, localizedField } from "../data/articles.js";
import { MarkdownContent } from "../components/MarkdownContent.jsx";

export function ArticleDetail({ locale, slug, t }) {
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <section className="page-hero section">
        <span className="eyebrow">{t.articles.eyebrow}</span>
        <h1>{t.common.notFound}</h1>
        <a className="btn secondary" href={`#/${locale}/articles`}>
          <ArrowLeft size={18} /> {t.common.backToArticles}
        </a>
      </section>
    );
  }

  return (
    <>
      <section className="article-hero section">
        <a className="article-back" href={`#/${locale}/articles`}>
          <ArrowLeft size={18} /> {t.common.backToArticles}
        </a>
        <span className="eyebrow">{localizedField(article.category, locale)}</span>
        <h1>{localizedField(article.title, locale)}</h1>
        <p>{localizedField(article.description, locale)}</p>
        <div className="article-meta-row">
          <span>
            <CalendarDays size={17} /> {t.common.published}: {article.publishedAt}
          </span>
          <span>{t.common.updated}: {article.updatedAt}</span>
        </div>
      </section>

      <section className="section compact">
        <MarkdownContent source={getArticleContent(article, locale)} />
      </section>
    </>
  );
}
