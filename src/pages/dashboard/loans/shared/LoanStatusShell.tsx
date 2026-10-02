import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { THEME as C } from "../../../../constants/theme";
import { FORM } from "../../../../constants/formStyles";
import { sanitizeApplicationList } from "../../../../api/loanApplications/validate";

interface AppLike {
  _id: string;
  createdAt: string;
  mobile: string;
  email: string;
}

const LoanStatusShell = <T extends AppLike>({
  isSubmitted,
  submittedApp,
  emptyMessage = "Submit your loan application to track its status here.",
  fetcher,
  renderApp,
}: {
  applicationId?: string;
  isSubmitted: boolean;
  submittedApp?: T | null;
  emptyMessage?: string;
  /** Product fetcher, e.g. fetchWorkingCapitalApplications (module-level import — stable reference). */
  fetcher?: () => Promise<{ success: boolean; data: T[] }>;
  /** Renders the detail cards for the application being shown. */
  renderApp?: (app: T) => ReactNode;
}) => {
  const [persisted, setPersisted] = useState<T | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [fetched, setFetched] = useState(false);

  const showInSession = isSubmitted && !!submittedApp;
  const needFetch = !showInSession && !!fetcher && !!renderApp;
  const isFetching = needFetch && !fetched;

  useEffect(() => {
    if (!needFetch || fetched) return;
    let alive = true;
    fetcher!()
      .then(res => {
        if (!alive) return;
        // Runtime-validate against the API format; drop malformed records.
        const { valid } = sanitizeApplicationList<T>(res?.data);
        const newest = valid.length
          ? [...valid].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
          : null;
        setPersisted(newest);
        setFetched(true);
      })
      .catch(() => {
        if (!alive) return;
        setLoadError(true);
        setFetched(true);
      });
    return () => { alive = false; };
    // fetcher is a stable module-level import; `fetched` guards a single attempt.
  }, [needFetch, fetched, fetcher]);

  const displayed = showInSession ? submittedApp! : persisted;

  if (!displayed) {
    if (isFetching) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ background: C.navy14 }}>⏳</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: C.dark }}>Loading…</h3>
          <p className="text-sm" style={{ color: C.gray }}>Fetching your submitted applications</p>
        </div>
      );
    }
    if (loadError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ background: FORM.errorBg }}>⚠️</div>
          <h3 className="text-lg font-bold mb-2" style={{ color: C.dark }}>Couldn't load your applications</h3>
          <p className="text-sm" style={{ color: C.gray }}>Please refresh the page to try again.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: C.navy14 }}>📊</div>
        <h3 className="text-lg font-bold mb-2" style={{ color: C.dark }}>No Application Yet</h3>
        <p className="text-sm" style={{ color: C.gray }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Application ID banner ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.teal33}` }}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${C.teal},${C.navy})` }} />
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: C.teal14, border: `1.5px solid ${C.teal33}` }}>✅</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.gray }}>Application Submitted</p>
              <p className="text-base font-extrabold" style={{ color: C.dark }}>
                ID: <span style={{ color: C.teal }}>{displayed._id.slice(-10).toUpperCase()}</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.gray }}>
                {displayed.createdAt
                  ? new Date(displayed.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                  : "—"}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: C.teal14, color: C.teal, border: `1px solid ${C.teal44}` }}>
            Submitted
          </span>
        </div>
      </div>

      {/* ── Product detail cards ── */}
      {renderApp?.(displayed)}
    </div>
  );
};

/** Card frame used for every detail section (loan details, applicant, …). */
export const StatusCard = ({ title, accent, children }: {
  title: string;
  accent: string;
  children: ReactNode;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${accent}18` }}>
    <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: accent }}>{title}</p>
    {children}
  </div>
);

export default LoanStatusShell;
