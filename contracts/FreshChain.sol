// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract FreshChain {
    address public owner;
    uint public batchCounter; 

    mapping(address => bool) public isProducer;
    mapping(address => bool) public isTransporter;
    mapping(address => bool) public isDistributor;
    mapping(address => bool) public isRetailer;

    struct SensorData {
        int temperature;
        int humidity;
        string location;
        uint timestamp;
    }
    
    struct Batch {
        uint batchId;
        string productName;
        uint quantity;
        address producer;
        address currentOwner;
        bool arrived;
        bool passedInspection;
        SensorData[] sensorReadings;
    }
    
    mapping(uint => Batch) public batches;

    event BatchCreated(uint batchId, string productName, uint quantity);
    event SensorDataAdded(uint batchId, int temperature, int humidity, string location);
    event OwnershipTransferred(uint batchId, address from, address to);
    event BatchArrived(uint batchId, bool passedInspection);
    
    constructor() {
        owner = msg.sender;
        batchCounter = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    function registerProducer(address _user) external onlyOwner { isProducer[_user] = true; }
    function registerTransporter(address _user) external onlyOwner { isTransporter[_user] = true; }
    function registerDistributor(address _user) external onlyOwner { isDistributor[_user] = true; }
    function registerRetailer(address _user) external onlyOwner { isRetailer[_user] = true; }
    
    function createBatch(string memory productName, uint quantity) external {
        require(isProducer[msg.sender], "Only producer");
        
        batchCounter++; 
        uint newBatchId = batchCounter;

        Batch storage newBatch = batches[newBatchId];
        newBatch.batchId = newBatchId;
        newBatch.productName = productName;
        newBatch.quantity = quantity;
        newBatch.producer = msg.sender;
        newBatch.currentOwner = msg.sender;
        
        emit BatchCreated(newBatchId, productName, quantity);
    }
    
    function addSensorData(uint batchId, int temperature, int humidity, string memory location) external {
        require(isTransporter[msg.sender], "Only transporter");
        require(batches[batchId].currentOwner == msg.sender, "Not current owner of batch"); 
        require(temperature >= -10 && temperature <= 40, "Temperature out of range");
        require(humidity >= 0 && humidity <= 40, "Humidity out of range");
        
        batches[batchId].sensorReadings.push(SensorData({
            temperature: temperature,
            humidity: humidity,
            location: location,
            timestamp: block.timestamp
        }));
        
        emit SensorDataAdded(batchId, temperature, humidity, location);
    }
    
    function transferOwnership(uint batchId, address newOwner) external {
        require(batches[batchId].currentOwner == msg.sender, "You are not the owner");
        require(!batches[batchId].arrived, "Batch already arrived");

        if (isProducer[msg.sender]) {
            require(isTransporter[newOwner], "Producer must transfer to Transporter");
        } else if (isTransporter[msg.sender]) {
            require(isDistributor[newOwner], "Transporter must transfer to Distributor");
        } else if (isDistributor[msg.sender]) {
            require(isRetailer[newOwner], "Distributor must transfer to Retailer");
        }

        address previousOwner = batches[batchId].currentOwner;
        batches[batchId].currentOwner = newOwner;
        
        emit OwnershipTransferred(batchId, previousOwner, newOwner);
    }
    
    function markAsArrived(uint batchId, bool passedInspection) external {
        require(isRetailer[msg.sender], "Only retailer");
        require(batches[batchId].currentOwner == msg.sender, "Not current owner");
        require(!batches[batchId].arrived, "Already finalized");
        
        batches[batchId].arrived = true;
        batches[batchId].passedInspection = passedInspection;
        
        emit BatchArrived(batchId, passedInspection);
    }
    
    function getBatchHistory(uint batchId) public view returns (
        uint id, string memory name, uint qty, address prod, address ownerAddr, bool isArrived, bool isPassed
    ) {
        Batch storage batch = batches[batchId];
        return (
            batch.batchId,
            batch.productName,
            batch.quantity,
            batch.producer,
            batch.currentOwner,
            batch.arrived,
            batch.passedInspection
        );
    }
    
    function getSensorReadings(uint batchId) public view returns (SensorData[] memory) {
        return batches[batchId].sensorReadings;
    }
}