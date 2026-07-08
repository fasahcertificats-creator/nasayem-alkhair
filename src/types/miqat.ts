import type { EntityId } from "./common";

export interface Miqat {
  id: EntityId;
  nameAr: string;
  nameEn: string;
  description: string;
  region: string;
  rules: string[];
}
