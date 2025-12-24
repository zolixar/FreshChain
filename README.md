# 🥬 FreshChain

> **Decentralized Supply Chain Management for Perishable Goods**

![License](https://img.shields.io/badge/license-MIT-green)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-363636?logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

FreshChain is a blockchain-based application designed to track the lifecycle of agricultural products from farm to table. By leveraging Ethereum smart contracts and IoT sensor data, it ensures transparency, quality control, and trust between producers, transporters, distributors, and retailers.

---

## 🚀 Key Features

*   **Immutable History**: Every step of the product's journey is recorded on the Ethereum blockchain.
*   **Role-Based Access**: Strict permissions for Producers, Transporters, Distributors, and Retailers.
*   **IoT Integration**: Real-time tracking of temperature and humidity to ensure product freshness.
*   **QR Code Digital Twin**: Consumers can scan physical products to view their entire digital history.
*   **Guest Mode**: Frictionless public access for consumers without needing a crypto wallet.

---

## 🛠️ Tech Stack

*   **Blockchain**: Ethereum (Solidity Smart Contracts)
*   **Frontend**: React, Vite, TypeScript, Tailwind CSS
*   **Web3**: Ethers.js
*   **State Management**: React Context API

---

## ⚙️ How It Works

The system operates as a strict state machine to ensure data integrity.

### 1. The Lifecycle
The journey of a product batch follows a linear path:

1.  **🌱 Production**: A **Producer** creates a batch (e.g., "Organic Apples") on the blockchain.
2.  **🚚 Transport**: Ownership transfers to a **Transporter**. During transit, sensor data (Temperature/Humidity) is recorded.
    *   *Safety Check:* The contract rejects data if conditions are unsafe (e.g., temp > 40°C).
3.  **🏭 Distribution**: The batch is handed off to a **Distributor** for warehousing.
4.  **🏪 Retail**: Finally, it reaches the **Retailer**, who marks the batch as "Arrived" and performs a quality inspection.

### 2. Roles & Permissions

| Role | Responsibility |
| :--- | :--- |
| **Producer** | Initiates the supply chain by creating batches. |
| **Transporter** | Moves goods and logs environmental data. |
| **Distributor** | Manages intermediate storage and transfer. |
| **Retailer** | Finalizes the chain and sells to the consumer. |
| **Consumer** | Scans QR codes to verify product origin and quality. |

### 3. Data Architecture

*   **Batch Data**: Stores ID, Name, Quantity, and current Owner.
*   **Sensor Data**: A history of environmental snapshots (Temp, Humidity, Location, Timestamp).
*   **Smart Contract**: Acts as the single source of truth, preventing tampering or unauthorized transfers.

---

## 📦 Getting Started

### Prerequisites
*   Node.js & npm
*   MetaMask Wallet

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/FreshChain.git
    cd FreshChain
    ```

2.  **Install Dependencies**
    ```bash
    cd freshchain-react
    npm install
    ```

3.  **Run the Application**
    ```bash
    npm run dev
    ```

---