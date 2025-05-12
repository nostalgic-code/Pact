import { Logo } from '@/components/logo';
import { Link } from 'react-router-dom';

const links = [
  {
    title: 'How It Works',
    href: '/#how-it-works',
  },
  {
    title: 'Why Pact',
    href: '/#benefits',
  },
  {
    title: 'Pricing',
    href: '/#pricing',
  },
  {
    title: 'FAQ',
    href: '/#faq',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
];

export default function FooterSection() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Link to="/" aria-label="Go home" className="mx-auto mb-6 block size-fit">
          <Logo />
        </Link>

        <div className="my-6 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-muted-foreground text-sm">
          Built for creators, solopreneurs, and small teams—one tiny experiment at a time.
        </div>

        <span className="mt-4 block text-muted-foreground text-xs">
          © {new Date().getFullYear()} Pact. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
