import { useParams } from "react-router-dom";
import DocPageLayout from "./DocPageLayout";
import { DOCUMENT_PAGES } from "./documentPages";
import NotFoundPage from "../NotFoundPage";

const RequiredDocumentDetailPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const page = DOCUMENT_PAGES[slug];

  if (!page) return <NotFoundPage />;

  return (
    <DocPageLayout
      loanName={page.loanName}
      breadcrumb={page.breadcrumb}
      bannerBg={page.bannerBg}
      sections={page.sections}
      applySlug={slug}
    />
  );
};

export default RequiredDocumentDetailPage;
