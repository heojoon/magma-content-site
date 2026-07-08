import { siteConfig } from "@config";

export default function Footer() {
  const links = Object.entries(siteConfig.links).filter(([, href]) => href);
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-8 text-xs text-ink-muted">
        <p>© {new Date().getFullYear()} {siteConfig.company.name}</p>
        <div className="flex gap-4">
          {links.map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer" className="hover:text-primary">
              {name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
