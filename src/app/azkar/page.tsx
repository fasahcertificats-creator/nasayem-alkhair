import { getAzkarCatalog, getAzkarCategoryDefinitions } from "@/services/content";

import { AzkarOverview } from "./AzkarOverview";

export default function AzkarPage() {
  return (
    <AzkarOverview
      catalog={getAzkarCatalog()}
      categories={[...getAzkarCategoryDefinitions()]}
    />
  );
}
