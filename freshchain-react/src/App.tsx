import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import ProductGallery from './components/customer/ProductGallery';
import BatchHistory from './components/customer/BatchHistory';
import { useWeb3 } from './contexts/Web3Context';

function App() {
  const { isConnected } = useWeb3();

  return (
    <HashRouter>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
}

export default App;

