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
    try {
      let web3Provider;
      if (typeof window.ethereum !== 'undefined') {
        // Use MetaMask provider without requesting accounts
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        // Fallback to localhost
        web3Provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
      }
      
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);

      setProvider(web3Provider);
      setSigner(null); // No signer for guests
      setContract(contractInstance);
      setAccount(null);
      setIsConnected(true);
      setIsGuest(true);
      
      // No roles for guests
      setUserRoles({
        isOwner: false,
        isProducer: false,
        isTransporter: false,
        isDistributor: false,
        isRetailer: false,
      });
    } catch (error) {
      console.error('Error connecting as guest:', error);
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
