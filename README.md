# Nico Gaspar - Portfolio

A modern Next.js portfolio website featuring a scroll-based velocity hero text animation.

## Features

- ✨ Scroll-based velocity text animation
- 🎨 Beautiful gradient effects
- 📱 Fully responsive design
- ⚡ Built with Next.js 15, React 18, and TypeScript
- 🎭 Smooth animations powered by Framer Motion
- 🎯 TailwindCSS for styling

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Magic UI** - Scroll-based velocity component

## Project Structure

```
portfolio-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── scroll-based-velocity-demo.tsx
├── registry/
│   └── magicui/
│       └── scroll-based-velocity.tsx
├── lib/
│   └── utils.ts
├── package.json
└── README.md
```

## Customization

The hero text "Nico Gaspar" can be customized in `components/scroll-based-velocity-demo.tsx`. You can also adjust:
- `baseVelocity` - Controls the speed of the scroll
- `direction` - Controls the direction (1 for right, -1 for left)
- Styling classes for typography and spacing

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# portfolio
