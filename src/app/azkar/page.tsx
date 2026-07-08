import dynamic from "next/dynamic";

import { PageLoadingState } from "../PageLoadingState";

const AzkarPageContent = dynamic(() => import("./AzkarPageContent"), {
  loading: () => <PageLoadingState label="Loading azkar" />
});

export default function AzkarPage() {
  return <AzkarPageContent />;
}
