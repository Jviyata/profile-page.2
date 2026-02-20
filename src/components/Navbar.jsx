import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/navbar.module.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Add Profile", to: "/add" },
  { label: "Other Profiles", to: "/other" },
];

export default function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.navbar} data-testid="navbar">
      <div className={styles.navLinks}>
        {navLinks.map((link) => (
          <button
            key={link.to}
            onClick={() => handleNavClick(link.to)}
            data-testid={`nav-${link.to === "/" ? "home" : link.to.slice(1)}`}
            className={isActive(link.to) ? styles.navLinkActive : styles.navLink}
          >
            {link.label}
          </button>
        ))}
      </div>
      <button
        data-testid="button-toggle-mode"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={styles.themeToggle}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </nav>
  );
}
