import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import type { UserRoles } from '../types';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  account: string | null;
  isConnected: boolean;
  isGuest: boolean;
  userRoles: UserRoles;
  connect: () => Promise<string | undefined>;
  connectGuest: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRoles>({
    isOwner: false,
    isProducer: false,
    isTransporter: false,
    isDistributor: false,
    isRetailer: false,
  });

  const checkRoles = useCallback(async (contractInstance: ethers.Contract, accountAddress: string) => {
    try {
      const owner = await contractInstance.owner();
      const isOwner = owner.toLowerCase() === accountAddress.toLowerCase();
      const isProducer = await contractInstance.isProducer(accountAddress);
      const isTransporter = await contractInstance.isTransporter(accountAddress);
      const isDistributor = await contractInstance.isDistributor(accountAddress);
      const isRetailer = await contractInstance.isRetailer(accountAddress);

      setUserRoles({
        isOwner,
        isProducer,
        isTransporter,
        isDistributor,
        isRetailer,
      });
    } catch (error) {
      console.error('Error checking roles:', error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask! 🦊');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setAccount(address);
      setIsConnected(true);

      await checkRoles(contractInstance, address);

      return address;
    } catch (error) {
      console.error('Error connecting:', error);
      throw error;
    }
  }, [checkRoles]);

  const connectGuest = useCallback(async () => {
    console.log("=== GUEST CONNECTION DEBUG START ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Environment VITE_RPC_URL:", import.meta.env.VITE_RPC_URL);
    console.log("Current hostname:", window.location.hostname);
    
    try {
      console.log("Step 1: Connecting as guest...");
      
      // Use environment variable or try multiple CORS-friendly Sepolia RPCs
      const defaultRpcs = [
        "https://eth-sepolia.g.alchemy.com/v2/demo",
        "https://ethereum-sepolia.publicnode.com",
        "https://rpc2.sepolia.org",
        "https://sepolia.gateway.tenderly.co"
      ];
      
      console.log("Step 2: Default RPCs list:", defaultRpcs);
      
      let web3Provider: ethers.providers.JsonRpcProvider | null = null;
      
      // If environment RPC is set, try it first
      if (import.meta.env.VITE_RPC_URL) {
        try {
          console.log("Step 3a: Trying environment RPC URL:", import.meta.env.VITE_RPC_URL);
          const tempProvider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
          console.log("Step 3b: Provider created, testing connection...");
          const blockNumber = await tempProvider.getBlockNumber();
          console.log("Step 3c: Connection successful! Block number:", blockNumber);
          web3Provider = tempProvider;
          console.log("Step 3d: Using environment RPC");
        } catch (e) {
          console.error("Step 3e: Environment RPC failed:", e);
          console.error("Error details:", {
            name: e instanceof Error ? e.name : 'Unknown',
            message: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : undefined
          });
        }
      } else {
        console.log("Step 3: No environment RPC set, will try defaults");
      }
      
      // If env RPC failed or not set, try the default RPCs
      if (!web3Provider) {
        console.log("Step 4: Trying default RPCs...");
        for (let i = 0; i < defaultRpcs.length; i++) {
          const rpcUrl = defaultRpcs[i];
          try {
            console.log(`Step 4.${i + 1}a: Attempting RPC ${i + 1}/${defaultRpcs.length}: ${rpcUrl}`);
            const tempProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
            console.log(`Step 4.${i + 1}b: Provider created, testing with 3s timeout...`);
            
            // Quick connectivity test with timeout
            const blockNumber = await Promise.race([
              tempProvider.getBlockNumber(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('3 second timeout exceeded')), 3000))
            ]) as number;
            
            console.log(`Step 4.${i + 1}c: SUCCESS! Block number:`, blockNumber);
            web3Provider = tempProvider;
            console.log(`Step 4.${i + 1}d: Using RPC: ${rpcUrl}`);
            break;
          } catch (e) {
            console.warn(`Step 4.${i + 1}e: RPC failed: ${rpcUrl}`);
            console.warn("Error:", {
              name: e instanceof Error ? e.name : 'Unknown',
              message: e instanceof Error ? e.message : String(e)
            });
          }
        }
      }
      
      if (!web3Provider) {
        console.error("Step 5: FATAL - No RPC provider could be established");
        throw new Error("Unable to connect to Sepolia network. Please check your internet connection and try again.");
      }
      
      console.log("Step 6: Creating contract instance...");
      console.log("Contract Address:", CONTRACT_ADDRESS);
      console.log("Contract ABI length:", CONTRACT_ABI.length);
      
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
      console.log("Step 7: Contract instance created successfully");

      console.log("Step 8: Setting state...");
      setProvider(web3Provider);
      setSigner(null);
      setContract(contractInstance);
      setAccount(null);
      setIsConnected(true);
      setIsGuest(true);
      
      setUserRoles({
        isOwner: false,
        isProducer: false,
        isTransporter: false,
        isDistributor: false,
        isRetailer: false,
      });
      
      console.log("Step 9: State updated successfully");
      console.log("=== GUEST CONNECTION SUCCESS ===");
    } catch (error) {
      console.error("=== GUEST CONNECTION FAILED ===");
      console.error("Error caught in connectGuest:", error);
      console.error("Error type:", typeof error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setIsConnected(false);
    setIsGuest(false);
    setUserRoles({
      isOwner: false,
      isProducer: false,
      isTransporter: false,
      isDistributor: false,
      isRetailer: false,
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnect();
        } else if (account && accounts[0] !== account) {
          // Account changed, reconnect
          connect();
        }
      };

      const handleChainChanged = () => {
        // Reload page on chain change
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account, connect, disconnect]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        isConnected,
        isGuest,
        userRoles,
        connect,
        connectGuest,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
