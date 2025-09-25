// Utility function to convert text to URL-friendly slug
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Generate SEO-friendly ad URL with slug and ID parameter
export const generateAdUrl = (ad) => {
  if (!ad) return '/ads';
  
  const slug = createSlug(ad.title || `product-${ad.id}`);
  const adId = ad.id || ad.ad_id;
  
  return `/ads/${slug}?id=${adId}`;
};

// Generate SEO-friendly category URL with slug and ID parameter
export const generateCategoryUrl = (category) => {
  if (!category) return '/categories';
  
  const slug = createSlug(category.name || `category-${category.id}`);
  const categoryId = category.id;
  
  return `/categories/${slug}?id=${categoryId}`;
};

// Generate SEO-friendly subcategory URL with slug and ID parameter
export const generateSubcategoryUrl = (subcategory) => {
  if (!subcategory) return '/subcategories';
  
  const slug = createSlug(subcategory.name || `subcategory-${subcategory.id}`);
  const subcategoryId = subcategory.id;
  
  return `/subcategories/${slug}?id=${subcategoryId}`;
};
