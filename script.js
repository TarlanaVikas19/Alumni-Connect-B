// Gaming Alumni Platform JavaScript

// Global State
let currentUser = null;
let currentPage = 'dashboard';
let isEditingProfile = false;
let sidebarOpen = false;

// Mock Data
const mockUsers = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'alumni',
        graduationYear: 2019,
        department: 'Computer Science',
        degree: 'Bachelor of Science',
        currentJobTitle: 'Senior Software Engineer',
        company: 'Google',
        industry: 'Technology',
        location: 'San Francisco, CA',
        bio: 'Passionate about AI and machine learning. Always happy to help new graduates.',
        isAvailableForMentorship: true,
        privacySettings: { showEmail: true, showPhone: false, showLocation: true },
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'alumni',
        graduationYear: 2018,
        department: 'Business Administration',
        degree: 'Master of Business Administration',
        currentJobTitle: 'Product Manager',
        company: 'Microsoft',
        industry: 'Technology',
        location: 'Seattle, WA',
        bio: 'Love building products that make a difference. Open to mentoring students.',
        isAvailableForMentorship: true,
        privacySettings: { showEmail: false, showPhone: false, showLocation: true },
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        role: 'student',
        yearOfStudy: 4,
        major: 'Computer Science',
        department: 'Engineering',
        location: 'Boston, MA',
        bio: 'Final year student looking for opportunities in tech.',
        privacySettings: { showEmail: true, showPhone: false, showLocation: true },
        createdAt: '2024-01-01T00:00:00Z'
    }
];

const mockEvents = [
    {
        id: '1',
        title: 'Annual Alumni Reunion',
        description: 'Join us for our annual reunion celebrating the Class of 2019. Food, drinks, and networking opportunities.',
        date: '2025-02-15',
        time: '18:00',
        location: 'University Main Hall',
        isVirtual: false,
        organizer: 'Alumni Office',
        attendees: ['1', '2', '3'],
        maxAttendees: 100,
        createdAt: '2024-12-01T00:00:00Z'
    },
    {
        id: '2',
        title: 'Tech Career Workshop',
        description: 'Learn about the latest trends in technology and how to advance your career in tech.',
        date: '2025-01-28',
        time: '14:00',
        location: 'Virtual Event',
        isVirtual: true,
        organizer: 'Career Services',
        attendees: ['2', '4', '5', '6'],
        registrationUrl: 'https://zoom.us/meeting',
        createdAt: '2024-12-10T00:00:00Z'
    },
    {
        id: '3',
        title: 'Networking Mixer',
        description: 'Connect with fellow alumni and current students in a relaxed setting.',
        date: '2025-03-10',
        time: '19:00',
        location: 'Downtown Convention Center',
        isVirtual: false,
        organizer: 'Alumni Association',
        attendees: ['1', '3', '7'],
        maxAttendees: 50,
        createdAt: '2024-12-15T00:00:00Z'
    }
];

const mockCampaigns = [
    {
        id: '1',
        title: 'Student Scholarship Fund',
        description: 'Help provide scholarships to deserving students who need financial assistance to pursue their education.',
        goalAmount: 50000,
        currentAmount: 32000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isActive: true,
        createdBy: 'admin'
    },
    {
        id: '2',
        title: 'New Library Construction',
        description: 'Support the construction of a new state-of-the-art library facility for our growing student body.',
        goalAmount: 200000,
        currentAmount: 75000,
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        isActive: true,
        createdBy: 'admin'
    },
    {
        id: '3',
        title: 'Technology Lab Upgrade',
        description: 'Modernize our computer labs with the latest technology to enhance student learning experience.',
        goalAmount: 25000,
        currentAmount: 18000,
        startDate: '2024-09-01',
        endDate: '2025-06-01',
        isActive: true,
        createdBy: 'admin'
    }
];

const mockDonations = [
    {
        id: '1',
        campaignId: '1',
        donorId: '1',
        donorName: 'John Smith',
        amount: 500,
        isAnonymous: false,
        message: 'Happy to support future students!',
        timestamp: '2025-01-10T10:00:00Z'
    },
    {
        id: '2',
        campaignId: '1',
        donorId: '2',
        amount: 250,
        isAnonymous: true,
        timestamp: '2025-01-12T14:30:00Z'
    },
    {
        id: '3',
        campaignId: '2',
        donorId: '3',
        donorName: 'Sarah Johnson',
        amount: 1000,
        isAnonymous: false,
        message: 'Education is the best investment!',
        timestamp: '2025-01-15T09:15:00Z'
    }
];

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    switch (type) {
        case 'success':
            toastIcon.textContent = '✅';
            break;
        case 'error':
            toastIcon.textContent = '❌';
            break;
        case 'warning':
            toastIcon.textContent = '⚠️';
            break;
        case 'info':
            toastIcon.textContent = 'ℹ️';
            break;
        default:
            toastIcon.textContent = '✅';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getProgressPercentage(current, goal) {
    return Math.min((current / goal) * 100, 100);
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function getRoleDescription(role) {
    switch (role) {
        case 'alumni':
            return 'Ready to level up your network and mentor the next generation?';
        case 'student':
            return 'Explore opportunities and connect with experienced alumni!';
        case 'administrator':
            return 'Manage your community and drive engagement across the platform!';
        default:
            return 'Ready to level up your network?';
    }
}

function getUserAvatar(user) {
    const roleEmojis = {
        'alumni': '🎓',
        'student': '📚',
        'administrator': '👑'
    };
    return roleEmojis[user.role] || '🎮';
}

// Authentication Functions
function initializeAuth() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authForm = document.getElementById('authForm');
    const registerFields = document.getElementById('registerFields');
    const authSubmit = document.getElementById('authSubmit');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    let isLogin = true;
    
    // Tab switching
    loginTab.addEventListener('click', () => {
        isLogin = true;
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        registerFields.style.display = 'none';
        authSubmit.querySelector('.btn-text').textContent = 'Enter';
    });
    
    registerTab.addEventListener('click', () => {
        isLogin = false;
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerFields.style.display = 'block';
        authSubmit.querySelector('.btn-text').textContent = 'Click Enter';
    });
    
    // Password toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Form submission
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(authForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const fullName = formData.get('fullName');
        const role = formData.get('role');
        
        if (isLogin) {
            // Simple login validation
            if (email && password) {
                const user = createUser(email, fullName || email.split('@')[0], role || 'alumni');
                loginUser(user);
            }
        } else {
            // Registration validation
            if (email && password && fullName && role) {
                const user = createUser(email, fullName, role);
                loginUser(user);
            }
        }
    });
    
    // Demo account buttons
    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.getAttribute('data-role');
            const demoUsers = {
                'administrator': { email: 'admin@university.edu', name: 'Admin Master', role: 'administrator' },
                'alumni': { email: 'alumni@example.com', name: 'Alumni Warrior', role: 'alumni' },
                'student': { email: 'student@university.edu', name: 'Student Explorer', role: 'student' }
            };
            
            const demoUser = demoUsers[role];
            if (demoUser) {
                const user = createUser(demoUser.email, demoUser.name, demoUser.role);
                loginUser(user);
            }
        });
    });
}

function createUser(email, name, role) {
    const user = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role,
        privacySettings: {
            showEmail: true,
            showPhone: false,
            showLocation: true
        },
        createdAt: new Date().toISOString()
    };
    
    // Add role-specific fields
    if (role === 'alumni') {
        user.graduationYear = 2020;
        user.degree = 'Computer Science';
        user.department = 'Engineering';
        user.currentJobTitle = 'Software Engineer';
        user.company = 'Tech Corp';
        user.industry = 'Technology';
        user.location = 'San Francisco, CA';
        user.bio = 'Passionate about technology and education.';
        user.isAvailableForMentorship = true;
    } else if (role === 'student') {
        user.yearOfStudy = 3;
        user.major = 'Computer Science';
        user.department = 'Engineering';
        user.location = 'University Campus';
        user.bio = 'Eager to learn and connect with alumni.';
    } else if (role === 'administrator') {
        user.department = 'Administration';
        user.location = 'University Campus';
        user.bio = 'Dedicated to building strong alumni connections.';
    }
    
    return user;
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Hide auth screen and show main app
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update UI with user info
    updateUserInterface();
    
    // Show welcome toast
    showToast(`Welcome back, ${user.name}! 🎮`, 'success');
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Show auth screen and hide main app
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    
    // Reset form
    document.getElementById('authForm').reset();
    
    showToast('Logged out successfully! 👋', 'info');
}

// UI Update Functions
function updateUserInterface() {
    if (!currentUser) return;
    
    // Update header
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = getUserAvatar(currentUser);
    
    // Update user stats
    document.getElementById('userLevel').textContent = `Level ${Math.floor(Math.random() * 10) + 1}`;
    document.getElementById('userPoints').textContent = `${Math.floor(Math.random() * 1000) + 500} XP`;
    
    // Update greeting
    document.getElementById('greetingText').textContent = `${getGreeting()}, ${currentUser.name}! `;
    document.getElementById('roleDescription').textContent = getRoleDescription(currentUser.role);
    
    // Show/hide admin features
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = currentUser.role === 'administrator' ? 'block' : 'none';
    });
    
    // Update profile page
    updateProfilePage();
}

function updateProfilePage() {
    if (!currentUser) return;
    
    // Update profile header
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Student`;
    document.getElementById('profileAvatar').textContent = getUserAvatar(currentUser);
    
    // Update form fields
    const form = document.getElementById('profileForm');
    const fields = {
        'profileEmail': currentUser.email,
        'profileLocation': currentUser.location || '',
        'profileBio': currentUser.bio || '',
        'profileDepartment': currentUser.department || '',
        'profileDegree': currentUser.degree || currentUser.major || '',
        'profileYear': currentUser.graduationYear || currentUser.yearOfStudy || '',
        'profileJobTitle': currentUser.currentJobTitle || '',
        'profileCompany': currentUser.company || '',
        'profileIndustry': currentUser.industry || '',
        'mentorshipAvailable': currentUser.isAvailableForMentorship || false,
        'showEmail': currentUser.privacySettings?.showEmail || false,
        'showLocation': currentUser.privacySettings?.showLocation || false
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = value;
            } else {
                field.value = value;
            }
        }
    });
    
    // Show/hide alumni-specific fields
    const alumniFields = document.querySelectorAll('.alumni-only');
    alumniFields.forEach(field => {
        field.style.display = currentUser.role === 'alumni' ? 'block' : 'none';
    });
}

// Navigation Functions
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    // Navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
                
                // Close mobile menu
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                    sidebarOpen = false;
                }
            }
        });
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;
        sidebar.classList.toggle('open', sidebarOpen);
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebarOpen && 
            !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
            sidebarOpen = false;
        }
    });
}

function navigateToPage(pageId) {
    currentPage = pageId;
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageId}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page-specific content
        switch (pageId) {
            case 'networking':
                loadNetworkingContent();
                break;
            case 'events':
                loadEventsContent();
                break;
            case 'donations':
                loadDonationsContent();
                break;
            case 'admin':
                loadAdminContent();
                break;
        }
    }
}

// Profile Functions
function initializeProfile() {
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileEdit');
    const profileForm = document.getElementById('profileForm');
    const profileActions = document.getElementById('profileActions');
    
    editBtn.addEventListener('click', () => {
        toggleProfileEdit(true);
    });
    
    cancelBtn.addEventListener('click', () => {
        toggleProfileEdit(false);
        updateProfilePage(); // Reset form
    });
    
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfile();
    });
}

function toggleProfileEdit(editing) {
    isEditingProfile = editing;
    
    const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea, #profileForm select');
    const editBtn = document.getElementById('editProfileBtn');
    const profileActions = document.getElementById('profileActions');
    
    formInputs.forEach(input => {
        if (input.id !== 'profileEmail') { // Email should always be disabled
            input.disabled = !editing;
        }
    });
    
    editBtn.style.display = editing ? 'none' : 'flex';
    profileActions.style.display = editing ? 'flex' : 'none';
}

function saveProfile() {
    if (!currentUser) return;
    
    const formData = new FormData(document.getElementById('profileForm'));
    
    // Update user object
    currentUser.location = formData.get('location');
    currentUser.bio = formData.get('bio');
    currentUser.department = formData.get('department');
    
    if (currentUser.role === 'alumni') {
        currentUser.degree = formData.get('degree');
        currentUser.graduationYear = parseInt(formData.get('year')) || undefined;
        currentUser.currentJobTitle = formData.get('jobTitle');
        currentUser.company = formData.get('company');
        currentUser.industry = formData.get('industry');
        currentUser.isAvailableForMentorship = formData.get('mentorship') === 'on';
    } else if (currentUser.role === 'student') {
        currentUser.major = formData.get('degree');
        currentUser.yearOfStudy = parseInt(formData.get('year')) || undefined;
    }
    
    // Update privacy settings
    currentUser.privacySettings = {
        ...currentUser.privacySettings,
        showEmail: formData.get('showEmail') === 'on',
        showLocation: formData.get('showLocation') === 'on'
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    toggleProfileEdit(false);
    showToast('Profile updated successfully! 🎉', 'success');
}

// Networking Functions
function loadNetworkingContent() {
    const networkList = document.getElementById('networkList');
    const chatList = document.getElementById('chatList');
    
    if (networkList) {
        renderNetworkList();
    }
    
    if (chatList) {
        renderChatList();
    }
    
    initializeNetworkingFilters();
}

function renderNetworkList() {
    const networkList = document.getElementById('networkList');
    const filteredUsers = mockUsers.filter(user => user.id !== currentUser?.id);
    
    networkList.innerHTML = filteredUsers.map(user => `
        <div class="network-item">
            <div class="network-avatar">${getUserAvatar(user)}</div>
            <div class="network-info">
                <h4 class="network-name">${user.name}</h4>
                <p class="network-role">${user.role} warrior</p>
                <div class="network-details">
                    ${user.currentJobTitle ? `
                        <div class="network-detail">
                            <span class="network-detail-icon">💼</span>
                            ${user.currentJobTitle} at ${user.company}
                        </div>
                    ` : ''}
                    ${user.location ? `
                        <div class="network-detail">
                            <span class="network-detail-icon">📍</span>
                            ${user.location}
                        </div>
                    ` : ''}
                    ${user.department ? `
                        <div class="network-detail">
                            <span class="network-detail-icon">🎓</span>
                            ${user.department}
                        </div>
                    ` : ''}
                </div>
                ${user.isAvailableForMentorship ? '<span class="network-badge">Available for mentorship</span>' : ''}
            </div>
            <div class="network-actions">
                <button class="connect-btn" onclick="connectWithUser('${user.id}')" aria-label="Connect with ${user.name}">
                    <span class="btn-icon">👥</span>
                    CONNECT
                </button>
                <button class="message-btn" onclick="openChat('${user.id}')" aria-label="Message ${user.name}">
                    <span class="btn-icon">💬</span>
                    MESSAGE
                </button>
            </div>
        </div>
    `).join('');
}

function renderChatList() {
    const chatList = document.getElementById('chatList');
    const recentChats = mockUsers.filter(user => user.id !== currentUser?.id).slice(0, 4);
    
    chatList.innerHTML = recentChats.map(user => `
        <div class="chat-item" onclick="openChat('${user.id}')">
            <div class="chat-avatar">${getUserAvatar(user)}</div>
            <div class="chat-info">
                <div class="chat-name">${user.name}</div>
                <div class="chat-preview">Click to start chatting</div>
            </div>
            <div class="chat-indicator"></div>
        </div>
    `).join('');
}

function initializeNetworkingFilters() {
    const searchInput = document.getElementById('networkSearch');
    const roleFilter = document.getElementById('roleFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const locationFilter = document.getElementById('locationFilter');
    const mentorFilter = document.getElementById('mentorFilter');
    
    [searchInput, roleFilter, departmentFilter, locationFilter, mentorFilter].forEach(element => {
        if (element) {
            element.addEventListener('input', filterNetworkList);
            element.addEventListener('change', filterNetworkList);
        }
    });
}

function filterNetworkList() {
    // This would implement actual filtering logic
    // For now, just re-render the list
    renderNetworkList();
}

function connectWithUser(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        showToast(`Connection request sent to ${user.name}! 🤝`, 'success');
    }
}

function openChat(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        const modal = document.getElementById('chatModal');
        const userName = document.getElementById('chatUserName');
        const chatMessages = document.getElementById('chatMessages');
        
        userName.textContent = user.name;
        
        // Mock messages
        const messages = [
            { senderId: userId, content: 'Hi! I saw your profile and would love to connect.', timestamp: new Date(Date.now() - 3600000).toISOString(), isOwn: false },
            { senderId: currentUser.id, content: 'Hello! Thanks for reaching out. I\'d be happy to connect.', timestamp: new Date(Date.now() - 1800000).toISOString(), isOwn: true },
            { senderId: userId, content: 'Great! Could you tell me more about your experience?', timestamp: new Date(Date.now() - 900000).toISOString(), isOwn: false }
        ];
        
        chatMessages.innerHTML = messages.map(msg => `
            <div class="chat-message ${msg.isOwn ? 'own' : ''}">
                <div class="message-bubble">
                    <div class="message-text">${msg.content}</div>
                    <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
            </div>
        `).join('');
        
        modal.classList.add('active');
    }
}

// Events Functions
function loadEventsContent() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (eventsGrid) {
        renderEventsGrid();
    }
    
    initializeEventTabs();
    initializeEventFilters();
}

function renderEventsGrid() {
    const eventsGrid = document.getElementById('eventsGrid');
    const upcomingEvents = mockEvents.filter(event => new Date(event.date) >= new Date());
    
    eventsGrid.innerHTML = upcomingEvents.map(event => `
        <div class="event-card">
            <div class="event-card-header">
                <h3 class="event-title">${event.title}</h3>
                <span class="event-type ${event.isVirtual ? 'virtual' : ''}">${event.isVirtual ? 'Virtual' : 'In-Person'}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
                <div class="event-meta-item">
                    <span class="event-meta-icon">📅</span>
                    ${formatDate(event.date)}
                </div>
                <div class="event-meta-item">
                    <span class="event-meta-icon">⏰</span>
                    ${formatTime(event.time)}
                </div>
                <div class="event-meta-item">
                    <span class="event-meta-icon">📍</span>
                    ${event.location}
                </div>
            </div>
            <div class="event-attendees">
                <span class="attendees-info">
                    <span class="attendees-count">${event.attendees.length}</span> attending
                    ${event.maxAttendees ? ` (${event.maxAttendees} max)` : ''}
                </span>
            </div>
            <div class="event-actions">
                <button class="rsvp-btn" onclick="rsvpToEvent('${event.id}')" aria-label="RSVP to ${event.title}">
                    <span class="btn-icon">🎯</span>
                    <span class="btn-text">RSVP</span>
                </button>
                <button class="share-btn" onclick="shareEvent('${event.id}')" aria-label="Share ${event.title}">
                    <span class="btn-icon">📤</span>
                </button>
            </div>
        </div>
    `).join('');
}

function initializeEventTabs() {
    const eventTabs = document.querySelectorAll('.event-tab');
    eventTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            eventTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.getAttribute('data-tab');
            renderEventsForTab(tabType);
        });
    });
}

function initializeEventFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Filter functionality coming soon! ', 'info');
        });
    });
}

function renderEventsForTab(tabType) {
    const eventsGrid = document.getElementById('eventsGrid');
    let events = [];
    
    if (tabType === 'upcoming') {
        events = mockEvents.filter(event => new Date(event.date) >= new Date());
    } else if (tabType === 'past') {
        events = mockEvents.filter(event => new Date(event.date) < new Date());
    }
    
    if (events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>No ${tabType} events</h3>
                <p>${tabType === 'upcoming' ? 'Check back later for new events' : 'Past events will appear here'}</p>
            </div>
        `;
        return;
    }
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-card-header">
                <h3 class="event-title">${event.title}</h3>
                <span class="event-type ${event.isVirtual ? 'virtual' : ''}">${event.isVirtual ? 'Virtual' : 'In-Person'}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
                <div class="event-meta-item">
                    <span class="event-meta-icon">📅</span>
                    ${formatDate(event.date)}
                </div>
                <div class="event-meta-item">
                    <span class="event-meta-icon">⏰</span>
                    ${formatTime(event.time)}
                </div>
                <div class="event-meta-item">
                    <span class="event-meta-icon">📍</span>
                    ${event.location}
                </div>
            </div>
            <div class="event-attendees">
                <span class="attendees-info">
                    <span class="attendees-count">${event.attendees.length}</span> attending
                    ${event.maxAttendees ? ` (${event.maxAttendees} max)` : ''}
                </span>
            </div>
            <div class="event-actions">
                <button class="rsvp-btn" onclick="rsvpToEvent('${event.id}')" aria-label="RSVP to ${event.title}">
                    <span class="btn-icon">🎯</span>
                    <span class="btn-text">RSVP</span>
                </button>
                <button class="share-btn" onclick="shareEvent('${event.id}')" aria-label="Share ${event.title}">
                    <span class="btn-icon">📤</span>
                </button>
            </div>
        </div>
    `).join('');
}

function rsvpToEvent(eventId) {
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
        showToast(`RSVP confirmed for ${event.title}! 🎉`, 'success');
    }
}

function shareEvent(eventId) {
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            showToast('Event link copied to clipboard! 📋', 'success');
        }
    }
}

// Donations Functions
function loadDonationsContent() {
    const campaignsGrid = document.getElementById('campaignsGrid');
    const donorsGrid = document.getElementById('donorsGrid');
    
    if (campaignsGrid) {
        renderCampaignsGrid();
    }
    
    if (donorsGrid) {
        renderDonorsGrid();
    }
}

function renderCampaignsGrid() {
    const campaignsGrid = document.getElementById('campaignsGrid');
    const activeCampaigns = mockCampaigns.filter(campaign => campaign.isActive);
    
    campaignsGrid.innerHTML = activeCampaigns.map(campaign => {
        const progress = getProgressPercentage(campaign.currentAmount, campaign.goalAmount);
        const recentDonations = mockDonations
            .filter(d => d.campaignId === campaign.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 3);
        
        return `
            <div class="campaign-card">
                <div class="campaign-header">
                    <h3 class="campaign-title">${campaign.title}</h3>
                    <span class="campaign-status">Active</span>
                </div>
                <p class="campaign-description">${campaign.description}</p>
                <div class="campaign-progress">
                    <div class="progress-info">
                        <span class="progress-raised">$${campaign.currentAmount.toLocaleString()} raised</span>
                        <span class="progress-goal">$${campaign.goalAmount.toLocaleString()} goal</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-percentage">${progress.toFixed(1)}% of goal reached</div>
                </div>
                ${recentDonations.length > 0 ? `
                    <div class="recent-donors">
                        <h4>Recent Supporters</h4>
                        <div class="donor-list">
                            ${recentDonations.map(donation => `
                                <div class="donor-item">
                                    <span class="donor-name">${donation.isAnonymous ? 'Anonymous' : donation.donorName}</span>
                                    <span class="donor-amount">$${donation.amount.toLocaleString()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                <button class="donate-btn" onclick="openDonationModal('${campaign.id}')" aria-label="Donate to ${campaign.title}">
                    <span class="btn-icon">💎</span>
                    <span class="btn-text">DONATE NOW</span>
                </button>
            </div>
        `;
    }).join('');
}

function renderDonorsGrid() {
    const donorsGrid = document.getElementById('donorsGrid');
    const topDonors = mockDonations
        .filter(d => !d.isAnonymous)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6);
    
    donorsGrid.innerHTML = topDonors.map(donation => {
        const campaign = mockCampaigns.find(c => c.id === donation.campaignId);
        return `
            <div class="donor-card">
                <div class="donor-info">
                    <h4>${donation.donorName}</h4>
                    <p>${campaign?.title}</p>
                    ${donation.message ? `<div class="donor-message">"${donation.message}"</div>` : ''}
                </div>
                <div class="donor-amount">$${donation.amount.toLocaleString()}</div>
            </div>
        `;
    }).join('');
}

function openDonationModal(campaignId) {
    const modal = document.getElementById('donationModal');
    const campaignSelect = document.getElementById('donationCampaign');
    
    // Populate campaign select
    campaignSelect.innerHTML = '<option value="">Select a campaign</option>' +
        mockCampaigns.filter(c => c.isActive).map(campaign => 
            `<option value="${campaign.id}" ${campaign.id === campaignId ? 'selected' : ''}>${campaign.title}</option>`
        ).join('');
    
    modal.classList.add('active');
}

// Admin Functions
function loadAdminContent() {
    initializeAdminTabs();
    renderAdminOverview();
}

function initializeAdminTabs() {
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminSections = document.querySelectorAll('.admin-section');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            adminSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`admin${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                if (tabId === 'users') {
                    renderUsersTable();
                }
            }
        });
    });
}

function renderAdminOverview() {
    // Admin overview is already rendered in HTML
    // This function could be used to update dynamic stats
}

function renderUsersTable() {
    const usersTable = document.getElementById('usersTable');
    const allUsers = [currentUser, ...mockUsers].filter(Boolean);
    
    usersTable.innerHTML = `
        <div class="table-header">
            <div>User</div>
            <div>Role</div>
            <div>Join Date</div>
            <div>Status</div>
            <div>Actions</div>
        </div>
        ${allUsers.map(user => `
            <div class="table-row">
                <div class="user-cell">
                    <div class="user-cell-avatar">${getUserAvatar(user)}</div>
                    <div class="user-cell-info">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                    </div>
                </div>
                <div>${user.role}</div>
                <div>${new Date(user.createdAt).toLocaleDateString()}</div>
                <div><span class="status-badge">Active</span></div>
                <div class="table-actions">
                    <button class="table-action-btn" onclick="editUser('${user.id}')" aria-label="Edit ${user.name}">Edit</button>
                    <button class="table-action-btn delete" onclick="deleteUser('${user.id}')" aria-label="Delete ${user.name}">Delete</button>
                </div>
            </div>
        `).join('')}
    `;
}

function editUser(userId) {
    showToast('User editing functionality coming soon! ', 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        showToast('User deletion functionality coming soon! ', 'info');
    }
}

// Modal Functions
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    // Close modal when clicking close button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking cancel button
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Initialize donation form
    initializeDonationForm();
    
    // Initialize chat functionality
    initializeChatModal();
}

function initializeDonationForm() {
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('donationAmount');
    
    // Amount button clicks
    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.getAttribute('data-amount');
            amountInput.value = amount;
            
            amountButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Form submission
    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(donationForm);
        const campaignId = formData.get('donationCampaign');
        const amount = formData.get('donationAmount');
        const message = formData.get('donationMessage');
        const isAnonymous = formData.get('anonymousDonation') === 'on';
        
        if (campaignId && amount) {
            const campaign = mockCampaigns.find(c => c.id === campaignId);
            if (campaign) {
                showToast(`Thank you for your $${amount} donation to ${campaign.title}! 💎`, 'success');
                document.getElementById('donationModal').classList.remove('active');
                donationForm.reset();
                amountButtons.forEach(b => b.classList.remove('selected'));
            }
        }
    });
}

function initializeChatModal() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message own';
            messageElement.innerHTML = `
                <div class="message-bubble">
                    <div class="message-text">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            messageInput.value = '';
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Quick Actions
function initializeQuickActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            
            switch (action) {
                case 'find-alumni':
                    navigateToPage('networking');
                    break;
                case 'send-message':
                    navigateToPage('networking');
                    break;
                case 'join-event':
                    navigateToPage('events');
                    break;
                case 'update-profile':
                    navigateToPage('profile');
                    break;
                default:
                    showToast('Feature coming soon! ', 'info');
            }
        });
    });
}

// Logout Function
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            logoutUser();
        }
    });
}

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Check for saved user
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                document.getElementById('authScreen').style.display = 'none';
                document.getElementById('mainApp').style.display = 'block';
                updateUserInterface();
            } catch (e) {
                console.error('Error parsing saved user:', e);
                localStorage.removeItem('currentUser');
            }
        }
    }, 3000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreen();
    initializeAuth();
    initializeNavigation();
    initializeProfile();
    initializeModals();
    initializeQuickActions();
    initializeLogout();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
    
    // Add resize handler for responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('open');
            sidebarOpen = false;
        }
    });
});

// Global functions for onclick handlers
window.connectWithUser = connectWithUser;
window.openChat = openChat;
window.rsvpToEvent = rsvpToEvent;
window.shareEvent = shareEvent;
window.openDonationModal = openDonationModal;
window.editUser = editUser;
window.deleteUser = deleteUser;