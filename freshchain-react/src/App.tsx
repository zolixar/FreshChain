import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import ProductGallery from './components/customer/ProductGallery';
import BatchHistory from './components/customer/BatchHistory';
import { useWeb3 } from './contexts/Web3Context';

function AppContent() {
  const { isConnected, connectGuest } = useWeb3();
  const location = useLocation();
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);

  // Auto-connect as guest when accessing batch pages from QR codes
  useEffect(() => {
    if (!isConnected && location.pathname.startsWith('/batch/')) {
      console.log('Auto-connecting as guest for batch page access');
      setIsAutoConnecting(true);
      connectGuest()
        .then(() => {
          console.log('Auto-connect successful');
          setIsAutoConnecting(false);
        })
        .catch(err => {
          console.error('Failed to auto-connect as guest:', err);
          setIsAutoConnecting(false);
        });
    }
  }, [isConnected, location.pathname, connectGuest]);

  // Show loading while auto-connecting for batch pages
  if (isAutoConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Connecting to blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isConnected ? (
        <>
          <Navbar />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductGallery />} />
              <Route path="/batch/:id" element={<BatchHistory />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/batch/:id" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;

