// Wedding Mantra - Main Application Logic
// Version 2.0.0

class WeddingPlanner {
    constructor() {
        this.data = {
            ceremonies: [],
            guests: [],
            vendors: [],
            tasks: [],
            budget: {
                total: 0,
                spent: 0
            }
        };
        this.currentEditId = null;
        this.currentEditType = null;
        this.init();
    }

    // Initialize the app
    init() {
        this.loadData();
        this.renderAll();
        this.updateStats();
        this.setupAutoSave();
        this.setupServiceWorker();
        
        // Add sample data if empty
        if (this.isFirstTime()) {
            this.addSampleData();
        }
    }

    // Check if it's first time
    isFirstTime() {
        return this.data.ceremonies.length === 0 && 
               this.data.guests.length === 0 && 
               this.data.vendors.length === 0 &&
               this.data.tasks.length === 0;
    }

    // Setup service worker for offline functionality
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed'));
        }
    }

    // Setup auto-save
    setupAutoSave() {
        // Save data every 30 seconds
        setInterval(() => {
            this.saveData(false);
        }, 30000);

        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveData(false);
        });
    }

    // Load data from localStorage
    loadData() {
        try {
            const saved = localStorage.getItem('weddingMantraData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with default structure to ensure all fields exist
                this.data = {
                    ceremonies: parsed.ceremonies || [],
                    guests: parsed.guests || [],
                    vendors: parsed.vendors || [],
                    tasks: parsed.tasks || [],
                    budget: parsed.budget || { total: 0, spent: 0 }
                };
            }
        } catch (e) {
            console.error('Error loading data:', e);
            this.showNotification('Error loading data. Starting fresh.', 'error');
        }
    }

    // Save data to localStorage
    saveData(showIndicator = true) {
        try {
            localStorage.setItem('weddingMantraData', JSON.stringify(this.data));
            if (showIndicator) {
                this.showSaveIndicator();
            }
        } catch (e) {
            console.error('Error saving data:', e);
            this.showNotification('Error saving data. Storage may be full.', 'error');
        }
    }

    // Show save indicator
    showSaveIndicator() {
        const existing = document.querySelector('.save-indicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.innerHTML = '✅ Saved Successfully';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 2000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `save-indicator ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Add sample data for first-time users
    addSampleData() {
        this.data.ceremonies = [
            {
                id: this.generateId(),
                name: 'Mehendi Ceremony',
                type: 'mehendi',
                date: this.getDateAfterDays(60),
                time: '16:00',
                venue: 'Garden Lawn, Grand Palace Hotel',
                guests: 80,
                budget: 50000,
                checklist: [
                    { text: 'Book mehendi artist', done: true },
                    { text: 'Arrange seating for guests', done: false },
                    { text: 'Order refreshments', done: false },
                    { text: 'Prepare music playlist', done: false }
                ]
            },
            {
                id: this.generateId(),
                name: 'Sangeet Night',
                type: 'sangeet',
                date: this.getDateAfterDays(60),
                time: '19:00',
                venue: 'Banquet Hall, Grand Palace Hotel',
                guests: 120,
                budget: 100000,
                checklist: [
                    { text: 'Choreograph dance performances', done: false },
                    { text: 'Sound system setup', done: false },
                    { text: 'Stage decoration', done: false },
                    { text: 'Arrange dinner', done: false }
                ]
            }
        ];

        this.data.guests = [
            {
                id: this.generateId(),
                name: 'Sharma Family',
                members: 4,
                email: 'sharma@example.com',
                phone: '+91 98765 43210',
                status: 'confirmed',
                requirements: 'Vegetarian food only'
            },
            {
                id: this.generateId(),
                name: 'Mr. & Mrs. Gupta',
                members: 2,
                email: 'gupta@example.com',
                phone: '+91 98765 43211',
                status: 'pending',
                requirements: ''
            }
        ];

        this.data.vendors = [
            {
                id: this.generateId(),
                name: 'Raj Photography',
                type: 'photographer',
                contact: 'Raj Kumar',
                phone: '+91 98765 00001',
                email: 'raj@photography.com',
                price: 150000,
                status: 'booked'
            },
            {
                id: this.generateId(),
                name: 'Royal Caterers',
                type: 'catering',
                contact: 'Mr. Singh',
                phone: '+91 98765 00002',
                email: 'info@royalcaterers.com',
                price: 500000,
                status: 'negotiating'
            }
        ];

        this.data.tasks = [
            {
                id: this.generateId(),
                title: 'Book Wedding Venue',
                description: 'Finalize and book the main wedding venue',
                dueDate: this.getDateAfterDays(15),
                priority: 'high',
                completed: false
            },
            {
                id: this.generateId(),
                title: 'Send Invitations',
                description: 'Design and send wedding invitations to all guests',
                dueDate: this.getDateAfterDays(30),
                priority: 'medium',
                completed: false
            }
        ];

        this.data.budget = {
            total: 2500000,
            spent: 0
        };

        this.saveData();
        this.renderAll();
        this.updateStats();
    }

    // Helper function to get date after certain days
    getDateAfterDays(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    // Generate unique ID
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // CRUD Operations for Ceremonies
    addCeremony(ceremony) {
        ceremony.id = this.generateId();
        ceremony.checklist = ceremony.checklist || [];
        this.data.ceremonies.push(ceremony);
        this.saveData();
        this.renderCeremonies();
        this.updateStats();
    }

    editCeremony(id, updatedCeremony) {
        const index = this.data.ceremonies.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.ceremonies[index] = { 
                ...this.data.ceremonies[index], 
                ...updatedCeremony,
                id: id // Preserve the ID
            };
            this.saveData();
            this.renderCeremonies();
            this.updateStats();
        }
    }

    deleteCeremony(id) {
        this.data.ceremonies = this.data.ceremonies.filter(c => c.id !== id);
        this.saveData();
        this.renderCeremonies();
        this.updateStats();
    }

    toggleChecklistItem(ceremonyId, itemIndex) {
        const ceremony = this.data.ceremonies.find(c => c.id === ceremonyId);
        if (ceremony && ceremony.checklist && ceremony.checklist[itemIndex]) {
            ceremony.checklist[itemIndex].done = !ceremony.checklist[itemIndex].done;
            this.saveData();
        }
    }

    // CRUD Operations for Guests
    addGuest(guest) {
        guest.id = this.generateId();
        this.data.guests.push(guest);
        this.saveData();
        this.renderGuests();
        this.updateStats();
    }

    editGuest(id, updatedGuest) {
        const index = this.data.guests.findIndex(g => g.id === id);
        if (index !== -1) {
            this.data.guests[index] = { 
                ...this.data.guests[index], 
                ...updatedGuest,
                id: id
            };
            this.saveData();
            this.renderGuests();
            this.updateStats();
        }
    }

    deleteGuest(id) {
        this.data.guests = this.data.guests.filter(g => g.id !== id);
        this.saveData();
        this.renderGuests();
        this.updateStats();
    }

    // CRUD Operations for Vendors
    addVendor(vendor) {
        vendor.id = this.generateId();
        this.data.vendors.push(vendor);
        this.saveData();
        this.renderVendors();
        this.updateStats();
    }

    editVendor(id, updatedVendor) {
        const index = this.data.vendors.findIndex(v => v.id === id);
        if (index !== -1) {
            this.data.vendors[index] = { 
                ...this.data.vendors[index], 
                ...updatedVendor,
                id: id
            };
            this.saveData();
            this.renderVendors();
            this.updateStats();
        }
    }

    deleteVendor(id) {
        this.data.vendors = this.data.vendors.filter(v => v.id !== id);
        this.saveData();
        this.renderVendors();
        this.updateStats();
    }

    // CRUD Operations for Tasks
    addTask(task) {
        task.id = this.generateId();
        task.completed = false;
        this.data.tasks.push(task);
        this.saveData();
        this.renderTasks();
        this.updateStats();
    }

    editTask(id, updatedTask) {
        const index = this.data.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.data.tasks[index] = { 
                ...this.data.tasks[index], 
                ...updatedTask,
                id: id
            };
            this.saveData();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== id);
        this.saveData();
        this.renderTasks();
        this.updateStats();
    }

    toggleTask(id) {
        const task = this.data.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderTasks();
            this.updateStats();
        }
    }

    // Update budget
    updateBudget(budget) {
        this.data.budget = budget;
        this.saveData();
        this.updateBudgetDisplay();
    }

    // Render all components
    renderAll() {
        this.renderCeremonies();
        this.renderGuests();
        this.renderVendors();
        this.renderTasks();
        this.updateBudgetDisplay();
    }

    // Render ceremonies
    renderCeremonies() {
        const grid = document.getElementById('ceremonyGrid');
        if (!grid) return;
        
        if (this.data.ceremonies.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">🎊</div>
                    <div class="empty-state-text">No ceremonies added yet</div>
                    <button class="btn-add" onclick="openModal('ceremony')">Add Your First Ceremony</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.data.ceremonies.map(ceremony => `
            <div class="ceremony-card">
                <div class="card-actions">
                    <button class="btn-edit" onclick="editItem('ceremony', '${ceremony.id}')" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteItem('ceremony', '${ceremony.id}')" title="Delete">🗑️</button>
                </div>
                <div class="ceremony-header ${ceremony.type}">
                    <div class="guest-count">👥 ${ceremony.guests} guests</div>
                    <div class="ceremony-name">${this.escapeHtml(ceremony.name)}</div>
                    <div class="ceremony-type">${ceremony.type.charAt(0).toUpperCase() + ceremony.type.slice(1)}</div>
                </div>
                <div class="ceremony-body">
                    <div class="ceremony-info">
                        <div class="info-item">
                            <span>📅</span>
                            <span>${ceremony.date}</span>
                        </div>
                        <div class="info-item">
                            <span>⏰</span>
                            <span>${ceremony.time}</span>
                        </div>
                        <div class="info-item">
                            <span>📍</span>
                            <span>${this.escapeHtml(ceremony.venue)}</span>
                        </div>
                    </div>
                    <div class="budget-info">
                        <div class="budget-label">Budget:</div>
                        <div class="budget-amount">₹${ceremony.budget.toLocaleString('en-IN')}</div>
                    </div>
                    ${ceremony.checklist && ceremony.checklist.length > 0 ? `
                        <div class="checklist">
                            <div class="checklist-title">✨ Checklist</div>
                            ${ceremony.checklist.map((item, index) => `
                                <div class="checklist-item">
                                    <input type="checkbox" 
                                        id="check-${ceremony.id}-${index}" 
                                        ${item.done ? 'checked' : ''}
                                        onchange="planner.toggleChecklistItem('${ceremony.id}', ${index})">
                                    <label for="check-${ceremony.id}-${index}">${this.escapeHtml(item.text)}</label>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Render guests
    renderGuests() {
        const list = document.getElementById('guestsList');
        if (!list) return;
        
        if (this.data.guests.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <div class="empty-state-text">No guests added yet</div>
                    <button class="btn-add" onclick="openModal('guest')">Add Your First Guest</button>
                </div>
            `;
            return;
        }

        list.innerHTML = this.data.guests.map(guest => `
            <div class="guest-item">
                <div>
                    <div class="guest-name">${this.escapeHtml(guest.name)}</div>
                    <div class="guest-details">
                        <span>👥 ${guest.members} members</span>
                        ${guest.email ? `<span>📧 ${this.escapeHtml(guest.email)}</span>` : ''}
                        ${guest.phone ? `<span>📱 ${this.escapeHtml(guest.phone)}</span>` : ''}
                        ${guest.requirements ? `<span>📝 ${this.escapeHtml(guest.requirements)}</span>` : ''}
                    </div>
                </div>
                <div class="guest-actions">
                    <span class="guest-status status-${guest.status}">${guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}</span>
                    <button class="btn-edit" onclick="editItem('guest', '${guest.id}')" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteItem('guest', '${guest.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    // Render vendors
    renderVendors() {
        const grid = document.getElementById('vendorGrid');
        if (!grid) return;
        
        if (this.data.vendors.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">🛍️</div>
                    <div class="empty-state-text">No vendors added yet</div>
                    <button class="btn-add" onclick="openModal('vendor')">Add Your First Vendor</button>
                </div>
            `;
            return;
        }

        const vendorIcons = {
            photographer: '📸',
            videographer: '🎥',
            catering: '🍽️',
            decoration: '🌸',
            makeup: '💄',
            music: '🎵',
            transportation: '🚗',
            other: '📦'
        };

        grid.innerHTML = this.data.vendors.map(vendor => `
            <div class="vendor-card">
                <div class="card-actions">
                    <button class="btn-edit" onclick="editItem('vendor', '${vendor.id}')" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteItem('vendor', '${vendor.id}')" title="Delete">🗑️</button>
                </div>
                <div class="vendor-icon">${vendorIcons[vendor.type] || '📦'}</div>
                <div class="vendor-name">${this.escapeHtml(vendor.name)}</div>
                <div class="vendor-type">${vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}</div>
                <div class="vendor-price">₹${vendor.price.toLocaleString('en-IN')}</div>
                <span class="vendor-status status-${vendor.status}">${vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</span>
            </div>
        `).join('');
    }

    // Render tasks
    renderTasks() {
        const list = document.getElementById('tasksList');
        if (!list) return;
        
        if (!this.data.tasks || this.data.tasks.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">No tasks added yet</div>
                    <button class="btn-add" onclick="openModal('task')">Add Your First Task</button>
                </div>
            `;
            return;
        }

        // Sort tasks by due date and completion status
        const sortedTasks = [...this.data.tasks].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        list.innerHTML = sortedTasks.map(task => `
            <div class="task-item priority-${task.priority}" style="${task.completed ? 'opacity: 0.6;' : ''}">
                <div class="task-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" 
                            ${task.completed ? 'checked' : ''}
                            onchange="planner.toggleTask('${task.id}')"
                            style="width: 20px; height: 20px; cursor: pointer; accent-color: #FF6B35;">
                        <span class="task-title" style="${task.completed ? 'text-decoration: line-through;' : ''}">${this.escapeHtml(task.title)}</span>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="task-priority priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        <button class="btn-edit" onclick="editItem('task', '${task.id}')" title="Edit">✏️</button>
                        <button class="btn-delete" onclick="deleteItem('task', '${task.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                <div class="task-due">📅 Due: ${new Date(task.dueDate).toLocaleDateString('en-IN')}</div>
            </div>
        `).join('');
    }

    // Update statistics
    updateStats() {
        // Calculate total guests
        const totalGuests = this.data.guests.reduce((sum, guest) => sum + (parseInt(guest.members) || 0), 0);
        const confirmedGuests = this.data.guests
            .filter(g => g.status === 'confirmed')
            .reduce((sum, guest) => sum + (parseInt(guest.members) || 0), 0);
        
        // Calculate pending tasks
        const pendingTasks = this.data.tasks ? this.data.tasks.filter(t => !t.completed).length : 0;
        
        // Update stat cards
        document.getElementById('totalGuests').textContent = totalGuests;
        document.getElementById('confirmedGuests').textContent = confirmedGuests;
        document.getElementById('totalCeremonies').textContent = this.data.ceremonies.length;
        document.getElementById('totalVendors').textContent = this.data.vendors.length;
        document.getElementById('totalTasks').textContent = pendingTasks;
    }

    // Update budget display
    updateBudgetDisplay() {
        const totalBudget = parseInt(this.data.budget.total) || 0;
        const spentBudget = this.calculateSpentBudget();
        const remainingBudget = totalBudget - spentBudget;
        const percentage = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

        document.getElementById('totalBudget').textContent = `₹${totalBudget.toLocaleString('en-IN')}`;
        document.getElementById('spentBudget').textContent = `₹${spentBudget.toLocaleString('en-IN')}`;
        document.getElementById('remainingBudget').textContent = `₹${remainingBudget.toLocaleString('en-IN')}`;
        
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        progressFill.textContent = `${percentage}%`;
        
        // Change color based on percentage
        if (percentage > 100) {
            progressFill.style.background = 'linear-gradient(135deg, #f44336 0%, #e57373 100%)';
        } else if (percentage > 80) {
            progressFill.style.background = 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
        } else {
            progressFill.style.background = 'var(--primary)';
        }

        // Show budget breakdown
        const breakdown = document.getElementById('budgetBreakdown');
        const ceremonyBudget = this.data.ceremonies.reduce((sum, c) => sum + (parseInt(c.budget) || 0), 0);
        const vendorBudget = this.data.vendors
            .filter(v => v.status === 'booked')
            .reduce((sum, v) => sum + (parseInt(v.price) || 0), 0);
        
        breakdown.innerHTML = `
            <div style="display: grid; gap: 10px;">
                <div style="padding: 15px; background: #f9f9f9; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>🎊 Ceremonies Budget:</span>
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">₹${ceremonyBudget.toLocaleString('en-IN')}</strong>
                </div>
                <div style="padding: 15px; background: #f9f9f9; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>🛍️ Booked Vendors:</span>
                    <strong style="color: var(--text-primary); font-size: 1.1rem;">₹${vendorBudget.toLocaleString('en-IN')}</strong>
                </div>
                <div style="padding: 15px; background: #FFF3E0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>💰 Total Committed:</span>
                    <strong style="color: #E65100; font-size: 1.1rem;">₹${spentBudget.toLocaleString('en-IN')}</strong>
                </div>
            </div>
        `;
    }

    // Calculate spent budget
    calculateSpentBudget() {
        const ceremonyBudget = this.data.ceremonies.reduce((sum, c) => sum + (parseInt(c.budget) || 0), 0);
        const vendorBudget = this.data.vendors
            .filter(v => v.status === 'booked')
            .reduce((sum, v) => sum + (parseInt(v.price) || 0), 0);
        return ceremonyBudget + vendorBudget;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the planner
let planner;
document.addEventListener('DOMContentLoaded', () => {
    planner = new WeddingPlanner();
});

// Global functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update tab styling
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function openModal(type, editData = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    planner.currentEditType = type;
    planner.currentEditId = editData ? editData.id : null;
    
    switch(type) {
        case 'ceremony':
            modalTitle.textContent = editData ? 'Edit Ceremony' : 'Add New Ceremony';
            modalBody.innerHTML = getCeremonyForm(editData);
            break;
        case 'guest':
            modalTitle.textContent = editData ? 'Edit Guest' : 'Add New Guest';
            modalBody.innerHTML = getGuestForm(editData);
            break;
        case 'vendor':
            modalTitle.textContent = editData ? 'Edit Vendor' : 'Add New Vendor';
            modalBody.innerHTML = getVendorForm(editData);
            break;
        case 'task':
            modalTitle.textContent = editData ? 'Edit Task' : 'Add New Task';
            modalBody.innerHTML = getTaskForm(editData);
            break;
        case 'budget':
            modalTitle.textContent = 'Set Wedding Budget';
            modalBody.innerHTML = getBudgetForm();
            break;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    planner.currentEditId = null;
    planner.currentEditType = null;
}

function editItem(type, id) {
    let item;
    switch(type) {
        case 'ceremony':
            item = planner.data.ceremonies.find(c => c.id === id);
            break;
        case 'guest':
            item = planner.data.guests.find(g => g.id === id);
            break;
        case 'vendor':
            item = planner.data.vendors.find(v => v.id === id);
            break;
        case 'task':
            item = planner.data.tasks.find(t => t.id === id);
            break;
    }
    
    if (item) {
        openModal(type, item);
    }
}

function deleteItem(type, id) {
    const confirmMessage = `Are you sure you want to delete this ${type}? This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        switch(type) {
            case 'ceremony':
                planner.deleteCeremony(id);
                break;
            case 'guest':
                planner.deleteGuest(id);
                break;
            case 'vendor':
                planner.deleteVendor(id);
                break;
            case 'task':
                planner.deleteTask(id);
                break;
        }
        planner.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Convert numeric fields
    if (data.guests) data.guests = parseInt(data.guests) || 0;
    if (data.budget) data.budget = parseInt(data.budget) || 0;
    if (data.members) data.members = parseInt(data.members) || 0;
    if (data.price) data.price = parseInt(data.price) || 0;
    if (data.total) data.total = parseInt(data.total) || 0;
    
    // Handle checklist for ceremonies
    if (planner.currentEditType === 'ceremony') {
        const checklistItems = document.querySelectorAll('#checklistItems input');
        data.checklist = Array.from(checklistItems)
            .map(input => ({
                text: input.value.trim(),
                done: false
            }))
            .filter(item => item.text);
        
        // Preserve existing checklist status if editing
        if (planner.currentEditId) {
            const existing = planner.data.ceremonies.find(c => c.id === planner.currentEditId);
            if (existing && existing.checklist) {
                data.checklist = data.checklist.map((item, index) => ({
                    ...item,
                    done: existing.checklist[index] ? existing.checklist[index].done : false
                }));
            }
        }
    }
    
    // Save data based on type
    if (planner.currentEditId) {
        // Edit existing
        switch(planner.currentEditType) {
            case 'ceremony':
                planner.editCeremony(planner.currentEditId, data);
                break;
            case 'guest':
                planner.editGuest(planner.currentEditId, data);
                break;
            case 'vendor':
                planner.editVendor(planner.currentEditId, data);
                break;
            case 'task':
                planner.editTask(planner.currentEditId, data);
                break;
        }
        planner.showNotification(`${planner.currentEditType.charAt(0).toUpperCase() + planner.currentEditType.slice(1)} updated successfully!`, 'success');
    } else {
        // Add new
        switch(planner.currentEditType) {
            case 'ceremony':
                planner.addCeremony(data);
                break;
            case 'guest':
                planner.addGuest(data);
                break;
            case 'vendor':
                planner.addVendor(data);
                break;
            case 'task':
                planner.addTask(data);
                break;
            case 'budget':
                planner.updateBudget(data);
                break;
        }
        planner.showNotification(`${planner.currentEditType.charAt(0).toUpperCase() + planner.currentEditType.slice(1)} added successfully!`, 'success');
    }
    
    closeModal();
}

// Form Templates
function getCeremonyForm(data = {}) {
    const today = new Date().toISOString().split('T')[0];
    return `
        <div class="form-group">
            <label>Ceremony Name *</label>
            <input type="text" name="name" required value="${data.name || ''}" 
                   placeholder="e.g., Mehendi Ceremony" maxlength="50">
        </div>
        <div class="form-group">
            <label>Ceremony Type *</label>
            <select name="type" required>
                <option value="">Select Type</option>
                <option value="mehendi" ${data.type === 'mehendi' ? 'selected' : ''}>🎨 Mehendi</option>
                <option value="sangeet" ${data.type === 'sangeet' ? 'selected' : ''}>🎵 Sangeet</option>
                <option value="haldi" ${data.type === 'haldi' ? 'selected' : ''}>🌻 Haldi</option>
                <option value="wedding" ${data.type === 'wedding' ? 'selected' : ''}>💑 Wedding</option>
                <option value="reception" ${data.type === 'reception' ? 'selected' : ''}>🎉 Reception</option>
                <option value="other" ${data.type === 'other' ? 'selected' : ''}>✨ Other</option>
            </select>
        </div>
        <div class="form-group">
            <label>Date *</label>
            <input type="date" name="date" required value="${data.date || ''}" min="${today}">
        </div>
        <div class="form-group">
            <label>Time *</label>
            <input type="time" name="time" required value="${data.time || ''}">
        </div>
        <div class="form-group">
            <label>Venue *</label>
            <input type="text" name="venue" required value="${data.venue || ''}" 
                   placeholder="e.g., Grand Palace Hotel" maxlength="100">
        </div>
        <div class="form-group">
            <label>Expected Guests *</label>
            <input type="number" name="guests" required value="${data.guests || ''}" 
                   placeholder="e.g., 100" min="1" max="10000">
        </div>
        <div class="form-group">
            <label>Budget (₹) *</label>
            <input type="number" name="budget" required value="${data.budget || ''}" 
                   placeholder="e.g., 50000" min="0" max="10000000">
        </div>
        <div class="form-group">
            <label>Checklist Items (one per line)</label>
            <div id="checklistItems">
                ${data.checklist && data.checklist.length > 0 
                    ? data.checklist.map(item => `
                        <input type="text" value="${item.text}" style="margin-bottom: 8px;" 
                               placeholder="Task item" maxlength="100">
                    `).join('')
                    : '<input type="text" style="margin-bottom: 8px;" placeholder="Task item" maxlength="100">'
                }
            </div>
            <button type="button" onclick="addChecklistInput()" class="btn btn-secondary" style="margin-top: 10px;">
                + Add Item
            </button>
        </div>
    `;
}

function getGuestForm(data = {}) {
    return `
        <div class="form-group">
            <label>Guest Name *</label>
            <input type="text" name="name" required value="${data.name || ''}" 
                   placeholder="e.g., Sharma Family" maxlength="50">
        </div>
        <div class="form-group">
            <label>Number of Members *</label>
            <input type="number" name="members" required value="${data.members || ''}" 
                   placeholder="e.g., 4" min="1" max="100">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${data.email || ''}" 
                   placeholder="guest@example.com" maxlength="100">
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value="${data.phone || ''}" 
                   placeholder="+91 98765 43210" maxlength="20">
        </div>
        <div class="form-group">
            <label>RSVP Status *</label>
            <select name="status" required>
                <option value="pending" ${data.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="confirmed" ${data.status === 'confirmed' ? 'selected' : ''}>✅ Confirmed</option>
                <option value="declined" ${data.status === 'declined' ? 'selected' : ''}>❌ Declined</option>
            </select>
        </div>
        <div class="form-group">
            <label>Special Requirements</label>
            <textarea name="requirements" rows="3" 
                      placeholder="e.g., Vegetarian food, Wheelchair access" 
                      maxlength="200">${data.requirements || ''}</textarea>
        </div>
    `;
}

function getVendorForm(data = {}) {
    return `
        <div class="form-group">
            <label>Vendor Name *</label>
            <input type="text" name="name" required value="${data.name || ''}" 
                   placeholder="e.g., Raj Photography" maxlength="50">
        </div>
        <div class="form-group">
            <label>Service Type *</label>
            <select name="type" required>
                <option value="">Select Service</option>
                <option value="photographer" ${data.type === 'photographer' ? 'selected' : ''}>📸 Photographer</option>
                <option value="videographer" ${data.type === 'videographer' ? 'selected' : ''}>🎥 Videographer</option>
                <option value="catering" ${data.type === 'catering' ? 'selected' : ''}>🍽️ Catering</option>
                <option value="decoration" ${data.type === 'decoration' ? 'selected' : ''}>🌸 Decoration</option>
                <option value="makeup" ${data.type === 'makeup' ? 'selected' : ''}>💄 Makeup Artist</option>
                <option value="music" ${data.type === 'music' ? 'selected' : ''}>🎵 DJ/Music</option>
                <option value="transportation" ${data.type === 'transportation' ? 'selected' : ''}>🚗 Transportation</option>
                <option value="other" ${data.type === 'other' ? 'selected' : ''}>📦 Other</option>
            </select>
        </div>
        <div class="form-group">
            <label>Contact Person</label>
            <input type="text" name="contact" value="${data.contact || ''}" 
                   placeholder="Contact person name" maxlength="50">
        </div>
        <div class="form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" required value="${data.phone || ''}" 
                   placeholder="+91 98765 43210" maxlength="20">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${data.email || ''}" 
                   placeholder="vendor@example.com" maxlength="100">
        </div>
        <div class="form-group">
            <label>Quote (₹) *</label>
            <input type="number" name="price" required value="${data.price || ''}" 
                   placeholder="e.g., 150000" min="0" max="10000000">
        </div>
        <div class="form-group">
            <label>Status *</label>
            <select name="status" required>
                <option value="negotiating" ${data.status === 'negotiating' ? 'selected' : ''}>💬 Negotiating</option>
                <option value="booked" ${data.status === 'booked' ? 'selected' : ''}>✅ Booked</option>
                <option value="cancelled" ${data.status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
        </div>
    `;
}

function getTaskForm(data = {}) {
    const today = new Date().toISOString().split('T')[0];
    return `
        <div class="form-group">
            <label>Task Title *</label>
            <input type="text" name="title" required value="${data.title || ''}" 
                   placeholder="e.g., Book Wedding Venue" maxlength="100">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" 
                      placeholder="Task details..." 
                      maxlength="500">${data.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Due Date *</label>
            <input type="date" name="dueDate" required value="${data.dueDate || ''}" min="${today}">
        </div>
        <div class="form-group">
            <label>Priority *</label>
            <select name="priority" required>
                <option value="low" ${data.priority === 'low' ? 'selected' : ''}>🟢 Low</option>
                <option value="medium" ${data.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
                <option value="high" ${data.priority === 'high' ? 'selected' : ''}>🔴 High</option>
            </select>
        </div>
    `;
}

function getBudgetForm() {
    return `
        <div class="form-group">
            <label>Total Wedding Budget (₹) *</label>
            <input type="number" name="total" required value="${planner.data.budget.total || ''}" 
                   placeholder="e.g., 2500000" min="0" max="100000000">
        </div>
        <div style="background: #FFF3E0; padding: 15px; border-radius: 10px; margin-top: 15px;">
            <p style="color: #E65100; font-size: 0.9rem; margin: 0;">
                💡 <strong>Tip:</strong> The spent amount will be calculated automatically based on your ceremony budgets and booked vendor prices.
            </p>
        </div>
    `;
}

function addChecklistInput() {
    const checklistDiv = document.getElementById('checklistItems');
    const input = document.createElement('input');
    input.type = 'text';
    input.style.marginBottom = '8px';
    input.placeholder = 'Task item';
    input.maxLength = 100;
    checklistDiv.appendChild(input);
}

// Export data functionality
function exportData() {
    try {
        const dataStr = JSON.stringify(planner.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wedding-mantra-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        planner.showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        planner.showNotification('Error exporting data', 'error');
    }
}

// Import data functionality
function importData(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.ceremonies || !data.guests || !data.vendors) {
                throw new Error('Invalid data format');
            }
            
            if (confirm('This will replace all existing data. Are you sure you want to continue?')) {
                planner.data = data;
                planner.saveData();
                planner.renderAll();
                planner.updateStats();
                planner.showNotification('Data imported successfully!', 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            planner.showNotification('Error importing data. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Clear the input value so the same file can be imported again
    document.getElementById('importFile').value = '';
}

// Clear all data
function clearAllData() {
    const confirmFirst = confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone.');
    
    if (confirmFirst) {
        const confirmSecond = confirm('🚨 This will delete ALL your wedding planning data permanently. Are you absolutely sure?');
        
        if (confirmSecond) {
            planner.data = {
                ceremonies: [],
                guests: [],
                vendors: [],
                tasks: [],
                budget: {
                    total: 0,
                    spent: 0
                }
            };
            planner.saveData();
            planner.renderAll();
            planner.updateStats();
            planner.showNotification('All data has been cleared', 'success');
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Save with Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        planner.saveData();
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    const modal = document.getElementById('modal');
    if (modal && modal.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('💑 Wedding Mantra initialized successfully!');
console.log('✨ May your wedding planning be smooth and joyful!');
