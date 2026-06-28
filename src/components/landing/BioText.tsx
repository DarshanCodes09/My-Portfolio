const TECH_LINKS: Record<string, string> = {
  TypeScript: 'https://www.typescriptlang.org/',
  React: 'https://react.dev/',
  'Next.js': 'https://nextjs.org/',
  'Tailwind CSS': 'https://tailwindcss.com/',
};

function linkBioTerms(text: string) {
  const terms = Object.keys(TECH_LINKS).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g',
  );

  return text.split(pattern).map((part, index) => {
    const href = TECH_LINKS[part];
    if (!href) return part;

    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link font-medium"
      >
        {part}
      </a>
    );
  });
}

export default function BioText({ text }: { text: string }) {
  return <>{linkBioTerms(text)}</>;
}
