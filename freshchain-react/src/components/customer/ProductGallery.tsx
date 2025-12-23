import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Package } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';
import type { Batch } from '../../types';

export default function ProductGallery() {
  const { contract } = useWeb3();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const loadProducts = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add a timeout to the contract call to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Check your internet connection or RPC URL.')), 15000)
      );

      const batchCountPromise = contract.batchCounter();
      const batchCount = await Promise.race([batchCountPromise, timeoutPromise]) as any;
      
      const totalBatches = batchCount.toNumber();
      
      const batchPromises = [];
      for (let i = 1; i <= totalBatches; i++) {
        batchPromises.push(contract.getBatchHistory(i));
      }
      
      const batchData = await Promise.all(batchPromises);
      
      const formattedBatches: Batch[] = batchData.map((batch, index) => ({
        batchId: index + 1,
        productName: batch.name,
        quantity: batch.qty.toNumber(),
        producer: batch.prod,
        transporter: batch.transporter || '0x0000000000000000000000000000000000000000',
        distributor: batch.distributor || '0x0000000000000000000000000000000000000000',
        retailer: batch.retailer || '0x0000000000000000000000000000000000000000',
        currentOwner: batch.ownerAddr,
        arrived: batch.isArrived,
        passedInspection: batch.isPassed,
      }));
      
      setBatches(formattedBatches);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (batch: Batch) => {
    if (batch.arrived && batch.passedInspection) {
      return <Badge variant="success">✓ Available</Badge>;
    } else if (batch.arrived && !batch.passedInspection) {
      return <Badge variant="destructive">✗ Failed Inspection</Badge>;
    } else {
      return <Badge variant="secondary">In Transit</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadProducts} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <Package className="h-16 w-16 mx-auto text-secondary mb-4" />
            <CardTitle>No Products Available</CardTitle>
            <CardDescription>
              There are no products in the system yet. Check back later!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Gallery</h2>
          <p className="text-muted-foreground">
            Discover fresh products with complete traceability
          </p>
        </div>
        <Badge variant="secondary" className="text-lg">
          {batches.length} {batches.length === 1 ? 'Product' : 'Products'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card
            key={batch.batchId}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary"
            onClick={() => navigate(`/batch/${batch.batchId}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Package className="h-5 w-5" />
                    {batch.productName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Batch #{batch.batchId}
                  </CardDescription>
                </div>
                {getStatusBadge(batch)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-semibold">{batch.quantity} units</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Producer:</span>
                <span className="font-mono text-xs truncate max-w-[150px]" title={batch.producer}>
                  {batch.producer.slice(0, 6)}...{batch.producer.slice(-4)}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/batch/${batch.batchId}`);
                }}
              >
                View Details →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
