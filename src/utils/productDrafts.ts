const STORAGE_KEY = "ygames_product_drafts";

export interface ProductDraft {
  id: string;
  name: string;
  price: string;
  stock: string;
  description: string;
  etat: string;
  note: string;
  category: string;
  promoType: string;
  prix_promo: string;
  savedAt: string; // ISO string
}

export function getDrafts(): ProductDraft[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveDraft(draft: Omit<ProductDraft, "id" | "savedAt">): ProductDraft {
  const drafts = getDrafts();
  const newDraft: ProductDraft = {
    ...draft,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newDraft, ...drafts]));
  return newDraft;
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function clearAllDrafts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
