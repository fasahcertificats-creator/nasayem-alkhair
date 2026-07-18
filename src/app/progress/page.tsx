import { permanentRedirect } from "next/navigation";

import { ROUTES } from "@/constants/routes.constants";

export default function ProgressPage() {
  permanentRedirect(ROUTES.umrah);
}
