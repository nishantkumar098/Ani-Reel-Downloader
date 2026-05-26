import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Lenis from "@studio-freight/lenis";

function App() {

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showNav, setShowNav] = useState(true);
  const previewRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: true,
    });

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      lastScroll = currentScroll;

    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {

      /* HERO */

      gsap.to(".hero", {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: ".heroSection",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      /* FEATURES */

      gsap.utils.toArray(".featureCard").forEach((card) => {

        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );

      });

      /* STEP CARDS */

      gsap.utils.toArray(".stepCard").forEach((card) => {

        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );

      });

      /* TESTIMONIALS */

      gsap.utils.toArray(".testimonialCard").forEach((card) => {

        gsap.fromTo(card,
          {
            opacity: 0,
            y: 80,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,

            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            }
          }
        );

      });

    });

    return () => {
      ctx.revert();
    };

  }, []);



  const handleDownload = async () => {

    if (!url) return;

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/reels/download",
        { url }
      );

      setData(response.data);

      setTimeout(() => {

        previewRef.current?.scrollIntoView({
          behavior: "smooth",
        });

      }, 300);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch reel");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="container">

      {/* BACKGROUND */}

      <div className="gradient1"></div>
      <div className="gradient2"></div>

      {/* NAVBAR */}

      <nav className={`navbar ${showNav ? "showNav" : "hideNav"}`}>

        <div className="navLinks">

          <a href="#hero">
            Home
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#steps">
            Workflow
          </a>

          <a href="#stats">
            Stats
          </a>

          <a href="#ai">
            AI Tools
          </a>

          <a href="#reviews">
            Reviews
          </a>

          <motion.a
            href="#hero"
            className="navBtn"

            whileHover={{
              scale: 1.05
            }}

            whileTap={{
              scale: 0.95
            }}
          >
            Download Reel
          </motion.a>

        </div>

      </nav>

      {/* HERO */}

      <section
        id="hero"
        className="heroSection"
      >

        <motion.div
          className="hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

          <motion.div
            className="logo"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          >
            <FaInstagram />
          </motion.div>

          <h1>
            Ani<span>Reel</span>
          </h1>

          <p>
            Download reels, extract captions and create viral content instantly.
          </p>

          <motion.div
            className="inputBox"
            whileHover={{
              scale: 1.01,
            }}
          >

            <input
              type="text"
              placeholder="Paste Instagram Reel URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.04 }}
              onClick={handleDownload}
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                "Download"
              )}
            </motion.button>

          </motion.div>

        </motion.div>

      </section>

      {/* RESULT */}

      {data && (

        <motion.section
          id="download"
          ref={previewRef}
          className="previewSection"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <motion.div
            className="card"
            whileHover={{
              y: -10,
            }}
          >

            <video
              src={data.videoUrl}
              controls
              className="video"
            ></video>

            <h2>
              {data.title}
            </h2>

            <div className="captionBox">

              <span>
                Generated Caption
              </span>

              <p>
                This reel is absolutely insane. Save this before it disappears from your feed.
              </p>

            </div>

            <motion.a
              href={data.videoUrl}
              download
              className="downloadBtn"
              whileHover={{
                scale: 1.03,
              }}
            >
              Download Reel
            </motion.a>

          </motion.div>

        </motion.section>

      )}

      {/* FEATURES */}

      <section
        id="features"
        className="features"
      >

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Powerful Creator Tools
        </motion.h2>

        <div className="featureGrid">

          <motion.div
            className="featureCard"
            whileHover={{ y: -10 }}
          >
            <h3>Lightning Fast</h3>

            <p>
              Download reels instantly with ultra-fast cloud processing and futuristic speed optimization.
            </p>
          </motion.div>

          <motion.div
            className="featureCard"
            whileHover={{ y: -10 }}
          >
            <h3>4K Downloads</h3>

            <p>
              Save reels in ultra HD quality with zero compression and premium rendering.
            </p>
          </motion.div>

          <motion.div
            className="featureCard"
            whileHover={{ y: -10 }}
          >
            <h3>AI Captions</h3>

            <p>
              Generate viral captions, hooks and hashtags instantly from uploaded reels.
            </p>
          </motion.div>

        </div>

      </section>

      {/* STEPS */}

      <section
        id="steps"
        className="steps"
      >

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          How It Works
        </motion.h2>

        <div className="stepsGrid">

          <motion.div
            className="stepCard"
            whileHover={{ y: -10 }}
          >
            <span>01</span>

            <h3>
              Paste Reel URL
            </h3>

            <p>
              Copy any Instagram reel link and paste it instantly into AniReel.
            </p>

          </motion.div>

          <motion.div
            className="stepCard"
            whileHover={{ y: -10 }}
          >
            <span>02</span>

            <h3>
              AI Processing
            </h3>

            <p>
              Our engine extracts video, metadata, captions and creator insights automatically.
            </p>

          </motion.div>

          <motion.div
            className="stepCard"
            whileHover={{ y: -10 }}
          >
            <span>03</span>

            <h3>
              Download & Create
            </h3>

            <p>
              Download reels in HD and generate social media content within seconds.
            </p>

          </motion.div>

        </div>

      </section>

      {/* STATS */}

      <section
        id="stats"
        className="stats"
      >

        <div className="stat">
          <h2>10M+</h2>
          <p>Reels Downloaded</p>
        </div>

        <div className="stat">
          <h2>250K+</h2>
          <p>Creators</p>
        </div>

        <div className="stat">
          <h2>99%</h2>
          <p>Uptime</p>
        </div>

      </section>

      {/* AI */}

      <section
        id="ai"
        className="aiSection"
      >

        <div className="aiLeft">

          <h2>
            AI Powered Content Engine
          </h2>

          <p>
            Transform reels into captions, tweets, hooks and viral marketing content automatically.
          </p>

        </div>

        <div className="aiRight">

          <div className="glassCard">

            <span>
              Viral Caption
            </span>

            <h3>
              “This tool completely changed my content workflow.”
            </h3>

          </div>

          <div className="glassCard">

            <span>
              Trending Hashtags
            </span>

            <h3>
              #viral #instagram #reels #explore
            </h3>

          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}

      <section
        id="reviews"
        className="testimonials"
      >

        <h2>
          Loved By Creators
        </h2>

        <div className="testimonialGrid">

          <div className="testimonialCard">

            <p>
              “Best reel downloader I’ve ever used.”
            </p>

            <span>
              — Content Creator
            </span>

          </div>

          <div className="testimonialCard">

            <p>
              “The UI feels insanely futuristic.”
            </p>

            <span>
              — Startup Founder
            </span>

          </div>

          <div className="testimonialCard">

            <p>
              “Downloaded 500+ reels effortlessly.”
            </p>

            <span>
              — Social Media Agency
            </span>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Start Downloading Reels Instantly
        </motion.h2>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.92,
          }}
        >
          Get Started
        </motion.button>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footerTop">

          <div>

            <h2>
              Ani<span>Reel</span>
            </h2>

            <p>
              Futuristic Instagram Reel Downloader developed by Nishant Kumar.
            </p>

          </div>

          <div className="footerMenu">

            <a href="#hero">
              Home
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#ai">
              AI Tools
            </a>

            <a href="#reviews">
              Reviews
            </a>

          </div>

        </div>

        <div className="footerBottom">

          <span>
            © 2026 AniReel. All rights reserved.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;