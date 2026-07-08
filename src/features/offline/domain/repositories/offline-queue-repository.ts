import type { SyncOperation } from "../entities/sync-operation";

export interface OfflineQueueRepository {
  enqueue(operation: SyncOperation): Promise<void>;
  listPending(): Promise<SyncOperation[]>;
}
