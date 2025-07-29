export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const formatPaymentMethod = (method: string): string => {
  const methods: Record<string, string> = {
    DINHEIRO: "Dinheiro",
    PIX: "PIX",
    DEBITO: "Cartão de Débito",
    CREDITO: "Cartão de Crédito",
  };
  return methods[method] || method;
};

export const formatUsername = (username: string): string => {
  return username.toLowerCase().trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
