## 🧪 Manual Testing Guide

### 1. Initial Load
- [ ] App loads at http://localhost:5173
- [ ] Welcome screen displays with FreshChain branding
- [ ] "Connect Wallet" button is visible
- [ ] Header shows FreshChain logo and name

### 2. Wallet Connection
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] After connecting, wallet address appears in header
- [ ] Green dot indicator shows "connected" status
- [ ] Disconnect button appears

### 3. Product Gallery (Customer View)
- [ ] Product cards display in responsive grid
  - [ ] 1 column on mobile
  - [ ] 2 columns on tablet
  - [ ] 3 columns on desktop
- [ ] Each product card shows:
  - [ ] Product name
  - [ ] Batch number
  - [ ] Quantity
  - [ ] Producer address (truncated)
  - [ ] Status badge (color-coded)
  - [ ] "View Details" button
- [ ] Hover effects work on cards
- [ ] Loading spinner appears while fetching data
- [ ] Error handling if no products exist

### 4. Batch Details View
- [ ] Click on any product card
- [ ] Batch details page loads
- [ ] "Back to Gallery" button visible and functional
- [ ] Product information displays:
  - [ ] Product name with icon
  - [ ] Batch number
  - [ ] Status badge
  - [ ] Quantity (large, bold)
  - [ ] Producer address (full)
  - [ ] Current owner address
- [ ] Sensor tracking data displays (if available):
  - [ ] Temperature with icon
  - [ ] Humidity with icon
  - [ ] Location with icon
  - [ ] Timestamp
- [ ] QR Code section:
  - [ ] QR code generates successfully
  - [ ] QR code has green border (brand color)
  - [ ] "Download QR Code" button works
  - [ ] Downloaded PNG file is valid

### 5. QR Code Deep Linking
- [ ] Copy batch URL from QR code
- [ ] Open URL in new tab
- [ ] App loads directly to batch details
- [ ] Hash routing works (`/#batch/1`)
- [ ] Back to gallery returns to product grid

### 6. Responsive Design
Test on different screen sizes:
- [ ] Mobile (< 768px)
  - [ ] Single column layout
  - [ ] Navigation accessible
  - [ ] Cards stack vertically
- [ ] Tablet (768px - 1024px)
  - [ ] 2 column grid
  - [ ] Proper spacing
- [ ] Desktop (> 1024px)
  - [ ] 3 column grid
  - [ ] QR code sidebar sticky

### 7. Network Error Handling
- [ ] Disconnect from network
- [ ] Error messages display properly
- [ ] "Try Again" button works
- [ ] Reconnection successful

### 8. Role-Based Access (Advanced)
If you have multiple roles assigned:
- [ ] Admin panel accessible
- [ ] Producer panel accessible
- [ ] Transporter panel accessible
- [ ] Distributor panel accessible
- [ ] Retailer panel accessible
- [ ] Role buttons show only for authorized roles

### 9. UI/UX Quality
- [ ] Animations smooth (fade-in, hover effects)
- [ ] Colors match brand (green #4a7c2f, gold #ffd700)
- [ ] Typography readable
- [ ] Icons render correctly (Lucide React)
- [ ] Buttons have hover states
- [ ] Cards have shadow on hover
- [ ] Status badges color-coded:
  - [ ] Green = Available & Inspected
  - [ ] Gold/Yellow = In Transit
  - [ ] Red = Failed Inspection

### 10. Performance
- [ ] Initial load < 3 seconds
- [ ] Smooth scrolling
- [ ] No layout shifts
- [ ] Images/QR codes load quickly
- [ ] No console errors

---

## 🐛 Known Limitations

1. **Chunk Size Warning**: The build shows a warning about large chunks (579 KB). This is expected for blockchain apps with ethers.js. Can be optimized later with code splitting.

2. **MetaMask Required**: Users need MetaMask installed and connected to the correct network.

3. **Contract Address**: Must be updated in `src/config/contract.ts` to match your deployed contract.

4. **Network Dependency**: App requires active blockchain connection. Offline mode not supported.

---

## 📝 Testing Results

### Browser Compatibility
Test in:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Contract Interactions
- [ ] Can read batch data
- [ ] Can fetch batch counter
- [ ] Can get sensor readings
- [ ] Error handling for non-existent batches
- [ ] Role checking works

---

## 🚀 Production Deployment Checklist

Before deploying to production:
- [ ] Update `CONTRACT_ADDRESS` in `src/config/contract.ts`
- [ ] Test on production blockchain network
- [ ] Run `npm run build` successfully
- [ ] Test built files in `dist/` folder
- [ ] Configure hosting (Vercel, Netlify, GitHub Pages, etc.)
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Test deep linking on production URL
- [ ] Verify QR codes generate correct production URLs

---

## 📊 Test Report Template

**Date:** __________  
**Tester:** __________  
**Environment:** Local / Production  
**Browser:** __________  
**Network:** __________  

### Results
- Total Tests: ___
- Passed: ___
- Failed: ___
- Issues Found: ___

### Issues
1. _______________
2. _______________
3. _______________

### Notes
_______________________________________________
_______________________________________________
