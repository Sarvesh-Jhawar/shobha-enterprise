# Shobha Enterprises

A modern e-commerce platform built for efficient product browsing, management, and seamless customer interaction.

## 🚀 Features

- **Product Catalog**: Dynamic product listings with category filtering.
- **Detailed Product Views**: Individual pages for each product with detailed descriptions and images.
- **Cart Management**: Real-time shopping cart for customers.
- **WhatsApp Checkout**: Direct checkout path via WhatsApp for easy order placement and communication.
- **Admin Dashboard**: Comprehensive management interface for products and categories.
- **Dark/Light Mode**: Full theme customization support.
- **Toast Notifications**: Interactive user feedback for actions like adding to cart or login.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Styling**: Vanilla CSS

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

## 📄 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Run ESLint to check for code quality.
- `npm run preview`: Preview the production build locally.