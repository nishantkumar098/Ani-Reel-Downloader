import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { HiLightningBolt, HiFilm, HiSparkles } from "react-icons/hi";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import Navbar from "./components/Navbar";

const FEATURES = [
  {
    icon: HiLightningBolt,
    title: "Lightning Fast",
    text: "Download reels instantly with ultra-fast cloud processing and optimized delivery.",
  },
  {
    icon: HiFilm,
    title: "HD Quality",
    text: "Save reels in crisp quality with smart format selection and zero layout shift.",
  },
  {
    icon: HiSparkles,
    title: "AI Captions",
    text: "Generate viral captions, hooks, and hashtags from your downloaded reels.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Paste Reel URL",
    text: "Copy any public Instagram reel link and paste it into AniReel.",
  },
  {
    num: "02",
    title: "Smart Processing",
    text: "Our engine extracts video, metadata, and preview data automatically.",
  },
  {
    num: "03",
    title: "Download & Create",
    text: "Preview in-browser, download in HD, and repurpose content in seconds.",
  },
];

const TESTIMONIALS = [
  { quote: "Best reel downloader I've ever used.", author: "Content Creator" },
  { quote: "The UI feels insanely futuristic.", author: "Startup Founder" },
  { quote: "Downloaded 500+ reels effortlessly.", author: "Social Media Agency" },
];

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const previewRef = useRef(null);
  const heroInputRef = useRef(null);

  const scrollToHero = useCallback(() => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => heroInputRef.current?.focus(), 400);
  }, []);

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 6000);
    return () => clearTimeout(t);
  }, [status]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      if (current > 80) {
        setShowNav(current < lastScroll);
      } else {
        setShowNav(true);
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.to(".hero__content", {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray(".reveal-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const handleDownload = async (e) => {
    e?.preventDefault();
    if (!url.trim()) {
      setStatus({ type: "error", message: "Please paste an Instagram reel URL." });
      return;
    }

    const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

    try {
      setLoading(true);
      setStatus(null);
      setData(null);

      const response = await axios.post(
        `${apiBase}/api/reels/download`,
        { url: url.trim() },
        { timeout: 120000 }
      );

      setData(response.data);
      setStatus({ type: "success", message: "Reel ready — scroll down to preview." });

      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    } catch (error) {
      const isNetwork =
        !error.response &&
        (error.code === "ERR_NETWORK" || error.message === "Network Error");

      setStatus({
        type: "error",
        message: isNetwork
          ? "Cannot reach the API. Check your connection or redeploy settings."
          : error.response?.data?.message || "Failed to fetch reel. Try another URL.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <a href="#hero" className="skip-link">
        Skip to main content
      </a>

      <div className="app__bg" aria-hidden="true">
        <div className="app__gradient app__gradient--1" />
        <div className="app__gradient app__gradient--2" />
        <div className="app__grid" />
        <div className="app__mesh" />
      </div>

      <Navbar showNav={showNav} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <AnimatePresence>
        {status && (
          <motion.div
            role="alert"
            className={`toast toast--${status.type}`}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="toast__dot" aria-hidden="true" />
            {status.message}
            <button
              type="button"
              className="toast__dismiss"
              aria-label="Dismiss notification"
              onClick={() => setStatus(null)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="hero" className="hero">
          <div className="hero__content">
            <motion.div
              className="hero__badge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="hero__badge-dot" />
              Premium Instagram Reel Downloader
            </motion.div>

            <motion.div
              className="hero__logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              aria-hidden="true"
            >
              <FaInstagram />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Ani<span>Reel</span>
            </motion.h1>

            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Download reels, extract captions, and create viral content — beautifully on any device.
            </motion.p>

            <motion.form
              className="hero__form glass-panel"
              onSubmit={handleDownload}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="reel-url" className="sr-only">
                Instagram Reel URL
              </label>
              <input
                ref={heroInputRef}
                id="reel-url"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="Paste Instagram Reel URL…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <motion.button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
              >
                {loading ? (
                  <>
                    <span className="loader" aria-hidden="true" />
                    <span>Processing…</span>
                  </>
                ) : (
                  "Download"
                )}
              </motion.button>
            </motion.form>

            <p className="hero__hint">Works with public reels · No login required</p>
          </div>
        </section>

        <AnimatePresence>
          {data && (
            <motion.section
              id="download"
              ref={previewRef}
              className="preview section"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              aria-live="polite"
            >
              <div className="section__inner">
                <header className="section__header">
                  <p className="section__eyebrow">Your download</p>
                  <h2 className="section__title">Preview ready</h2>
                </header>

                <motion.article
                  className="preview__card glass-panel reveal-card"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="preview__video-wrap">
                    <video
                      src={data.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="preview__video"
                      poster={data.thumbnail}
                    />
                  </div>

                  <h3 className="preview__title">{data.title}</h3>

                  <div className="preview__caption glass-panel--nested">
                    <span className="preview__caption-label">Suggested caption</span>
                    <p>
                      This reel is absolutely insane. Save this before it disappears from your feed.
                    </p>
                  </div>

                  <motion.a
                    href={data.videoUrl}
                    download
                    className="btn btn--secondary btn--block"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Reel
                  </motion.a>
                </motion.article>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section id="features" className="section">
          <div className="section__inner">
            <header className="section__header section__header--center">
              <p className="section__eyebrow">Capabilities</p>
              <h2 className="section__title">Powerful creator tools</h2>
              <p className="section__desc">
                Everything you need to capture, preview, and repurpose Instagram reels at scale.
              </p>
            </header>

            <div className="grid grid--features">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <motion.article
                  key={title}
                  className="card reveal-card"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="card__icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="steps" className="section section--alt">
          <div className="section__inner">
            <header className="section__header section__header--center">
              <p className="section__eyebrow">Workflow</p>
              <h2 className="section__title">How it works</h2>
            </header>

            <div className="grid grid--steps">
              {STEPS.map(({ num, title, text }) => (
                <motion.article
                  key={num}
                  className="card card--step reveal-card"
                  whileHover={{ y: -8 }}
                >
                  <span className="card__step-num">{num}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="stats" className="section">
          <div className="section__inner">
            <div className="grid grid--stats">
              {[
                { value: "10M+", label: "Reels downloaded" },
                { value: "250K+", label: "Creators" },
                { value: "99%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="stat reveal-card">
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai" className="section section--alt">
          <div className="section__inner section__inner--split">
            <div className="section__copy">
              <p className="section__eyebrow">AI engine</p>
              <h2 className="section__title">AI-powered content studio</h2>
              <p className="section__desc">
                Transform reels into captions, tweets, hooks, and viral marketing copy automatically.
              </p>
            </div>

            <div className="grid grid--ai">
              <div className="glass-card reveal-card">
                <span className="glass-card__label">Viral caption</span>
                <p className="glass-card__quote">
                  &ldquo;This tool completely changed my content workflow.&rdquo;
                </p>
              </div>
              <div className="glass-card reveal-card">
                <span className="glass-card__label">Trending hashtags</span>
                <p className="glass-card__quote">#viral #instagram #reels #explore</p>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="section">
          <div className="section__inner">
            <header className="section__header section__header--center">
              <p className="section__eyebrow">Testimonials</p>
              <h2 className="section__title">Loved by creators</h2>
            </header>

            <div className="grid grid--testimonials">
              {TESTIMONIALS.map(({ quote, author }) => (
                <blockquote key={author} className="card card--quote reveal-card">
                  <p>&ldquo;{quote}&rdquo;</p>
                  <footer>— {author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="section__inner cta__inner glass-panel">
            <h2 className="section__title">Start downloading reels instantly</h2>
            <p className="section__desc">
              Join thousands of creators using AniReel on mobile, desktop, and TV browsers.
            </p>
            <motion.button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={scrollToHero}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Get started
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <h2>
              Ani<span>Reel</span>
            </h2>
            <p>Futuristic Instagram Reel Downloader by Nishant Kumar.</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#ai">AI Tools</a>
            <a href="#reviews">Reviews</a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} AniReel. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
