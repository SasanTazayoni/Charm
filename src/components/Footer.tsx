import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-copyright">
        © 2026 Charm. All rights reserved.
        <Link
          href="https://github.com/SasanTazayoni/Charm"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github"
        >
          <FaGithub size={18} />
        </Link>
      </p>
    </footer>
  );
}
