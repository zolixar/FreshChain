import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Shield, 
  Factory, 
  Truck, 
  Package, 
  Store,
  UserPlus,
  Plus,
  Send,
  CheckCircle,
  Share2,
  Download
} from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';

type DashboardRole = 'admin' | 'producer' | 'transporter' | 'distributor' | 'retailer';

function ActiveBatchesList({ contract, userAddress }: { contract: ethers.Contract | null, userAddress: string | null }) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveBatches();
  }, [contract, userAddress]);

  const loadActiveBatches = async () => {
    if (!contract || !userAddress) return;
    setLoading(true);
    try {
      const count = await contract.batchCounter();
      const activeBatches = [];
      
      for (let i = 1; i <= count; i++) {
        const batch = await contract.batches(i);
        if (batch.currentOwner.toLowerCase() === userAddress.toLowerCase() && !batch.arrived) {
             activeBatches.push({
                id: batch.batchId.toNumber(),
                name: batch.productName,
                quantity: batch.quantity.toNumber(),
                producer: batch.producer
             });
        }
      }
      setBatches(activeBatches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (batchId: number) => {
    const url = `https://zolixar.github.io/FreshChain/#/batch/${batchId}`;
    try {
      await navigator.clipboard.writeText(url);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadQRCode = async (batchId: number) => {
    try {
      const url = `https://zolixar.github.io/FreshChain/#/batch/${batchId}`;
      const dataUrl = await QRCode.toDataURL(url, { 
        width: 200, 
        margin: 2,
        color: {
          dark: '#2d6a4f',
          light: '#ffffff'
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `freshchain-batch-${batchId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Active Batches</CardTitle>
          <CardDescription>Loading your active batches...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Active Batches
            </CardTitle>
            <CardDescription>Batches currently in your possession ({batches.length})</CardDescription>
        </CardHeader>
        <CardContent>
            {batches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active batches found.</p>
            ) : (
              <div className="space-y-3">
                  {batches.map(batch => (
                      <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                          <div>
                              <p className="font-medium">{batch.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-mono bg-muted px-1 py-0.5 rounded">ID: {batch.id}</span>
                                <span className="mx-2">•</span>
                                {batch.quantity} units
                              </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(batch.id)}
                              title="Share link"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => downloadQRCode(batch.id)}
                              title="Download QR Code"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </CardContent>
    </Card>
  );
}

const roleConfig = {
  admin: {
    icon: Shield,
    label: 'Admin Panel',
    description: 'Manage users and permissions',
    color: 'text-primary',
  },
  producer: {
    icon: Factory,
    label: 'Producer Panel',
    description: 'Create new batches',
    color: 'text-primary',
  },
  transporter: {
    icon: Truck,
    label: 'Transporter Panel',
    description: 'Add sensor data during transit',
    color: 'text-secondary',
  },
  distributor: {
    icon: Package,
    label: 'Distributor Panel',
    description: 'Transfer batch ownership',
    color: 'text-accent',
  },
  retailer: {
    icon: Store,
    label: 'Retailer Panel',
    description: 'Mark batches as arrived',
    color: 'text-destructive',
  },
};

export function DashboardPage() {
  const { contract, userRoles, account } = useWeb3();
  const [selectedRole, setSelectedRole] = useState<DashboardRole | null>(null);

  const availableRoles: DashboardRole[] = [];
  if (userRoles.isOwner) availableRoles.push('admin');
  if (userRoles.isProducer) availableRoles.push('producer');
  if (userRoles.isTransporter) availableRoles.push('transporter');
  if (userRoles.isDistributor) availableRoles.push('distributor');
  if (userRoles.isRetailer) availableRoles.push('retailer');

  useEffect(() => {
    if (availableRoles.length === 1 && selectedRole === null) {
      setSelectedRole(availableRoles[0]);
    }
  }, [availableRoles, selectedRole]);

  if (availableRoles.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>No Dashboard Access</CardTitle>
            <CardDescription>
              You don't have any roles assigned. Contact the admin to get access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!selectedRole) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Select your role to access the dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRoles.map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            
            return (
              <Card
                key={role}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary group"
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`${config.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {config.label}
                      </CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Open Dashboard →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        {availableRoles.length > 1 && (
          <Button variant="ghost" onClick={() => setSelectedRole(null)}>
            ← Back to Dashboard
          </Button>
        )}
      </div>
      
      {selectedRole === 'admin' && <AdminPanel contract={contract} />}
      {selectedRole === 'producer' && <ProducerPanel contract={contract} account={account} />}
      {selectedRole === 'transporter' && <TransporterPanel contract={contract} account={account} />}
      {selectedRole === 'distributor' && <DistributorPanel contract={contract} account={account} />}
      {selectedRole === 'retailer' && <RetailerPanel contract={contract} account={account} />}
    </div>
  );
}

function TransferOwnershipCard({ 
  contract, 
  targetRole 
}: { 
  contract: ethers.Contract | null, 
  targetRole: string 
}) {
  const [batchId, setBatchId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [loading, setLoading] = useState(false);

  const transferOwnership = async () => {
    if (!contract || !batchId || !newOwner) return;
    
    try {
      setLoading(true);
      const tx = await contract.transferOwnership(parseInt(batchId), newOwner);
      await tx.wait();
      alert('Ownership transferred successfully!');
      setBatchId('');
      setNewOwner('');
    } catch (error) {
      console.error(error);
      alert('Failed to transfer ownership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Transfer Ownership
        </CardTitle>
        <CardDescription>Transfer batch to a {targetRole}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Batch ID</label>
          <Input
            type="number"
            placeholder="Enter batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">New Owner Address ({targetRole})</label>
          <Input
            placeholder="0x..."
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
        </div>
        
        <Button onClick={transferOwnership} disabled={loading} className="w-full">
          Transfer Ownership
        </Button>
      </CardContent>
    </Card>
  );
}

function AdminPanel({ contract }: { contract: ethers.Contract | null }) {
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async (roleType: 'Producer' | 'Transporter' | 'Distributor' | 'Retailer') => {
    if (!contract || !userAddress) return;
    
    try {
      setLoading(true);
      const tx = await contract[`register${roleType}`](userAddress);
      await tx.wait();
      alert(`${roleType} registered successfully!`);
      setUserAddress('');
    } catch (error) {
      console.error(error);
      alert('Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Admin Panel
        </h2>
        <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New User
          </CardTitle>
          <CardDescription>Assign roles to Ethereum addresses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter Ethereum address (0x...)"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => registerUser('Producer')} disabled={loading || !userAddress}>
              Register as Producer
            </Button>
            <Button onClick={() => registerUser('Transporter')} disabled={loading || !userAddress}>
              Register as Transporter
            </Button>
            <Button onClick={() => registerUser('Distributor')} disabled={loading || !userAddress}>
              Register as Distributor
            </Button>
            <Button onClick={() => registerUser('Retailer')} disabled={loading || !userAddress}>
              Register as Retailer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProducerPanel({ contract, account }: { contract: ethers.Contract | null, account: string | null }) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const createBatch = async () => {
    if (!contract || !productName || !quantity) return;
    
    try {
      setLoading(true);
      const tx = await contract.createBatch(productName, parseInt(quantity));
      await tx.wait();
      alert('Batch created successfully!');
      setProductName('');
      setQuantity('');
    } catch (error) {
      console.error(error);
      alert('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Factory className="h-6 w-6 text-primary" />
          Producer Panel
        </h2>
        <p className="text-muted-foreground mt-1">Create new product batches</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Batch
              </CardTitle>
              <CardDescription>Register a new product batch on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="e.g., Organic Tomatoes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              
              <Button onClick={createBatch} disabled={loading || !productName || !quantity} className="w-full">
                Create Batch
              </Button>
            </CardContent>
          </Card>
          
          <ActiveBatchesList contract={contract} userAddress={account} />
        </div>

        <TransferOwnershipCard contract={contract} targetRole="Transporter" />
      </div>
    </div>
  );
}

function TransporterPanel({ contract, account }: { contract: ethers.Contract | null, account: string | null }) {
  const [batchId, setBatchId] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const addSensorData = async () => {
    if (!contract || !batchId || !temperature || !humidity || !location) return;
    
    try {
      setLoading(true);
      const tx = await contract.addSensorData(
        parseInt(batchId),
        parseInt(temperature),
        parseInt(humidity),
        location
      );
      await tx.wait();
      alert('Sensor data added successfully!');
      setBatchId('');
      setTemperature('');
      setHumidity('');
      setLocation('');
    } catch (error) {
      console.error(error);
      alert('Failed to add sensor data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          Transporter Panel
        </h2>
        <p className="text-muted-foreground mt-1">Add sensor data during transit</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Sensor Reading</CardTitle>
              <CardDescription>Record temperature, humidity, and location data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch ID</label>
                <Input
                  type="number"
                  placeholder="Enter batch ID"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature (°C)</label>
                  <Input
                    type="number"
                    placeholder="-10 to 40"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Humidity (%)</label>
                  <Input
                    type="number"
                    placeholder="0 to 40"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g., Warehouse A, City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <Button onClick={addSensorData} disabled={loading} className="w-full">
                Add Sensor Data
              </Button>
            </CardContent>
          </Card>
          
          <ActiveBatchesList contract={contract} userAddress={account} />
        </div>

        <TransferOwnershipCard contract={contract} targetRole="Distributor" />
      </div>
    </div>
  );
}

function DistributorPanel({ contract, account }: { contract: ethers.Contract | null, account: string | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-secondary" />
          Distributor Panel
        </h2>
        <p className="text-muted-foreground mt-1">Transfer batch ownership to retailers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActiveBatchesList contract={contract} userAddress={account} />
        <TransferOwnershipCard contract={contract} targetRole="Retailer" />
      </div>
    </div>
  );
}

function RetailerPanel({ contract, account }: { contract: ethers.Contract | null, account: string | null }) {
  const [batchId, setBatchId] = useState('');
  const [passedInspection, setPassedInspection] = useState(true);
  const [loading, setLoading] = useState(false);

  const markAsArrived = async () => {
    if (!contract || !batchId) return;
    
    try {
      setLoading(true);
      const tx = await contract.markAsArrived(parseInt(batchId), passedInspection);
      await tx.wait();
      alert('Batch marked as arrived!');
      setBatchId('');
    } catch (error) {
      console.error(error);
      alert('Failed to mark batch as arrived');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          Retailer Panel
        </h2>
        <p className="text-muted-foreground mt-1">Mark batches as arrived and inspected</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Mark Batch as Arrived
            </CardTitle>
            <CardDescription>Finalize batch delivery and inspection status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch ID</label>
              <Input
                type="number"
                placeholder="Enter batch ID"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <input
                type="checkbox"
                checked={passedInspection}
                onChange={(e) => setPassedInspection(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Passed Quality Inspection</label>
            </div>
            
            <Button onClick={markAsArrived} disabled={loading} className="w-full">
              Mark as Arrived
            </Button>
          </CardContent>
        </Card>

        <ActiveBatchesList contract={contract} userAddress={account} />
      </div>
    </div>
  );
}
