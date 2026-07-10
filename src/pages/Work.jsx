import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Images,
  LockKeyhole,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { projects } from "../data/portfolio.js";
import { SectionHeader } from "../components/SectionHeader.jsx";

const galleryFiles = {
  anime: ["one-piece.png", "search.png", "VIEW.png"],
  "bank-hijra": ["1.png", "2.png"],
  blog: ["add-blog.png", "all.png", "result.png", "view.png"],
  book: ["about.png", "add.png", "delete.png", "edit.png", "VIEW.png"],
  booklist: ["add.png", "delete.png", "VIEW.png"],
  codegig: ["add.png", "search.png", "view.png"],
  "coffee-app": ["add-shop.png", "after-add-shop.png", "after-addCoffee.png", "view.png"],
  "customer-app": ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "all.png"],
  delivery: ["1.png", "1a.png", "1b.png", "2.png", "2a.png", "all.png", "thankyou.png"],
  ExcerTracker: ["all.png", "create-exercise-log.png", "Create-new-user.png", "edit.png", "VIEW.png"],
  ExpenseTrackerApp: ["add.png", "all.png", "delete.png", "view.png"],
  "fancy-quizapp": ["1.png", "2.png", "3.png", "4.png", "all.png"],
  koinworks: ["1.png", "2.png"],
  "landing-page": ["all.png", "weblanding.png"],
  member: ["api.png", "view.png"],
  movie: ["avengers.png", "harry-potter.png", "search.png"],
  mywebsite: ["blog.png", "casestudies.png", "home.png", "menu-hamburger.png"],
  "nodejs-jwt": ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "all.png"],
  olshop: ["1.png", "10.png", "11.png", "12.png", "13.png", "13a.png", "14.png", "15.png", "16.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "all.png"],
  paycombat: ["1.png", "2.png"],
  portfolio: ["about.png", "contact.png", "home.png", "menu.png"],
  product: ["add.png", "delete.png", "edit.png", "view.png"],
  "register-login": ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "all.png"],
  sibernetik: ["1.png", "11.png", "2.png"],
  "simple-github": ["1.png", "2.png", "3.png", "all.png"],
  vessel: ["1.png", "2.png", "3.png"],
};

function getProjectGallery(project) {
  if (project.gallery?.length) {
    return project.gallery.map((image) => {
      const src = typeof image === "string" ? image : image.src;
      const label =
        typeof image === "string"
          ? src.split("/").at(-1).replace(/\.[^.]+$/, "").replaceAll("-", " ")
          : image.label;

      return { src, label };
    });
  }

  const parts = project.image.split("/");
  const fileName = parts.at(-1);
  const folderName = parts.at(-2);
  const files = galleryFiles[folderName] || [fileName];
  const orderedFiles = [fileName, ...files.filter((file) => file !== fileName)];

  return orderedFiles.map((file) => ({
    src: `images/projects/${folderName}/${file}`,
    label: file.replace(/\.[^.]+$/, "").replaceAll("-", " "),
  }));
}

export function Work() {
  const [category, setCategory] = useState("All");
  const [gallery, setGallery] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    []
  );
  const filteredProjects = useMemo(() => {
    if (category === "All") return projects;
    return projects.filter((project) => project.category === category);
  }, [category]);

  const activeImage = gallery?.images[activeSlide];

  const closeGallery = () => {
    setGallery(null);
    setActiveSlide(0);
  };

  const showPrevious = () => {
    if (!gallery) return;
    setActiveSlide((current) => (current === 0 ? gallery.images.length - 1 : current - 1));
  };

  const showNext = () => {
    if (!gallery) return;
    setActiveSlide((current) => (current === gallery.images.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (!gallery) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery]);

  return (
    <>
      <section className="page-hero section">
        <span className="eyebrow">Work</span>
        <h1>Selected portfolio across backend, fullstack, and frontend products.</h1>
        <p>
          Legacy project links are preserved, while the UI is reorganized into
          a modern card grid with categories and clear project actions.
        </p>
      </section>

      <section className="section compact">
        <div className="filter-bar" role="tablist" aria-label="Project filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="section compact">
        <SectionHeader
          eyebrow={`${filteredProjects.length} projects`}
          title="Project archive"
        />
        <div className="project-grid">
          {filteredProjects.map((project) => {
            const images = getProjectGallery(project);

            return (
              <article className="project-card" key={project.name}>
                <button
                  className="project-image"
                  type="button"
                  onClick={() => {
                    setGallery({ project, images });
                    setActiveSlide(0);
                  }}
                  aria-label={`Open ${project.name} screenshots`}
                >
                  <img src={project.image} alt={`${project.name} preview`} loading="lazy" />
                  <span className="gallery-badge">
                    <Images size={16} />
                    {images.length}
                  </span>
                </button>
              <div className="project-body">
                <div className="project-meta">
                  <span>{project.category}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-stack">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    <ExternalLink size={17} /> Project
                  </a>
                  {project.source ? (
                    <a href={project.source} target="_blank" rel="noreferrer">
                      <Github size={17} /> {project.sourceLabel || "GitHub"}
                    </a>
                  ) : (
                    <span className="private-link">
                      <LockKeyhole size={17} /> {project.sourceLabel || "Private"}
                    </span>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      {gallery ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${gallery.project.name} screenshots`}>
          <button className="gallery-backdrop" type="button" aria-label="Close gallery" onClick={closeGallery} />
          <div className="gallery-dialog">
            <div className="gallery-header">
              <div>
                <span className="eyebrow">{gallery.project.category}</span>
                <h2>{gallery.project.name}</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Close gallery" onClick={closeGallery}>
                <X size={22} />
              </button>
            </div>

            <div className="gallery-stage">
              <button className="gallery-nav previous" type="button" aria-label="Previous screenshot" onClick={showPrevious}>
                <ChevronLeft size={28} />
              </button>
              <img src={activeImage.src} alt={`${gallery.project.name} - ${activeImage.label}`} />
              <button className="gallery-nav next" type="button" aria-label="Next screenshot" onClick={showNext}>
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="gallery-footer">
              <span>
                {activeSlide + 1} / {gallery.images.length}
              </span>
              <strong>{activeImage.label}</strong>
            </div>

            <div className="gallery-thumbs" aria-label="Screenshot thumbnails">
              {gallery.images.map((image, index) => (
                <button
                  key={image.src}
                  className={index === activeSlide ? "active" : ""}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show screenshot ${index + 1}`}
                >
                  <img src={image.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
