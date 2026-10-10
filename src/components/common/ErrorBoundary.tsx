import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors anywhere below it. The site header, footer and routing
 * stay usable, and the user gets a reload action instead of a blank screen.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Technical detail goes to the console; users see the friendly panel below.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-6 py-16">
        <div
          className="max-w-md rounded-2xl p-8 text-center"
          style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
        >
          <h1 className="text-xl font-bold text-slate-800">Something went wrong on this page</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            The rest of the site still works. Reload the page to try again, or head back to the home page.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
              style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
            >
              Reload page
            </button>
            <a
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1"
            >
              Go to home page
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
