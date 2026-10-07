function inlineMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderBlocks(markdown) {
  const content = markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "");
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let list = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: `h${heading[1].length}`, text: heading[2] });
      return;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushParagraph();
      flushList();
      blocks.push({ type: "img", alt: image[1], src: image[2] });
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      return;
    }

    flushList();
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();
  return blocks;
}

export function MarkdownContent({ source }) {
  const blocks = renderBlocks(source);

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "ul") {
          return (
            <ul key={key}>
              {block.items.map((item) => (
                <li key={item} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
              ))}
            </ul>
          );
        }

        if (block.type === "img") {
          return (
            <figure className="article-image" key={key}>
              <img src={block.src} alt={block.alt} loading="lazy" />
              {block.alt ? <figcaption>{block.alt}</figcaption> : null}
            </figure>
          );
        }

        const Tag = block.type;
        return <Tag key={key} dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }} />;
      })}
    </div>
  );
}
