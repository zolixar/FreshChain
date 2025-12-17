const CONTRACT_ADDRESS = "0xB764Bf6C253f94009a10e1bC9FFC728e24653A5E";

const CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "int256",
				"name": "temperature",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "humidity",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "addSensorData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "passedInspection",
				"type": "bool"
			}
		],
		"name": "BatchArrived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "BatchCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "createBatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "passedInspection",
				"type": "bool"
			}
		],
		"name": "markAsArrived",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "registerDistributor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "registerProducer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "registerRetailer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "registerTransporter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "temperature",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "humidity",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "SensorDataAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "batchCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "batches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "producer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "currentOwner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "arrived",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "passedInspection",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			}
		],
		"name": "getBatchHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "qty",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "prod",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "ownerAddr",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isArrived",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isPassed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			}
		],
		"name": "getSensorReadings",
		"outputs": [
			{
				"components": [
					{
						"internalType": "int256",
						"name": "temperature",
						"type": "int256"
					},
					{
						"internalType": "int256",
						"name": "humidity",
						"type": "int256"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct FreshChain.SensorData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isDistributor",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isProducer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isRetailer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isTransporter",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
// Global variables
let provider;
let signer;
let contract;
let userAccount;

// Connect to MetaMask
document.getElementById('connectBtn').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAccount = await signer.getAddress();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            document.getElementById('account').textContent = userAccount;
            document.getElementById('connectBtn').style.display = 'none';
            document.getElementById('account-info').style.display = 'block';
            document.getElementById('role-selector').style.display = 'block';

            await checkUserRolesAndEnableButtons();

            showMessage('Connected successfully! 🎉', 'success');
        } catch (error) {
            showMessage('Error connecting: ' + error.message, 'error');
        }
    } else {
        showMessage('Please install MetaMask! 🦊', 'error');
    }
});

async function checkUserRolesAndEnableButtons() {
    try {
        const isOwner = (await contract.owner()).toLowerCase() === userAccount.toLowerCase();
        const isProducer = await contract.isProducer(userAccount);
        const isTransporter = await contract.isTransporter(userAccount);
        const isDistributor = await contract.isDistributor(userAccount);
        const isRetailer = await contract.isRetailer(userAccount);
        
        const roleButtons = {
            admin: document.querySelector('.role-btn[data-role="admin"]'),
            producer: document.querySelector('.role-btn[data-role="producer"]'),
            transporter: document.querySelector('.role-btn[data-role="transporter"]'),
            distributor: document.querySelector('.role-btn[data-role="distributor"]'),
            retailer: document.querySelector('.role-btn[data-role="retailer"]'),
            customer: document.querySelector('.role-btn[data-role="customer"]')
        };
        
        Object.values(roleButtons).forEach(btn => {
            btn.style.opacity = '0.4';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';
        });
        
        roleButtons.customer.style.opacity = '1';
        roleButtons.customer.style.cursor = 'pointer';
        roleButtons.customer.style.pointerEvents = 'auto';
        
        if (isOwner) {
            roleButtons.admin.style.opacity = '1';
            roleButtons.admin.style.cursor = 'pointer';
            roleButtons.admin.style.pointerEvents = 'auto';
        }
        
        if (isProducer) {
            roleButtons.producer.style.opacity = '1';
            roleButtons.producer.style.cursor = 'pointer';
            roleButtons.producer.style.pointerEvents = 'auto';
        }
        
        if (isTransporter) {
            roleButtons.transporter.style.opacity = '1';
            roleButtons.transporter.style.cursor = 'pointer';
            roleButtons.transporter.style.pointerEvents = 'auto';
        }
        
        if (isDistributor) {
            roleButtons.distributor.style.opacity = '1';
            roleButtons.distributor.style.cursor = 'pointer';
            roleButtons.distributor.style.pointerEvents = 'auto';
        }
        
        if (isRetailer) {
            roleButtons.retailer.style.opacity = '1';
            roleButtons.retailer.style.cursor = 'pointer';
            roleButtons.retailer.style.pointerEvents = 'auto';
        }
        
    } catch (error) {
        console.error('Error checking roles:', error);
    }
}

document.getElementById('disconnectBtn').addEventListener('click', () => {
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;
    
    document.getElementById('connectBtn').style.display = 'block';
    document.getElementById('account-info').style.display = 'none';
    document.getElementById('role-selector').style.display = 'none';
    hideAllPanels();
    
    document.querySelector('.welcome-screen').style.display = 'block';
    
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    
    showMessage('Disconnected successfully', 'success');
});

document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const role = this.getAttribute('data-role');
        hideAllPanels();
        document.getElementById(role + '-panel').style.display = 'block';
        document.querySelector('.welcome-screen').style.display = 'none';
    });
});

function hideAllPanels() {
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.display = 'none';
    });
}

function showMessage(msg, type) {
    const isSuccess = type === 'success';
    const icon = isSuccess ? '✅' : '❌';
    const bgColor = isSuccess ? '#d4edda' : '#f8d7da';
    const textColor = isSuccess ? '#155724' : '#721c24';
    const borderColor = isSuccess ? '#4a7c2f' : '#dc3545';
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 18px 25px;
        border-radius: 10px;
        border-left: 5px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        font-size: 1em;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `<strong>${icon}</strong> ${msg}`;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

async function registerProducer() {
    const address = document.getElementById('producerAddress').value;
    try {
        const tx = await contract.registerProducer(address);
        await tx.wait();
        showMessage('Producer registered successfully!', 'success');
        document.getElementById('producerAddress').value = '';
    } catch (error) {
        if (error.message.includes('Only owner')) {
            const owner = await contract.owner();
            showMessage(`❌ Only the contract owner can register users. Owner: ${owner}. Your address: ${userAccount}`, 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function registerTransporter() {
    const address = document.getElementById('transporterAddress').value;
    try {
        const tx = await contract.registerTransporter(address);
        await tx.wait();
        showMessage('Transporter registered successfully!', 'success');
        document.getElementById('transporterAddress').value = '';
    } catch (error) {
        if (error.message.includes('Only owner')) {
            const owner = await contract.owner();
            showMessage(`❌ Only the contract owner can register users. Owner: ${owner}. Your address: ${userAccount}`, 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function registerDistributor() {
    const address = document.getElementById('adminDistributorAddress').value;
    try {
        const tx = await contract.registerDistributor(address);
        await tx.wait();
        showMessage('Distributor registered successfully!', 'success');
        document.getElementById('adminDistributorAddress').value = '';
    } catch (error) {
        if (error.message.includes('Only owner')) {
            const owner = await contract.owner();
            showMessage(`❌ Only the contract owner can register users. Owner: ${owner}. Your address: ${userAccount}`, 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function registerRetailer() {
    const address = document.getElementById('retailerAddress').value;
    try {
        const tx = await contract.registerRetailer(address);
        await tx.wait();
        showMessage('Retailer registered successfully!', 'success');
        document.getElementById('retailerAddress').value = '';
    } catch (error) {
        if (error.message.includes('Only owner')) {
            const owner = await contract.owner();
            showMessage(`❌ Only the contract owner can register users. Owner: ${owner}. Your address: ${userAccount}`, 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function createBatch() {
    const productName = document.getElementById('productName').value;
    const quantity = document.getElementById('quantity').value;
    
    if (!productName || !quantity) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const tx = await contract.createBatch(productName, quantity);
        const receipt = await tx.wait();
        
        let batchId;
        const event = receipt.events?.find(e => e.event === 'BatchCreated');
        if (event) {
            batchId = event.args.batchId.toString();
        } else {
            batchId = (await contract.batchCounter()).toString();
        }
        
        showMessage(`Batch #${batchId} created successfully!`, 'success');
        generateQRCode(batchId);
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        await loadMyBatches('producer');
    } catch (error) {
        console.error('Create batch error:', error);
        if (error.message.includes('Only producer')) {
            showMessage('❌ You are not registered as a Producer! Please switch to Admin role and register your address first: ' + userAccount, 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function transferOwnership() {
    const batchId = document.getElementById('transferBatchId').value;
    const newOwner = document.getElementById('newOwner').value;
    
    try {
        const isTransporter = await contract.isTransporter(newOwner);
        if (!isTransporter) {
            showMessage('Error: Recipient must be a registered Transporter! 🚚', 'error');
            return;
        }
        
        const tx = await contract.transferOwnership(batchId, newOwner);
        await tx.wait();
        showMessage('Ownership transferred successfully!', 'success');
        document.getElementById('transferBatchId').value = '';
        document.getElementById('newOwner').value = '';
        if (document.getElementById('producer-panel').style.display !== 'none') {
            await loadMyBatches('producer');
        }
    } catch (error) {
        if (error.message.includes('You are not the owner')) {
            showMessage('❌ You are not the current owner of this batch. Cannot transfer ownership.', 'error');
        } else if (error.message.includes('Batch already arrived')) {
            showMessage('❌ This batch has already been marked as arrived. Cannot transfer ownership.', 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

function generateQRCode(batchId) {
    const qr = qrcode(0, 'M');
    qr.addData(batchId.toString());
    qr.make();
    
    const canvas = document.getElementById('qrcode');
    const ctx = canvas.getContext('2d');
    const size = 200;
    const moduleCount = qr.getModuleCount();
    const cellSize = size / moduleCount;
    
    canvas.width = size;
    canvas.height = size;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    
    document.getElementById('qr-section').style.display = 'block';
}

async function addSensorData() {
    const batchId = document.getElementById('sensorBatchId').value;
    const temperature = document.getElementById('temperature').value;
    const humidity = document.getElementById('humidity').value;
    const location = document.getElementById('location').value;
    
    try {
        const tx = await contract.addSensorData(batchId, temperature, humidity, location);
        await tx.wait();
        showMessage('Sensor data added successfully!', 'success');
        document.getElementById('sensorBatchId').value = '';
        document.getElementById('temperature').value = '';
        document.getElementById('humidity').value = '';
        document.getElementById('location').value = '';
    } catch (error) {
        if (error.message.includes('Only transporter')) {
            showMessage('❌ You are not registered as a Transporter! Please contact the admin to register your address: ' + userAccount, 'error');
        } else if (error.message.includes('Not current owner')) {
            showMessage('❌ You are not the current owner of this batch. Only the current owner can add sensor data.', 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    }
}

async function transporterTransfer() {
    const batchId = document.getElementById('transporterTransferBatchId').value;
    const newOwner = document.getElementById('transporterDistributorAddress').value;
    
    try {
        const isDistributor = await contract.isDistributor(newOwner);
        if (!isDistributor) {
            showMessage('Error: Recipient must be a registered Distributor! 🏭', 'error');
            return;
        }
        
        const tx = await contract.transferOwnership(batchId, newOwner);
        await tx.wait();
        showMessage('Transferred to distributor successfully!', 'success');
        document.getElementById('transporterTransferBatchId').value = '';
        document.getElementById('transporterDistributorAddress').value = '';
        await loadMyBatches('transporter');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function distributorTransfer() {
    const batchId = document.getElementById('distTransferBatchId').value;
    const newOwner = document.getElementById('retailerTransferAddress').value;
    
    try {
        const isRetailer = await contract.isRetailer(newOwner);
        if (!isRetailer) {
            showMessage('Error: Recipient must be a registered Retailer! 🏪', 'error');
            return;
        }
        
        const tx = await contract.transferOwnership(batchId, newOwner);
        await tx.wait();
        showMessage('Transferred to retailer successfully!', 'success');
        document.getElementById('distTransferBatchId').value = '';
        document.getElementById('retailerTransferAddress').value = '';
        await loadMyBatches('distributor');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function markAsArrived() {
    const batchId = document.getElementById('arrivedBatchId').value;
    const passedInspection = document.getElementById('inspectionResult').value === 'true';
    
    try {
        const tx = await contract.markAsArrived(batchId, passedInspection);
        await tx.wait();
        showMessage('Batch marked as arrived!', 'success');
        document.getElementById('arrivedBatchId').value = '';
        await loadMyBatches('retailer');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

async function viewBatchHistory() {
    const batchId = document.getElementById('viewBatchId').value;
    
    if (!batchId) {
        showMessage('Please enter a Batch ID', 'error');
        return;
    }
    
    try {
        const batch = await contract.getBatchHistory(batchId);
        
        if (!batch[1] || batch[1] === '') {
            showMessage('Batch ID not found. Please check the ID and try again.', 'error');
            document.getElementById('batch-history').style.display = 'none';
            return;
        }
        
        const sensors = await contract.getSensorReadings(batchId);
        
        const isArrived = batch[5];
        const isPassed = batch[6];
        let statusText, statusClass, statusIcon;
        
        if (isArrived && isPassed) {
            statusText = 'DELIVERED';
            statusClass = 'delivered';
            statusIcon = '✓';
        } else if (isArrived && !isPassed) {
            statusText = 'FAILED INSPECTION';
            statusClass = 'failed';
            statusIcon = '✗';
        } else {
            statusText = 'IN TRANSIT';
            statusClass = 'in-transit';
            statusIcon = '🚚';
        }
        
        const headerStatus = document.getElementById('tracking-status');
        headerStatus.innerHTML = `
            <span class="status-icon">${statusIcon}</span>
            <span>${statusText}</span>
        `;
        
        const headerMeta = document.getElementById('tracking-meta');
        const deliveryDate = sensors.length > 0 ? new Date(sensors[sensors.length - 1].timestamp * 1000) : null;
        headerMeta.innerHTML = `
            <strong>Batch ID:</strong> ${batch[0]}
            ${deliveryDate ? ` | <span style="color: #ffd700;">Delivered</span> as on ${formatDate(deliveryDate)}` : ''}
        `;
        
        const currentHolderRole = await getAccountType(batch[4]);
        
        const batchInfo = document.getElementById('batch-info');
        batchInfo.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Product:</span>
                <span class="detail-value">${batch[1]}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${batch[2]} kg</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Producer:</span>
                <span class="detail-value">${batch[3].substring(0, 10)}...${batch[3].substring(38)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Current Holder:</span>
                <span class="detail-value">${currentHolderRole}<br>${batch[4].substring(0, 10)}...${batch[4].substring(38)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge ${statusClass}">${statusIcon} ${statusText}</span></span>
            </div>
        `;
        
        const timeline = document.getElementById('tracking-timeline');
        let timelineEvents = [];
        
        const producerRole = await getAccountType(batch[3]);
        timelineEvents.push({
            type: 'created',
            title: '📦 Batch Created',
            description: `${producerRole}`,
            location: 'Origin',
            address: batch[3],
            timestamp: null,
            completed: true
        });
        
        if (sensors.length > 0) {
            for (let i = 0; i < sensors.length; i++) {
                const s = sensors[i];
                const temp = parseInt(s.temperature);
                const humidity = parseInt(s.humidity);
                const isWarning = temp < -10 || temp > 40;
                
                timelineEvents.push({
                    type: 'sensor',
                    title: i === 0 ? '🚚 Picked up by Transporter' : '🚚 In Transit',
                    description: '🚚 Transporter',
                    location: s.location,
                    temp: temp,
                    humidity: humidity,
                    isWarning: isWarning,
                    timestamp: s.timestamp,
                    completed: true
                });
            }
        }
        
        if (currentHolderRole.includes('Distributor')) {
            timelineEvents.push({
                type: 'transfer',
                title: '🏭 Received by Distributor',
                description: currentHolderRole,
                location: 'Distribution Center',
                address: batch[4],
                timestamp: sensors.length > 0 ? sensors[sensors.length - 1].timestamp : null,
                completed: true
            });
        } else if (currentHolderRole.includes('Retailer')) {
            if (!timelineEvents.some(e => e.description?.includes('Distributor'))) {
                timelineEvents.push({
                    type: 'transfer',
                    title: '🏭 Processed by Distributor',
                    description: '🏭 Distributor',
                    location: 'Distribution Center',
                    timestamp: sensors.length > 0 ? sensors[sensors.length - 1].timestamp : null,
                    completed: true
                });
            }
            
            timelineEvents.push({
                type: 'transfer',
                title: '🏪 Received by Retailer',
                description: currentHolderRole,
                location: 'Retail Store',
                address: batch[4],
                timestamp: sensors.length > 0 ? sensors[sensors.length - 1].timestamp : null,
                completed: true
            });
        }
        
        if (isArrived) {
            timelineEvents.push({
                type: 'delivered',
                title: isPassed ? '✓ Delivered & Inspected' : '✗ Failed Inspection',
                description: isPassed ? 'Product passed quality inspection' : 'Product failed quality inspection',
                location: 'Final Destination',
                timestamp: sensors.length > 0 ? sensors[sensors.length - 1].timestamp : null,
                completed: true,
                isPassed: isPassed
            });
        }
        
        if (timelineEvents.length > 0) {
            const timelineHTML = timelineEvents.reverse().map((event, i) => {
                const date = event.timestamp ? new Date(event.timestamp * 1000) : new Date();
                const dateStr = event.timestamp ? formatDateTime(date) : 'Date not recorded';
                
                if (event.type === 'sensor') {
                    return `
                        <div class="timeline-item">
                            <div class="timeline-dot completed"></div>
                            <div class="timeline-content ${event.isWarning ? 'warning' : ''}">
                                <div class="timeline-title">${event.title}</div>
                                <div class="timeline-location">📍 At ${event.location}</div>
                                <div class="timeline-details">
                                    <div class="timeline-detail">
                                        🌡️ Temp: <span class="temp-reading ${event.isWarning ? 'warning' : 'good'}">${event.temp}°C</span>
                                    </div>
                                    <div class="timeline-detail">
                                        💧 Humidity: <span class="temp-reading good">${event.humidity}%</span>
                                    </div>
                                </div>
                                <div class="timeline-timestamp">${dateStr}</div>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="timeline-item">
                            <div class="timeline-dot ${event.completed ? 'completed' : 'pending'}"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">${event.title}</div>
                                <div class="timeline-location">📍 ${event.location}</div>
                                ${event.description ? `<div style="color: #666; margin-top: 5px;">${event.description}</div>` : ''}
                                ${event.address ? `<div style="font-size: 0.85em; color: #999; margin-top: 5px;">${event.address.substring(0, 10)}...${event.address.substring(38)}</div>` : ''}
                                ${event.timestamp ? `<div class="timeline-timestamp">${dateStr}</div>` : ''}
                            </div>
                        </div>
                    `;
                }
            }).join('');
            
            timeline.innerHTML = timelineHTML;
        } else {
            timeline.innerHTML = '<p class="no-data">No tracking data recorded yet.</p>';
        }
        
        document.getElementById('batch-history').style.display = 'block';
        showMessage('Batch found! 🔍', 'success');
        
    } catch (error) {
        console.error('Error details:', error);
        showMessage('Error loading batch: ' + error.message, 'error');
        document.getElementById('batch-history').style.display = 'none';
    }
}

function formatDateTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${day} ${month} ${year}, ${displayHours}:${minutes} ${ampm}`;
}

function formatDateShort(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${day} ${month} ${year}, ${displayHours}:${minutes} ${ampm}`;
}

async function getAccountType(address) {
    try {
        if (await contract.isProducer(address)) return '🌾 Producer';
        if (await contract.isTransporter(address)) return '🚚 Transporter';
        if (await contract.isDistributor(address)) return '🏭 Distributor';
        if (await contract.isRetailer(address)) return '🏪 Retailer';
        return '👤 Unknown';
    } catch (error) {
        return '👤 Unknown';
    }
}

async function loadMyBatches(role) {
    const containerName = role + '-batches';
    const container = document.getElementById(containerName);
    container.innerHTML = 'Loading...';

    try {
        const userAddress = userAccount.toLowerCase();
        
        let totalBatches = 0;
        try {
            totalBatches = await contract.batchCounter();
            totalBatches = totalBatches.toNumber();
        } catch(e) {
            console.warn("Could not fetch batch counter, defaulting to 20");
            totalBatches = 20;
        }

        const batchPromises = [];
        for (let i = 1; i <= totalBatches; i++) {
            batchPromises.push(contract.getBatchHistory(i));
        }
        
        const rawBatches = await Promise.all(batchPromises);
        
        const validBatches = rawBatches.map(batch => {
            if (batch[4].toLowerCase() === userAddress && batch[1] !== '') {
                let status = "In Transit";
                if (batch[5]) status = batch[6] ? "✅ Accepted" : "❌ Rejected";

                return {
                    id: batch[0].toString(),
                    name: batch[1],
                    quantity: batch[2].toString(),
                    status: status
                };
            }
            return null;
        }).filter(b => b !== null);

        if (validBatches.length === 0) {
            container.innerHTML = '<p class="no-data">No active batches found.</p>';
        } else {
            container.innerHTML = validBatches.map(batch => `
                <div class="batch-card">
                    <div class="batch-header">
                        <h4>📦 Batch #${batch.id}</h4>
                        <span class="status-badge">${batch.status}</span>
                    </div>
                    <p><strong>Product:</strong> ${batch.name}</p>
                    <p><strong>Quantity:</strong> ${batch.quantity} kg</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="error">Error loading batches. See console.</p>';
    }
}