'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: '服務' },
  { href: '/qianhai', label: '前海機會' },
  { href: '/pricing', label: '收費模式' },
  { href: '/contact', label: '聯絡我們' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-darkBg py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <img src="/logo-white.svg" alt="CoreMachine Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold text-accent">CoreMachine</span>
      </div>

      <ul className="flex space-x-6">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`hover:text-accent transition-colors ${
                pathname === l.href ? 'text-accent' : ''
              }`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}