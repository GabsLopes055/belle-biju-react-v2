export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 999999.99;
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= 9999;
};

export const validateProductName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateUserName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateRequired = (
  value: string | number | null | undefined
): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};
