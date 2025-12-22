import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wallet, LogOut, Leaf, User, ShoppingCart } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';

export function Navbar() {
  const location = useLocation();
  const { account, isConnected, isGuest, connect, disconnect } = useWeb3();
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to connect');
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Left: Navigation */}
          <div className="flex items-center gap-2 flex-1">
            {isConnected && (
              <>
                {!isGuest && (
                  <Link to="/dashboard">
                    <Button
                      variant={isActive('/dashboard') ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <Link to="/products">
                  <Button
                    variant={isActive('/products') ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Products</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">FreshChain</h1>
                <p className="text-xs text-muted-foreground">Food Traceability</p>
              </div>
            </Link>
          </div>

          {/* Right: Wallet Status */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {isConnected ? (
              <>
                <Badge variant="outline" className="gap-2 py-2 px-3">
                  <div className={`w-2 h-2 rounded-full ${isGuest ? 'bg-secondary' : 'bg-primary'} animate-pulse`}></div>
                  <span className="font-mono text-xs">
                    {isGuest ? 'Guest Mode' : (account ? formatAddress(account) : 'Connected')}
                  </span>
                </Badge>
                <Button
                  onClick={disconnect}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{isGuest ? 'Exit' : 'Disconnect'}</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleConnect}
                className="gap-2 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
