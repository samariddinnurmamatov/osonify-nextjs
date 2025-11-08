/**
 * Query Builder Utility
 * Optimized URLSearchParams helper
 * Filters null/undefined values and builds query string
 * Supports arrays, booleans, and other types
 */
export function buildQuery(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(
    ([_, value]) => value != null && value !== ""
  );
  
  if (entries.length === 0) {
    return "";
  }
  
  return "?" + new URLSearchParams(
    entries.map(([k, v]) => {
      // Handle arrays
      if (Array.isArray(v)) {
        return [k, v.join(",")];
      }
      // Handle booleans
      if (typeof v === "boolean") {
        return [k, String(v)];
      }
      // Handle other types
      return [k, String(v)];
    })
  ).toString();
}
