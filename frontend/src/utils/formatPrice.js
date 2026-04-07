// Format number with commas for Indian numbering system
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
