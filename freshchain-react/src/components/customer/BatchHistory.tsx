import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Thermometer, Droplets, User, CheckCircle, Factory, Truck, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';
import type { Batch, SensorData } from '../../types';

type TimelineEventData = 
  | SensorData
  | { producer: string }
  | { from: string; to: string; role: string }
  | { arrived: boolean; passedInspection: boolean };

interface TimelineEvent {
  type: 'created' | 'sensor' | 'transfer' | 'arrived';
  timestamp: number;
  data: TimelineEventData;
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}

export default function BatchHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract } = useWeb3();
  const batchId = id ? parseInt(id) : 0;
  
  const [batch, setBatch] = useState<Batch | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatchDetails();
    if (batchId) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId, contract]);

  const generateQRCode = async () => {
    try {
      // Use HashRouter format for GitHub Pages compatibility
      const url = `https://zolixar.github.io/FreshChain/#/batch/${batchId}`;
      const dataUrl = await QRCode.toDataURL(url, { 
        width: 200, 
        margin: 2,
        color: {
          dark: '#2d6a4f',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `freshchain-batch-${batchId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadBatchDetails = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);

      const batchData = await contract.getBatchHistory(batchId);
      
      const batchInfo: Batch = {
        batchId,
        productName: batchData.name,
        quantity: batchData.qty.toNumber(),
        producer: batchData.prod,
        transporter: batchData.transporter || '0x0000000000000000000000000000000000000000',
        distributor: batchData.distributor || '0x0000000000000000000000000000000000000000',
        retailer: batchData.retailer || '0x0000000000000000000000000000000000000000',
        currentOwner: batchData.ownerAddr,
        arrived: batchData.isArrived,
        passedInspection: batchData.isPassed,
      };

      setBatch(batchInfo);

      // Load sensor data
      const sensors = await contract.getSensorReadings(batchId);
      const formattedSensorData: SensorData[] = sensors.map((s: { temperature: { toNumber: () => number }; humidity: { toNumber: () => number }; location: string; timestamp: { toNumber: () => number } }) => ({
        temperature: s.temperature.toNumber(),
        humidity: s.humidity.toNumber(),
        location: s.location,
        timestamp: s.timestamp.toNumber(),
      }));

      // Build timeline from events
      await buildTimeline(batchInfo, formattedSensorData);
    } catch (err) {
      console.error('Error loading batch:', err);
      setError('Batch not found. It may not exist yet.');
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = async (batchInfo: Batch, sensors: SensorData[]) => {
    if (!contract) return;

    const events: TimelineEvent[] = [];
    const chain: { 
      producer: { address: string; timestamp: number } | null;
      transporter: { address: string; timestamp: number } | null;
      distributor: { address: string; timestamp: number } | null;
      retailer: { address: string; timestamp: number } | null;
    } = {
      producer: null,
      transporter: null,
      distributor: null,
      retailer: null
    };

    try {
      // Get creation event
      const createFilter = contract.filters.BatchCreated();
      const allCreateEvents = await contract.queryFilter(createFilter);
      const createEvents = allCreateEvents.filter((e: any) => e.args?.batchId.toString() === batchId?.toString());
      
      if (createEvents.length > 0) {
        const block = await createEvents[0].getBlock();
        chain.producer = { address: batchInfo.producer, timestamp: block.timestamp };
        events.push({
          type: 'created',
          timestamp: block.timestamp,
          data: { producer: batchInfo.producer },
          icon: Factory,
          color: 'text-primary',
          title: 'Batch Created',
          description: `${batchInfo.productName} (${batchInfo.quantity} units) created by producer`,
        });
      }

      // Get ownership transfer events
      const transferFilter = contract.filters.OwnershipTransferred();
      const allTransferEvents = await contract.queryFilter(transferFilter);
      const transferEvents = allTransferEvents.filter((e: any) => e.args?.batchId.toString() === batchId?.toString());

      for (const event of transferEvents) {
        const block = await event.getBlock();
        const from = event.args?.from;
        const to = event.args?.to;
        
        // Determine role based on address and store in chain
        let roleLabel = 'Next Party';
        if (await contract.isTransporter(to)) {
          roleLabel = 'Transporter';
          chain.transporter = { address: to, timestamp: block.timestamp };
        } else if (await contract.isDistributor(to)) {
          roleLabel = 'Distributor';
          chain.distributor = { address: to, timestamp: block.timestamp };
        } else if (await contract.isRetailer(to)) {
          roleLabel = 'Retailer';
          chain.retailer = { address: to, timestamp: block.timestamp };
        }

        events.push({
          type: 'transfer',
          timestamp: block.timestamp,
          data: { from, to, role: roleLabel },
          icon: ArrowRight,
          color: 'text-secondary',
          title: `Transferred to ${roleLabel}`,
          description: `Ownership transferred to ${to.slice(0, 6)}...${to.slice(-4)}`,
        });
      }

      // Get sensor data events (add timestamps from sensor readings)
      sensors.forEach((sensor) => {
        events.push({
          type: 'sensor',
          timestamp: sensor.timestamp,
          data: sensor,
          icon: Thermometer,
          color: 'text-accent',
          title: 'Sensor Reading',
          description: `${sensor.temperature}°C, ${sensor.humidity}% at ${sensor.location}`,
        });
      });

      // Get arrival event
      if (batchInfo.arrived) {
        const arriveFilter = contract.filters.BatchArrived();
        const allArriveEvents = await contract.queryFilter(arriveFilter);
        const arriveEvents = allArriveEvents.filter((e: any) => e.args?.batchId.toString() === batchId?.toString());

        if (arriveEvents.length > 0) {
          const block = await arriveEvents[0].getBlock();
          events.push({
            type: 'arrived',
            timestamp: block.timestamp,
            data: { arrived: true, passedInspection: batchInfo.passedInspection },
            icon: CheckCircle,
            color: batchInfo.passedInspection ? 'text-primary' : 'text-destructive',
            title: batchInfo.passedInspection ? 'Arrived - Passed Inspection' : 'Arrived - Failed Inspection',
            description: `Batch arrived at retailer and was ${batchInfo.passedInspection ? 'approved' : 'rejected'}`,
          });
        }
      }

      // Sort by timestamp (oldest first)
      events.sort((a, b) => a.timestamp - b.timestamp);
      setTimeline(events);
    } catch (err) {
      console.error('Error building timeline:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="space-y-6">
        <Button onClick={() => navigate('/products')} variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || 'Batch not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/products')} variant="outline">
              Return to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Status Banner */}
        <div className={`rounded-t-lg p-4 text-white flex items-center justify-between ${batch.arrived ? 'bg-primary' : 'bg-secondary text-secondary-foreground'}`}>
          <div className="flex items-center gap-3">
            {batch.arrived ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Truck className="h-6 w-6" />
            )}
            <div>
              <h2 className="text-xl font-bold uppercase">
                {batch.arrived ? 'DELIVERED' : 'IN TRANSIT'}
              </h2>
              <p className="text-sm opacity-90">
                Batch ID: {batch.batchId} | {batch.arrived ? `Delivered as on ${formatDate(timeline.find(e => e.type === 'arrived')?.timestamp || Date.now() / 1000)}` : 'Currently in transit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={downloadQRCode} 
               className={`text-xs h-8 gap-1 border-none ${batch.arrived ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-secondary-foreground'}`}
             >
               <Share2 className="h-3 w-3" /> Share
             </Button>
             {qrCodeUrl && (
               <div className="bg-white p-1 rounded shadow-sm">
                 <img src={qrCodeUrl} alt="Batch QR Code" className="w-12 h-12" />
               </div>
             )}
          </div>
        </div>

        {/* Product Details */}
        <Card className="rounded-t-none border-t-0 -mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Product</p>
                  <p className="font-bold text-lg">{batch.productName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Quantity</p>
                  <p className="font-bold text-lg">{batch.quantity} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Producer</p>
                  <p className="font-bold text-sm truncate" title={batch.producer}>
                    {batch.producer.slice(0, 6)}...{batch.producer.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Current Holder</p>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {batch.arrived ? 'Retailer' : 'Transporter'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate" title={batch.currentOwner}>
                      {batch.currentOwner.slice(0, 6)}...{batch.currentOwner.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Tracking History */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0 ml-2">
              {/* Vertical Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-6 pb-8 last:pb-0 group">
                  {/* Dot */}
                  <div className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-white ring-2 ${index === 0 ? 'bg-primary ring-primary' : 'bg-primary ring-primary'}`} />
                  
                  {/* Content */}
                  <div className="flex-1 bg-muted/30 rounded-lg p-4 -mt-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-bold text-base flex items-center gap-2 ${event.color}`}>
                          {event.icon && <event.icon className="h-4 w-4" />}
                          {event.title}
                        </h3>
                        
                        {/* Location/Subtitle */}
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.type === 'created' ? 'Origin' : 
                           event.type === 'arrived' ? 'Final Destination' :
                           event.type === 'sensor' && 'location' in event.data ? event.data.location :
                           'Processing Center'}
                        </p>

                        {/* Extra Details */}
                        <div className="mt-2 text-sm">
                          {event.type === 'sensor' && 'temperature' in event.data && (
                            <div className="flex gap-4">
                              <span className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3 text-destructive" />
                                Temp: <b>{event.data.temperature}°C</b>
                              </span>
                              <span className="flex items-center gap-1">
                                <Droplets className="h-3 w-3 text-blue-500" />
                                Humidity: <b>{event.data.humidity}%</b>
                              </span>
                            </div>
                          )}
                          
                          {event.type === 'created' && 'producer' in event.data && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Factory className="h-3 w-3" />
                              Producer
                              <span className="font-mono text-xs ml-1">
                                {event.data.producer?.slice(0, 10)}...
                              </span>
                            </div>
                          )}

                          {event.type === 'transfer' && 'role' in event.data && 'to' in event.data && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-3 w-3" />
                              {event.data.role}
                              <span className="font-mono text-xs ml-1">
                                {event.data.to?.slice(0, 10)}...
                              </span>
                            </div>
                          )}
                          
                          {event.type === 'arrived' && (
                            <p className="text-primary font-medium">
                              Product passed quality inspection
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground font-medium">
                          {formatDate(event.timestamp)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(event.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
