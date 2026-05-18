# Seamless Pattern Generator

A web app that transforms any image into a seamless, tileable pattern using offset-based blending. Perfect for creating backgrounds, textures, and wallpapers.

## Features

- **Image Upload**: Drag-and-drop or click to upload any image
- **Offset Control**: Fine-tune X and Y offsets to control the blending and seam positions
- **Live Preview**: See your pattern in real-time
- **Tiled View**: Visualize how your pattern tiles when repeated
- **Download**: Export your seamless pattern as PNG

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will open at `http://localhost:5173`

## How It Works

The seamless pattern generator uses an offset-based algorithm that:

1. Takes your uploaded image
2. Shifts it horizontally and vertically by the specified offsets
3. Blends the seams using a cross-dissolve technique
4. Returns a seamless pattern that tiles perfectly

Adjust the **X Offset** and **Y Offset** sliders to find the sweet spot where seams blend naturally.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run preview` - Preview production build
