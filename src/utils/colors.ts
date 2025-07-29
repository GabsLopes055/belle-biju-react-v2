/**
 * 🎨 SISTEMA DE CORES BELLE BIJU
 *
 * Baseado na análise das 12 imagens da marca Belle Biju
 * Cores extraídas da identidade visual e produtos da loja
 */

// 🟣 ROXO BELLE - Cor Principal
// Representa: Elegância, feminilidade, luxo, sofisticação
export const BELLE_PRIMARY = {
  50: "#fdf4ff",
  100: "#fae8ff",
  200: "#f5d0fe",
  300: "#f0abfc",
  400: "#e879f9",
  500: "#d946ef",
  600: "#c026d3",
  700: "#a21caf",
  800: "#86198f",
  900: "#770d7c", // Cor principal da marca
  DEFAULT: "#770d7c",
};

// 🟢 VERDE-AZULADO BELLE - Cor Secundária
// Representa: Sofisticação, confiança, modernidade
export const BELLE_SECONDARY = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#138182", // Cor secundária da marca
  DEFAULT: "#138182",
};

// 🟡 DOURADO ELEGANTE - Acentos
// Representa: Luxo, destaque, valor, preciosidade
export const BELLE_GOLD = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f",
  DEFAULT: "#f59e0b",
};

// 🌸 ROSA SUAVE - Feminino
// Representa: Delicadeza, charme, feminilidade, romance
export const BELLE_PINK = {
  50: "#fdf2f8",
  100: "#fce7f3",
  200: "#fbcfe8",
  300: "#f9a8d4",
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
  700: "#be185d",
  800: "#9d174d",
  900: "#831843",
  DEFAULT: "#ec4899",
};

// 📊 CORES PARA GRÁFICOS
export const CHART_COLORS = {
  dinheiro: BELLE_SECONDARY.DEFAULT, // Verde-azulado
  pix: BELLE_PRIMARY.DEFAULT, // Roxo Belle
  debito: BELLE_GOLD.DEFAULT, // Dourado
  credito: BELLE_PINK.DEFAULT, // Rosa Belle
};

/**
 * 🎯 GUIA DE USO DAS CORES
 *
 * PRIMÁRIA (Roxo Belle #770d7c):
 * - Cabeçalhos principais
 * - Botões primários
 * - Links importantes
 * - Elementos de destaque
 *
 * SECUNDÁRIA (Verde-Azulado #138182):
 * - Elementos de apoio
 * - Informações complementares
 * - Estados de sucesso
 * - Acentos visuais
 *
 * DOURADO (#f59e0b):
 * - Preços e valores
 * - Elementos premium
 * - Destaques especiais
 * - Ícones importantes
 *
 * ROSA (#ec4899):
 * - Elementos femininos
 * - Ações secundárias
 * - Estados de atenção
 * - Decorações delicadas
 */

// Classes TailwindCSS geradas automaticamente:
export const TAILWIND_CLASSES = {
  // Backgrounds
  bgPrimary: "bg-belle-primary-900",
  bgSecondary: "bg-belle-secondary-900",
  bgGold: "bg-belle-gold-500",
  bgPink: "bg-belle-pink-500",

  // Textos
  textPrimary: "text-belle-primary-900",
  textSecondary: "text-belle-secondary-900",
  textGold: "text-belle-gold-600",
  textPink: "text-belle-pink-600",

  // Bordas
  borderPrimary: "border-belle-primary-900",
  borderSecondary: "border-belle-secondary-900",

  // Gradientes
  gradientPrimary: "from-belle-primary-600 to-belle-primary-900",
  gradientSecondary: "from-belle-secondary-400 to-belle-secondary-700",
  gradientGold: "from-belle-gold-400 to-belle-gold-600",
};

// Função helper para obter cor por nome
export const getBelleColor = (colorName: string, shade: number = 900) => {
  const colors: Record<string, any> = {
    primary: BELLE_PRIMARY,
    secondary: BELLE_SECONDARY,
    gold: BELLE_GOLD,
    pink: BELLE_PINK,
  };

  return colors[colorName]?.[shade] || colors[colorName]?.DEFAULT;
};
