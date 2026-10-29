// A product-level taxonomy entry (e.g. "Bath & Body") — separate from the
// business-level Category/Subcategory. Lets a customer browse "all shampoo"
// pooled across every store that sells it, not just one store's catalog.
export interface ProductType {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  // A real photo for the "shop by product" grid, when one's been curated for
  // this type — falls back to a plain icon (ProductTypeIcon) when absent.
  iconUrl?: string | null;
}
