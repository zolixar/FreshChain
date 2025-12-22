# FreshChain React - Food Traceability DApp

A modern React application built with TypeScript, Vite, Tailwind CSS, and shadcn/ui for blockchain-based food supply chain traceability.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Beautiful UI**: shadcn/ui components with custom theming (Green #4a7c2f & Gold #ffd700)
- **Blockchain Integration**: ethers.js v5 for smart contract interaction
- **Product Gallery**: Discovery-style interface for browsing available products
- **Batch Tracking**: Detailed tracking history with sensor data visualization
- **QR Code Generation**: Share product information via QR codes
- **Hash-based Routing**: Support for deep linking to specific batches
- **Wallet Integration**: MetaMask connection with role-based access

## 📁 Project Structure

```
freshchain-react/
├── src/
│   ├── components/
│   │   ├── customer/
│   │   │   ├── ProductGallery.tsx    # Product cards grid view
│   │   │   └── BatchHistory.tsx      # Detailed batch tracking
│   │   ├── layout/
│   │   │   ├── Header.tsx            # App header with wallet connection
│   │   │   └── Sidebar.tsx           # Role selector sidebar
│   │   └── ui/                       # shadcn/ui components
│   ├── config/
│   │   └── contract.ts               # Smart contract ABI and address
│   ├── hooks/
│   │   └── useWeb3.ts                # Web3 connection hook
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   └── App.tsx                       # Main app component
└── package.json
```

## 🛠️ Installation

```bash
cd freshchain-react
npm install
```

## 🚦 Development

```bash
npm run dev
```

Visit http://localhost:5173

## 📦 Build

```bash
npm run build
```

## 🔗 Smart Contract

Update the contract address in `src/config/contract.ts`:
```typescript
export const CONTRACT_ADDRESS = "0xYourContractAddress";
```

## 🎯 Key Features

✅ Product Gallery with responsive cards
✅ Batch tracking with detailed history
✅ QR code generation for product sharing
✅ Hash-based routing (#/batch/1)
✅ MetaMask wallet integration
✅ Role-based access control
✅ Sensor data visualization
✅ Modern UI with Tailwind CSS and shadcn/ui

## 🧩 Technologies

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- ethers.js v5
- React Router
- QRCode library
- Lucide Icons

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
