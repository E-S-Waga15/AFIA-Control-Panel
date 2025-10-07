
# 🏥 MedLife Control Panel

**A comprehensive medical management system built with modern technologies for healthcare facilities and medical services administration**

## 🌟 Key Features

### 👥 Comprehensive User Management
- **Doctor Management**: Add, edit, and block doctors with specialty and pricing management
- **Patient Management**: Track patient data and comprehensive medical history
- **Pharmacist Management**: Manage pharmacies and pharmaceutical inventory
- **Account Status Control**: Complete control over user account activation/deactivation

### 🏥 Medical Services Management
- **Specialty Management**: Add and modify medical specialties
- **Service Management**: Complete system for managing provided medical services
- **Dynamic Pricing**: Manage consultation fees and service pricing

### 📅 Advanced Appointment System
- **Appointment Scheduling**: Complete appointment booking and management system
- **Appointment Display**: Real-time appointment viewing and tracking
- **Appointment Filters**: Advanced filtering system for appointments by date, doctor, patient, etc.
- **Appointment Statistics**: Daily appointment analytics with visual charts and graphs

### ⭐ Doctor Rating System
- **Patient Reviews**: Comprehensive doctor rating and review system
- **Rating Analytics**: Statistical analysis of doctor performance and patient satisfaction
- **Review Management**: Admin control over reviews and ratings

### 🌍 Geographic Management
- **Governorate Management**: Dynamic system for geographic location management
- **Multi-language Support**: Multi-language interface with RTL support for Arabic

### 📊 Analytics & Statistics Dashboard
- **Daily Statistics**: Visual representation of daily operations and metrics
- **Performance Charts**: Interactive charts for appointments, ratings, and user activity
- **Data Visualization**: Comprehensive dashboard with key performance indicators

### 📱 Multi-Platform Interfaces
- **Web Dashboard**: Complete administrative interface for full access control
- **Mobile Application**: Optimized interface for pharmacists and mobile users

## 🛠️ Technology Stack

### Frontend
- **⚛️ React 18** - Advanced user interface library
- **🔷 TypeScript** - For safer and more maintainable code
- **🎨 Tailwind CSS** - Modern and flexible CSS framework
- **📱 Responsive Design** - Compatible with all screen sizes

### State Management & API
- **🔄 Redux Toolkit** - Powerful centralized state management
- **🌐 Axios** - Reliable HTTP client for API communication
- **📡 RESTful API** - Efficient server communication

### Additional Features
- **🔔 React Toastify** - Advanced notification system
- **📅 React DatePicker** - Enhanced date components
- **🖼️ Image Upload** - Image upload and management system
- **🔒 Form Validation** - Data validation and security

## 🚀 Getting Started

```bash
# Install required dependencies
npm install

# Run the project in development mode
npm run dev

# Build the project for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── ui/              # Basic UI components
│   ├── user-management.tsx    # User management interface
│   ├── services-management.tsx # Services management interface
│   ├── appointment-management.tsx # Appointment system interface
│   ├── analytics-dashboard.tsx    # Statistics and analytics dashboard
│   └── pharmacy-mobile.tsx     # Pharmacy mobile interface
├── store/               # Redux state management
│   └── slices/         # Feature-specific slices
│       ├── userSlice.js        # User management state
│       ├── appointmentSlice.js # Appointment system state
│       ├── analyticsSlice.js   # Analytics and statistics state
│       ├── governoratesSlice.js # Geographic management state
│       └── specialtiesSlice.js # Medical specialties state
├── contexts/           # React Contexts for global state
├── services/           # API services and server communication
└── utils/              # Utility functions and helpers
```

## 📊 Dashboard Features

### Analytics Dashboard
- **Real-time Statistics**: Live updates of daily appointments, ratings, and user activity
- **Interactive Charts**: Visual representation of data with filtering capabilities
- **Performance Metrics**: Key performance indicators for doctors and services
- **Export Functionality**: Data export for reports and analysis

### Appointment Management
- **Calendar View**: Visual calendar interface for appointment scheduling
- **Status Tracking**: Real-time appointment status updates
- **Automated Reminders**: Notification system for upcoming appointments
- **Conflict Resolution**: Intelligent scheduling conflict management

### Rating System
- **Multi-criteria Rating**: Comprehensive rating system covering multiple aspects
- **Review Moderation**: Admin tools for review management and quality control
- **Rating Analytics**: Statistical analysis of doctor performance trends
- **Patient Feedback**: Structured feedback collection and analysis

## 🤝 Contributing

We welcome contributions! Please read the contribution guide and review the code carefully before submitting a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




