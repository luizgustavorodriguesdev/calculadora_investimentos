// tailwind.config.js
module.exports = {
  content: [
    "./index.html", // Adicione esta linha se seu HTML estiver na raiz
    "./src/**/*.{js,ts,jsx,tsx,html,vue}", // Adapte para os tipos de arquivo que você usa
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};