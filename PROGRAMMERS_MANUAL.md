# 👨‍💻 Programmer's Manual: FreshChain

This document serves as a technical guide for developers working on the FreshChain codebase. It covers the architecture, setup, and common development workflows.

## 1. Development Environment Setup

### Prerequisites
*   **Node.js**: v16.0.0 or higher
*   **npm**: v7.0.0 or higher
*   **Git**: For version control
*   **MetaMask**: Browser extension for Web3 interaction
*   **VS Code**: Recommended IDE with "Solidity" and "ESLint" extensions

### Initial Setup
1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd FreshChain
    ```

2.  **Install Dependencies**
    The project uses a root `package.json` to manage scripts, but dependencies are located in `freshchain-react`.
    ```bash
    npm run install:all
    # OR manually:
    cd freshchain-react && npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    This will start the Vite server at `http://localhost:5173`.

---

## 2. Project Architecture

The project follows a simple structure separating the blockchain logic from the frontend interface.

```
FreshChain/
├── contracts/              # Solidity Smart Contracts
│   └── FreshChain.sol      # Main supply chain logic
├── freshchain-react/       # Frontend Application (Vite + React)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── customer/   # Public-facing views (Gallery, History)
│   │   │   ├── layout/     # Layout components (Navbar)
│   │   │   ├── pages/      # Route pages (Dashboard, Login)
│   │   │   └── ui/         # Reusable UI components (shadcn/ui)
│   │   ├── config/         # App Configuration
│   │   ├── contexts/       # React Contexts (Web3 State)
│   │   ├── lib/            # Utilities (Tailwind helpers)
│   │   └── types/          # TypeScript Interfaces
│   └── ...config files     # Vite, Tailwind, TS configs
└── package.json            # Root scripts
```

---

## 3. Smart Contract Development

**Location:** `contracts/FreshChain.sol`

The smart contract is written in Solidity ^0.8.0. It manages the state of batches and user roles.

### Key Data Structures
*   **`Batch`**: The core entity. Contains `batchId`, `productName`, `quantity`, `currentOwner`, and status flags.
*   **`SensorData`**: Struct for IoT readings (`temperature`, `humidity`, `location`).

### Deployment Workflow
*Note: This project currently does not include a hardhat/truffle configuration. Deployment is manual.*

1.  Open `contracts/FreshChain.sol` in [Remix IDE](https://remix.ethereum.org/).
2.  Compile the contract.
3.  Deploy to your target network (Localhost, Sepolia, etc.).
4.  **Post-Deployment Update**:
    *   Copy the **Contract Address**.
    *   Copy the **ABI** (Application Binary Interface).
    *   Update `freshchain-react/src/config/contract.ts` with these new values.

---

## 4. Frontend Development

**Location:** `freshchain-react/`

The frontend is a Single Page Application (SPA) built with React 18 and Vite.

### Core Technologies
*   **Framework**: React + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS + shadcn/ui (component library)
*   **Blockchain Interaction**: Ethers.js v5

### State Management: `Web3Context`
Located in `src/contexts/Web3Context.tsx`. This context is the heart of the application.

*   **`connect()`**: Connects to MetaMask (Browser Provider). Used for write operations.
*   **`connectGuest()`**: Connects to a read-only JSON-RPC provider. Used for public viewing.
*   **`userRoles`**: Stores boolean flags (`isProducer`, `isTransporter`, etc.) derived from the contract.

### Routing
Located in `src/App.tsx`.
*   **Protected Routes**: `/dashboard` (Requires wallet connection).
*   **Public Routes**: `/products`, `/batch/:id` (Accessible via Guest mode).

### Component Library
The project uses `shadcn/ui` for consistent design. Components are located in `src/components/ui`.
*   **Modifying UI**: Do not edit files in `ui/` directly if possible. Use `className` props to override styles via Tailwind.

---

## 5. Common Development Tasks

### Adding a New Role
1.  **Smart Contract**:
    *   Add `mapping(address => bool) public isNewRole;` in `FreshChain.sol`.
    *   Add `registerNewRole` function.
    *   Add `modifier onlyNewRole`.
2.  **Frontend**:
    *   Update `UserRoles` interface in `src/types/index.ts`.
    *   Update `checkRoles` function in `Web3Context.tsx` to query the new mapping.
    *   Update `DashboardPage.tsx` to show relevant UI for the new role.

### Adding a New Sensor Metric
1.  **Smart Contract**:
    *   Update `SensorData` struct in `FreshChain.sol`.
    *   Update `addSensorData` function arguments and event.
2.  **Frontend**:
    *   Update `SensorData` interface in `src/types/index.ts`.
    *   Update `BatchHistory.tsx` to display the new metric in the timeline.

### Updating Contract Configuration
If you redeploy the contract, you **must** update the frontend configuration:
File: `src/config/contract.ts`
```typescript
export const CONTRACT_ADDRESS = "0x..."; // New Address
export const CONTRACT_ABI = [ ... ];     // New ABI
```

---

## 6. Troubleshooting

### "Call exception" or "execution reverted"
*   **Cause**: Usually means a `require` statement in Solidity failed.
*   **Fix**: Check if the user has the correct role (Producer/Transporter) and is the `currentOwner` of the batch.

### "MetaMask not detected"
*   **Cause**: Browser extension not installed or not active.
*   **Fix**: Ensure MetaMask is installed. If using a mobile browser, use the MetaMask app's built-in browser.

### "Guest Mode" not working
*   **Cause**: RPC URL issues.
*   **Fix**: Check `connectGuest` in `Web3Context.tsx`. Ensure the fallback RPC provider is reachable (default is often a public gateway or localhost).
