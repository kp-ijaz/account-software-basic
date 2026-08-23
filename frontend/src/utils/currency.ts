/**
 * Format amount as Indian Rupee currency
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount as INR without symbol (just the number)
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export const formatINRNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get INR symbol
 * @returns INR symbol (₹)
 */
export const getINRSymbol = (): string => '₹';
