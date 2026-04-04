import Image from "next/image";

const NAV_LINKS = ["About", "Pricing", "Gallery", "Contact"];

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-brand-green flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Charm" width={60} height={60} />
        <span className="navbar-brand">Charm</span>
      </div>
      <ul className="flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="nav-link"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
