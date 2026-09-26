import { Suspense, lazy, useState, useEffect, useRef } from "react";
import bannerVideo from "../assets/2.mp4";
import bannerPoster from "../assets/bg.jpg";
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

  // Keep banner video playing continuously — prevents restart on re-render
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 0;
    v.play().catch(() => {});
    const resume = () => { v.play().catch(() => {}); };
    v.addEventListener("pause", resume);
    return () => v.removeEventListener("pause", resume);
  }, []);

  // Sync mute state to video element
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    v.volume = next ? 0 : 0.6;
    setIsMuted(next);
  };

  return (
    <>
    {/* ── HERO BANNER ── */}
    <div
      className="relative w-full overflow-hidden bg-slate-950 min-h-65 sm:min-h-87.5 md:min-h-119.25"
      style={{  marginTop: "100px" }}
    >
      {/* ── Video background — fills full banner including navbar offset area ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={bannerPoster}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center sm:object-fill sm:object-top"
        style={{ zIndex: 0 }}
      >
        <source src={bannerVideo} type="video/mp4" />
      </video>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.75"
        style={{ background: "linear-gradient(90deg, #066a9c, #26ae90, #f2f231)", zIndex: 2 }}
      />

      {/* Mute / Unmute toggle button — bottom-right of banner */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          zIndex: 4,
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#26ae90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        )}
      </button>
    </div>

    <LoanProducts />
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
