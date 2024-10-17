export const buildParameters = (obj?: Record<string, string | number>) => {
  if (!obj) {
    return;
  }
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};
