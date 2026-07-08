import type { StoredAsset } from "../entities/stored-asset";

export interface StorageRepository {
  getDownloadUrl(path: string): Promise<string>;
  saveAsset(asset: StoredAsset): Promise<StoredAsset>;
}
