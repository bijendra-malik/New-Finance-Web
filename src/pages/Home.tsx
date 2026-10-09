import { Suspense, lazy, useState, useEffect, useRef } from "react";
import bannerVideo from "../assets/2.mp4";
import useSEO from "../hooks/useSEO";
import LoanProducts from "../components/sections/LoanProducts";
import CreditScore from "../components/sections/CreditScore";
import ProductDetails from "../components/sections/ProductDetails";

const Partners = lazy(() => import("../components/sections/Partners"));
const Testimonials = lazy(() => import("../components/sections/Testimonials"));
const FAQ = lazy(() => import("../components/sections/FAQ"));

const SectionFallback = () => <div className="min-h-105 bg-white" />;

const Home = () => {
  useSEO({
    title: "Personal, Business & Home Loans Online",
    description:
      "Apply online for personal, business, home and 15+ other loan products with Indexia Finance. Quick eligibility check, transparent pricing and approvals within 48 hours.",
    path: "/",
  });

  const videoRef  = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);


  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.volume = 0;

    const syncState = () => {

      setIsPaused(v.paused);
    };

    v.addEventListener("play", syncState);
    v.addEventListener("pause", syncState);

    // Start playback only if the visitor has not paused the video.
    if (!isPaused && v.paused) {
      v.play().catch(() => {});
    }
    if (isPaused && !v.paused) {
      v.pause();
    }

    // Show loader until the first frame is ready to render.
    const onReady = () => setVideoReady(true);
    if (v.readyState >= 2) setVideoReady(true);
    else v.addEventListener("loadeddata", onReady, { once: true });

    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("play", syncState);
      v.removeEventListener("pause", syncState);
    };
  }, [isPaused]);

  // Sync mute state to video element
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    v.volume = next ? 0 : 0.6;
    setIsMuted(next);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPaused) {
      v.play().catch(() => {});
      // Bring audio back when resuming playback
      const unmuted = !isMuted;
      v.muted = unmuted ? false : true;
      v.volume = unmuted ? 0.6 : 0;
      setIsMuted(unmuted ? false : true);
      setIsPaused(false);
    } else {
      v.pause();
    }
  };

  return (
    <>
    <div aria-hidden style={{ height: "var(--header-h)" }} />
    {/* HERO BANNER */}
    <div
      className="hero-viewport relative w-full overflow-hidden bg-slate-950"
    >
      <style>{`
        .hero-viewport { height: calc(100vh - var(--header-h)); }
        @supports (height: 100dvh) {
          .hero-viewport { height: calc(100dvh - var(--header-h)); }
        }
      `}</style>
      {/* Video loading spinner (hidden once first frame is ready) */}
      {!videoReady && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-950"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        >
          <div
            className="w-12 h-12 rounded-full border-4 border-white/15 border-t-(--brand-teal) animate-spin"
            role="status"
          />
        </div>
      )}

      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center sm:object-fill sm:object-top"
        style={{ zIndex: 0 }}
      >
        <source src={bannerVideo} type="video/mp4" />
      </video>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.75"
        style={{ background: "linear-gradient(90deg, var(--brand-navy), var(--brand-teal), var(--brand-yellow))", zIndex: 2 }}
      />

      {/* Play / Pause + Mute / Unmute controls — bottom-right of banner */}
      <button
        onClick={togglePlay}
        aria-label={isPaused ? "Play video" : "Pause video"}
        className="absolute bottom-4 right-16 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      >
        {isPaused ? (
          /* Play icon — paused */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        ) : (
          /* Pause icon — playing */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        )}
      </button>

      {/* Mute / Unmute toggle button — bottom-right of banner */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      >
        {isMuted ? (
          /* Speaker with X — muted */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          /* Speaker with waves — unmuted */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        )}
      </button>

      <div className="absolute" style={{ left: 10, right: 10, bottom: 10, zIndex: 10 }}>
        <LoanProducts />
      </div>
    </div>

    <CreditScore />
    <ProductDetails />
    <Suspense fallback={<SectionFallback />}>
      <Partners />
      <Testimonials />
      <FAQ />
    </Suspense>
    </>
  );
};

export default Home;
