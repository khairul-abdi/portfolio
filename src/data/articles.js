import { defaultLocale, locales } from "./i18n.js";

const markdownFiles = import.meta.glob("../../content/articles/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const articles = [
  {
    slug: "mikrotik-routeros-and-network-infrastructure",
    title: {
      id: "MikroTik RouterOS & Infrastruktur Jaringan Terintegrasi",
      en: "MikroTik RouterOS & Integrated Network Infrastructure",
    },
    description: {
      id: "Studi implementasi MikroTik RouterOS untuk membangun jaringan yang stabil, aman, dan mudah dipelihara: mulai dari segmentasi LAN, Hotspot/Voucher, firewall, NAT, akses administrasi privat, integrasi Linux Server, Cloudflare Tunnel, Tailscale, monitoring, backup, hingga troubleshooting.",
      en: "A MikroTik RouterOS implementation case study for building a stable, secure, and maintainable network: covering LAN segmentation, Hotspot/Voucher, firewall, NAT, private administration access, Linux Server integration, Cloudflare Tunnel, Tailscale, monitoring, backup, and troubleshooting.",
    },
    category: {
      id: "MikroTik & Jaringan",
      en: "MikroTik & Networking",
    },
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    image: "/mikrotik/routeros-network-infrastructure.png",
    imageAlt: {
      id: "Diagram modern infrastruktur jaringan MikroTik RouterOS dengan Internet, firewall, jaringan internal, hotspot, CCTV, server, cloud, dan layanan web.",
      en: "Modern MikroTik RouterOS network infrastructure diagram with Internet, firewall, internal network, hotspot, CCTV, server, cloud, and web services.",
    },
    contentFile: {
      id: "mikrotik-routeros-and-network-infrastructure.md",
      en: "mikrotik-routeros-and-network-infrastructure.md",
    },
  },
  {
    slug: "hermes-9router-home-lab",
    title: {
      id: "Home Lab AI Hermes Agent + 9router untuk Kantor dan Pribadi",
      en: "An AI Home Lab with Hermes Agent + 9router for Work and Personal Projects",
    },
    description: {
      id: "Setup home lab AI yang privat dan terarah dengan Hermes Agent, 9router, serta dua workspace terpisah untuk project kantor dan pribadi.",
      en: "A private, structured AI home lab setup with Hermes Agent, 9router, and separate work and personal workspaces.",
    },
    category: {
      id: "AI Home Lab",
      en: "AI Home Lab",
    },
    publishedAt: "2026-09-26",
    updatedAt: "2026-09-26",
    image: "/home-lab-ai.svg",
    imageAlt: {
      id: "Logo portfolio untuk artikel home lab AI.",
      en: "Portfolio logo for the AI home lab article.",
    },
    contentFile: {
      id: "hermes-9router-home-lab.md",
      en: "hermes-9router-home-lab.md",
    },
  },
  {
    slug: "server-rumahan-ubuntu-docker-cicd",
    title: {
      id: "Setup Server Rumahan Ubuntu, Docker, CI/CD & Backup",
      en: "Home Server Setup with Ubuntu, Docker, CI/CD & Backup",
    },
    description: {
      id: "Studi kasus setup server rumahan: Ubuntu Server, Docker, CI/CD, PostgreSQL, Cloudflare Tunnel, Tailscale, Nginx, backup terjadwal, monitoring, dan security.",
      en: "A home server setup case study covering Ubuntu Server, Docker, CI/CD, PostgreSQL, Cloudflare Tunnel, Tailscale, Nginx, scheduled backups, monitoring, and security.",
    },
    category: {
      id: "Server & DevOps",
      en: "Server & DevOps",
    },
    publishedAt: "2026-09-03",
    updatedAt: "2026-09-03",
    image: "/ubuntu-server/01-arsitektur-server.png",
    imageAlt: {
      id: "Logo portfolio untuk artikel server rumahan Ubuntu.",
      en: "Portfolio logo for the home Ubuntu Server article.",
    },
    contentFile: {
      id: "ubuntu-server-devops-portfolio.md",
      en: "ubuntu-server-devops-portfolio.md",
    },
  },
];

export function localizedField(value, locale) {
  return value?.[locale] || value?.[defaultLocale] || "";
}

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function getArticleContent(article, locale) {
  const activeLocale = locales.includes(locale) ? locale : defaultLocale;
  const file = article.contentFile[activeLocale] || article.contentFile[defaultLocale];
  const key = `../../content/articles/${activeLocale}/${file}`;
  const fallbackKey = `../../content/articles/${defaultLocale}/${article.contentFile[defaultLocale]}`;

  return markdownFiles[key] || markdownFiles[fallbackKey] || "";
}
