import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#steps", label: "Workflow" },
  { href: "#stats", label: "Stats" },
  { href: "#ai", label: "AI Tools" },
  { href: "#reviews", label: "Reviews" },
];

export default function Navbar({ showNav, menuOpen, setMenuOpen }) {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`navbar ${showNav ? "navbar--visible" : "navbar--hidden"}`}
        role="banner"
      >
        <div className="navbar__inner">
          <a href="#hero" className="navbar__brand" onClick={closeMenu}>
            Ani<span>Reel</span>
          </a>

          <nav className="navbar__desktop" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="navbar__link">
                {link.label}
              </a>
            ))}
            <motion.a
              href="#hero"
              className="navbar__cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Download Reel
            </motion.a>
          </nav>

          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="nav-overlay"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />
            <motion.nav
              id="mobile-menu"
              className="nav-drawer"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              <div className="nav-drawer__header">
                <span className="nav-drawer__title">Menu</span>
                <button
                  type="button"
                  className="nav-drawer__close"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <HiX size={24} />
                </button>
              </div>
              <ul className="nav-drawer__links">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a href={link.href} onClick={closeMenu}>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a href="#hero" className="nav-drawer__cta" onClick={closeMenu}>
                Download Reel
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
