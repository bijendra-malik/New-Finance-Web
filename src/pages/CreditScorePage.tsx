import { Link, useLocation } from "react-router-dom";
import CreditScoreGate from "../components/loan-eligibility/CreditScoreGate";
import { FORM } from "../constants/formStyles";
import { THEME as C } from "../constants/theme";
import useSEO from "../hooks/useSEO";

/** What the loan dashboard hands over when it redirects here after a submit. */
export interface CreditScorePageState {
  product?: string;
  /** Dashboard path the customer came from, for the way back. */
  from?: string;
}

const CreditScorePage = () => {
  const { state } = useLocation();
  const { product, from } = (state ?? {}) as CreditScorePageState;
  const productLabel = product?.trim();

  useSEO({
    title: "Check Your Credit Score",
    description:
      "Check your credit score against the cut-offs our lenders use, see the band it falls in, and find out what to do next. Free, instant, and it never affects your score.",
    path: "/credit-score",
  });

  return (
    <div className="min-h-screen mt-(--header-h) px-4 py-8 md:py-12" style={{ background: FORM.pageBg }}>
      <div className="mx-auto max-w-3xl">
        {from && (
          <Link
            to={from}
            className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-44) rounded"
            style={{ color: C.navy }}
          >
            <span aria-hidden="true">←</span> Back to dashboard
          </Link>
        )}

        <header className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.teal }}>
            Credit health check
          </p>
          <h1 className="mt-1 text-2xl font-extrabold md:text-3xl" style={{ color: C.dark }}>
            Check your credit score
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6" style={{ color: C.gray }}>
            {productLabel
              ? `Your ${productLabel} application is submitted. Check the score that decides how lenders see it.`
              : "Check the score that decides how lenders see your application."}
          </p>
        </header>

        <CreditScoreGate product={productLabel} />
      </div>
    </div>
  );
};

export default CreditScorePage;
