# Wedding Mantra - Complete Wedding Planning App 💑

A beautiful, festive, and feature-rich wedding planning web application designed specifically for traditional Indian weddings. Built with pure HTML, CSS, and JavaScript for simplicity and reliability.

![Wedding Mantra](https://img.shields.io/badge/version-2.0.0-orange) ![PWA Ready](https://img.shields.io/badge/PWA-ready-green) ![Mobile Optimized](https://img.shields.io/badge/mobile-optimized-blue)

## ✨ Features

### 🎊 Ceremony Management
- Add, edit, and delete wedding ceremonies
- Track different ceremony types (Mehendi, Sangeet, Haldi, Wedding, Reception)
- Manage venue details, timings, and guest count
- Built-in checklist for each ceremony
- Budget allocation per ceremony

### 👥 Guest Management  
- Complete RSVP tracking system
- Track guest count per family/group
- Contact information storage
- Special requirements notes
- Status tracking (Confirmed/Pending/Declined)

### 🛍️ Vendor Management
- Track all wedding vendors in one place
- Categorized by service type
- Contact information and pricing
- Booking status tracking
- Budget management per vendor

### 📋 Task Management
- Create and track wedding planning tasks
- Priority levels (High/Medium/Low)
- Due date tracking
- Mark tasks as complete
- Automatic sorting by priority and due date

### 💰 Budget Tracker
- Set total wedding budget
- Automatic calculation of spent amount
- Visual progress indicator
- Budget breakdown by categories
- Remaining budget calculator

### 📱 Mobile Optimized
- Progressive Web App (PWA) support
- Offline functionality
- Installable on mobile devices
- Touch-friendly interface
- Responsive design

### 💾 Data Management
- Automatic saving to browser storage
- Export data as JSON backup
- Import previous backups
- Print functionality
- Clear all data option

## 🚀 Quick Start

### GitHub Pages Deployment

1. Fork or download this repository
2. Create a new GitHub repository
3. Upload all files to your repository
4. Go to Settings → Pages
5. Select "Deploy from branch" 
6. Choose "main" branch and "/ (root)" folder
7. Click Save
8. Your app will be live at `https://[username].github.io/[repository-name]/`

### Local Development

1. Download all files to a folder
2. Open `index.html` in a web browser
3. Start using the app immediately!

## 📁 File Structure

```
wedding-mantra/
│
├── index.html          # Main HTML file
├── app.js             # Application logic
├── manifest.json      # PWA manifest
├── service-worker.js  # Offline functionality
├── README.md          # Documentation
├── icon-192.png       # App icon (192x192)
└── icon-512.png       # App icon (512x512)
```

## 🎨 Creating App Icons

You need to create two PNG icons for the PWA functionality:

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

### Simple Icon Creation:
1. Use any image editor (Canva, Photoshop, GIMP)
2. Create a square canvas
3. Add a heart symbol or wedding-related emoji
4. Use colors: #FF6B35 (orange) or #E91E63 (pink)
5. Export as PNG with transparent background

### Quick Option:
Use an emoji as icon:
- Screenshot the 💑 emoji at large size
- Crop to square
- Resize to needed dimensions
- Save as PNG

## 📱 Installing as Mobile App

### Android:
1. Open the app in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen"
4. Name it and tap "Add"

### iOS:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Name it and tap "Add"

## 💾 Data Backup

### Export Data:
1. Click "Export Data" button
2. Save the JSON file to your device
3. Keep it safe as backup

### Import Data:
1. Click "Import Data" button
2. Select your backup JSON file
3. Confirm to replace existing data

## 🎨 Customization

### Colors:
Edit the CSS variables in `index.html`:
```css
:root {
    --primary: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    --gold: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
    /* Add your colors */
}
```

### Features:
- Edit sample data in `app.js` → `addSampleData()` function
- Modify form fields in form template functions
- Add new ceremony types in the select options

## 🔒 Privacy & Security

- All data stored locally in browser
- No server or internet connection required
- Data never leaves your device
- Completely private and secure

## 🐛 Troubleshooting

### Data not saving?
- Check browser storage settings
- Clear browser cache
- Try incognito/private mode
- Check available storage space

### App not installing?
- Ensure HTTPS connection (GitHub Pages provides this)
- Clear browser cache
- Try different browser
- Check if service worker is registered

### Icons not showing?
- Create and upload icon files
- Check file names match exactly
- Clear cache and reload

## 📋 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Samsung Internet
- ✅ Opera

## 🚀 Future Enhancements

Potential features for future versions:
- Photo gallery for ceremonies
- Seating arrangement planner
- Guest dietary preferences
- Vendor contract uploads
- Timeline/schedule view
- Multi-language support
- Cloud backup option
- Invitation designer

## 💝 Credits

Created with love for couples planning their special day!

## 📜 License

Free to use for personal wedding planning. Share with friends and family!

## 💬 Support

For issues or suggestions:
1. Check this README
2. Try clearing cache and reloading
3. Test in different browser
4. Create an issue on GitHub

---

**May your wedding planning be smooth and your marriage be blessed! 🎊💑✨**
