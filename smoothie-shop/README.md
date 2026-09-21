# Smoothie Shop

A React smoothie shop with a product catalog, product details, cart, checkout form, authentication modal, chatbot, About page, and responsive styling.

## Features

- Hero image slideshow with manual controls and smooth product-section scrolling
- Product catalog with four cards per row on desktop
- Product detail pages with add-to-cart flow and previous/next navigation
- Login modal for protected cart actions
- Cart quantity controls, removal, totals, and an empty-cart state
- Checkout form validation using React Hook Form and Zod
- Floating customer-support chatbot
- Responsive layout with a shared smoothie-inspired color palette

## Requirements

- Node.js 22 or newer
- npm

## Getting Started

Install dependencies:

````bash
Start the development server:

```bash
Then open the local URL shown by Vite.

## Available Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
## Project Structure

```text
src/
	components/       Reusable navbar, footer, chatbot, and login modal
	context/          Authentication and cart state
	data/             Product and chatbot data
	pages/            Home, About, Cart, Checkout, and product details
	assets/           Smoothie and profile images
## GitHub Pages

The project is configured for the repository:
`https://github.com/Mustafa078/Smothie-SHop`

Deployment runs automatically through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) whenever changes are pushed to `main`.
Before the first deployment, enable GitHub Pages in the repository settings:

1. Open **Settings** → **Pages**.
The deployed site is available at:

`https://mustafa078.github.io/Smothie-SHop/`

The Vite base path and React Router basename are already configured for this URL. The deployment workflow also creates a `404.html` fallback so direct page refreshes continue to work.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
````
