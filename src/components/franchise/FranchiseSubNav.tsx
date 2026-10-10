import { useEffect, useRef, useState } from "react";

/** The franchise page's sections, in document order. */
const FRANCHISE_SECTIONS = [
  { id: "how-it-works", label: "How it works" },
  { id: "payouts", label: "Payouts" },
  { id: "plans", label: "Plans & fees" },
  { id: "benefits", label: "Why partner" },
  { id: "franchisee-application", label: "Apply" },
  { id: "faqs", label: "FAQs" },
] as const;

const FranchiseSubNav = () => {
  const [active, setActive] = useState<string>(FRANCHISE_SECTIONS[0].id);
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const headerPx =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;

      const rect = bar.getBoundingClientRect();
      setStuck(rect.top <= headerPx + 1);

      const line = rect.bottom + 12;
      let current: string = FRANCHISE_SECTIONS[0].id;
      for (const section of FRANCHISE_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = section.id;
      }

      // bottom of the document it wins.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = FRANCHISE_SECTIONS[FRANCHISE_SECTIONS.length - 1].id;

      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);


  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const el = list.querySelector<HTMLElement>(`[data-target="${active}"]`);
    if (!el) return;
    list.scrollTo({
      left: Math.max(0, el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2),
      behavior: "smooth",
    });
  }, [active]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div
      ref={barRef}
      className="sticky top-(--header-h) z-40 w-full border-b transition-[box-shadow,background-color] duration-300"
      style={{
        background: stuck ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(14px) saturate(1.4)",
        WebkitBackdropFilter: "blur(14px) saturate(1.4)",
        borderColor: "rgba(15,23,42,0.08)",
        boxShadow: stuck ? "0 10px 30px -22px rgba(15,23,42,0.55)" : "none",
      }}
    >
      <div className="mx-auto flex h-(--subnav-h) max-w-6xl items-center gap-3 px-6 md:px-8">
        <span className="hidden shrink-0 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400 sm:block">
          On this page
        </span>

        <ul
          ref={listRef}
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {FRANCHISE_SECTIONS.map((section) => {
            const isActive = section.id === active;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  data-target={section.id}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => go(event, section.id)}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) ${
                    isActive
                      ? "bg-(--brand-teal) text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FranchiseSubNav;
