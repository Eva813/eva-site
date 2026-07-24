import { Globe, Mail } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";
import avatar from "@/assets/avatar.jpg";
import { siteConfig } from "@/config/site";

const { author, links } = siteConfig;

// lucide-react v1 dropped brand logos, so the GitHub mark is inlined here.
function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

const contacts = [
  { href: links.github, label: "GitHub", icon: GithubIcon },
  { href: links.website, label: "Website", icon: Globe },
  { href: `mailto:${links.email}`, label: "Email", icon: Mail },
];

export function Hero() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={author.name}
          priority
          className="size-20 rounded-full border border-border object-cover sm:size-24"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{author.name}</h1>
          <p className="text-muted-foreground">{author.title}</p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {contacts.map(({ href, label, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
