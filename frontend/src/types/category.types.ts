// ─── Category types ───────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  color?: string;
}
