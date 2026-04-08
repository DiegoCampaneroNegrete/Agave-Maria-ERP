// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "next/core-web-vitals",          // Configuración base de Next.js
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas de TypeScript
    "eslint:recommended",            // Buenas prácticas generales
    "prettier"                       // Para evitar conflictos con Prettier
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // 🔧 Ajusta esta regla según lo que quieras
    "@typescript-eslint/no-explicit-any": "warn", // Permite 'any' pero muestra una advertencia

    // Ejemplos de otras reglas útiles
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react-hooks/exhaustive-deps": "warn"
  }
};
