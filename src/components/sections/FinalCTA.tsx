// FinalCTA — Premium conversion section with floating background elements and trust indicators
import { useEffect, useRef, useState } from "react";

// ── Floating background shapes component ──
const FloatingShapes = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system
    interface Particle {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
    }

    const particles: Particle[] = [];

    // Create particles
    const createParticles = () => {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 60 + 20,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: ["#0891b2", "#059669", "#7c3aed", "#06b6d4"][
            Math.floor(Math.random() * 4)
          ],
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x - p.r < 0 || p.x + p.r > canvas.width) p.vx *= -1;
        if (p.y - p.r < 0 || p.y + p.r > canvas.height) p.vy *= -1;

        // Draw circle with gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, p.color + "30");
        gradient.addColorStop(1, p.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = p.color + "15";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
};

// ── Trust badge component ──
const TrustBadge = ({
  icon,
  text,
}: {
  icon: string;
  text: string;
  color: string;
}) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 hover:border-white/60 transition-all duration-300">
    <span className="text-xl">{icon}</span>
    <span className="text-sm font-semibold text-slate-700">{text}</span>
  </div>
);

const FinalCTA = () => {
  const [buttonHovered, setButtonHovered] = useState<"primary" | "secondary" | null>(null);

  return (
    <section className="relative w-full min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-cyan-900 py-20 md:py-32 px-4 md:px-6 overflow-hidden flex items-center justify-center">
      {/* Animated background canvas */}
      <FloatingShapes />

      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-slate-900/40 pointer-events-none" />

      {/* Radial glow effects */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Main heading */}
        <div className="mb-8 animate-fadeInDown">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Ready to{" "}
            <span className="bg-linear-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
              Achieve
            </span>{" "}
            Your Dreams?
          </h2>
          <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            Get a loan that's designed for you. Fast approval, flexible terms, and transparent pricing.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp">
          {/* Primary button */}
          <button
            onMouseEnter={() => setButtonHovered("primary")}
            onMouseLeave={() => setButtonHovered(null)}
            className="px-8 md:px-12 py-4 rounded-full font-bold text-white text-base md:text-lg transition-all duration-300 relative group overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00d9ff, #0891b2)",
              boxShadow:
                buttonHovered === "primary"
                  ? "0 20px 60px rgba(8, 145, 178, 0.6), inset 0 1px 1px rgba(255,255,255,0.3)"
                  : "0 10px 30px rgba(8, 145, 178, 0.3)",
              transform:
                buttonHovered === "primary"
                  ? "scale(1.05) translateY(-3px)"
                  : "scale(1) translateY(0)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🚀 Apply Now
            </span>
          </button>

          {/* Secondary button */}
          <button
            onMouseEnter={() => setButtonHovered("secondary")}
            onMouseLeave={() => setButtonHovered(null)}
            className="px-8 md:px-12 py-4 rounded-full font-bold text-cyan-300 text-base md:text-lg transition-all duration-300 border-2 border-cyan-400/60 hover:border-cyan-300"
            style={{
              background:
                buttonHovered === "secondary"
                  ? "rgba(6, 182, 212, 0.15)"
                  : "rgba(255, 255, 255, 0.05)",
              transform:
                buttonHovered === "secondary"
                  ? "scale(1.05) translateY(-3px)"
                  : "scale(1) translateY(0)",
              boxShadow:
                buttonHovered === "secondary"
                  ? "0 0 30px rgba(6, 182, 212, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)"
                  : "0 0 20px rgba(6, 182, 212, 0.2)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              ✓ Check Eligibility
            </span>
          </button>
        </div>

        {/* Benefits row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          {[
            { icon: "🔒", text: "100% Secure" },
            { icon: "🏦", text: "Trusted Banks" },
            { icon: "⚡", text: "Fast Processing" },
            { icon: "📱", text: "Paperless" },
          ].map((benefit, i) => (
            <TrustBadge
              key={i}
              icon={benefit.icon}
              text={benefit.text}
              color="cyan"
            />
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-12 pt-8 border-t border-white/10 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <p className="text-slate-300 text-sm mb-4">
            Trusted by industry leaders and regulatory bodies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "RBI Compliant", badge: "✓" },
              { label: "ISO 27001 Certified", badge: "✓" },
              { label: "GDPR Compliant", badge: "✓" },
              { label: "4.8★ Rating", badge: "⭐" },
            ].map((cert, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-slate-300 text-sm">
                  {cert.badge} {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Happy family illustration placeholder */}
        <div className="mt-16 mb-8">
          <div className="w-full max-w-md mx-auto h-32 rounded-2xl bg-linear-to-r from-cyan-400/10 to-emerald-400/10 border border-cyan-400/20 flex items-center justify-center overflow-hidden group cursor-pointer">
            <div className="text-6xl opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              👨‍👩‍👧‍👦
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-slate-400 text-sm">
          Join thousands of happy families achieving their financial goals.{" "}
          <span className="text-cyan-300 font-semibold">Start your journey today!</span>
        </p>
      </div>

      {/* Floating cards background effect (optional) */}
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-2xl blur-2xl" />
      <div className="absolute top-1/3 right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
