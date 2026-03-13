# AcadêmicoPlan

Aplicativo de planejamento acadêmico para o curso de Tecnologia em ADS — Claretiano 2026.

## Como usar

```bash
npm create vite@latest academic-planner -- --template react
cd academic-planner
npm install zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

## Deploy GitHub Pages

```bash
npm install -D gh-pages
# package.json → "homepage": "https://SEU_USUARIO.github.io/academic-planner"
npm run build && npm run deploy
```

## Arquivos incluídos

- `data-structure.json` — todos os dados acadêmicos estruturados
- `app-structure.md` — arquitetura completa do app
