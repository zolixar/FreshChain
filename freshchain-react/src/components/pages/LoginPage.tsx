import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Leaf, Wallet, Sun, Sprout, Tractor, Wheat } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';

export function LoginPage() {
  const { connect, connectGuest } = useWeb3();
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to connect');
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side - Farm Visuals */}
      <div className="relative w-full md:w-1/2 lg:w-2/3 bg-primary overflow-hidden flex flex-col justify-between p-8 md:p-12 text-primary-foreground">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 transform rotate-12"><Sun size={120} /></div>
          <div className="absolute bottom-20 right-20 transform -rotate-12"><Tractor size={200} /></div>
          <div className="absolute top-1/2 left-1/4 transform rotate-45"><Wheat size={150} /></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 opacity-90"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Leaf className="h-8 w-8 text-secondary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">FreshChain</span>
          </div>
          
          <div className="max-w-xl space-y-6 mt-12 md:mt-24">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-muted">
              From Our Fields <br/>
              <span className="text-white">To Your Table.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 font-medium leading-relaxed max-w-md">
              Experience the journey of your food with complete transparency. 
              Powered by blockchain for trust you can taste.
            </p>
          </div>
        </div>

        {/* Stats/Footer on Left */}
        <div className="relative z-10 mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
          <div>
            <p className="text-3xl font-bold text-secondary">100%</p>
            <p className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider mt-1">Traceable</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-secondary">24/7</p>
            <p className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider mt-1">Monitoring</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-secondary">Secure</p>
            <p className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider mt-1">Blockchain</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2 md:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-primary">FreshChain</h2>
          </div>

          <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-center text-primary">Welcome Back</CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                Connect your wallet to access the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  onClick={handleConnect} 
                  size="lg" 
                  className="w-full h-14 text-base font-semibold shadow-lg transition-all"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Connect with MetaMask
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue as guest
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={connectGuest}
                  size="lg"
                  className="w-full h-14 text-base border-2 border-primary text-primary hover:bg-primary/5 font-semibold transition-all hover:scale-[1.02]"
                >
                  <Sprout className="mr-3 h-5 w-5" />
                  Enter as Customer
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  By connecting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
