import type { AuthUser } from "../entities/auth-user";

export interface AuthRepository {
  getCurrentUser(): Promise<AuthUser | null>;
  signOut(): Promise<void>;
}
