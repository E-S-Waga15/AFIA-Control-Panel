import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store/store';

import { Login } from './components/login';
import { DashboardHome } from './components/dashboard-home';
import { UserManagement } from './components/user-management';
import { AppointmentsManagement } from './components/appointments-management';
import { PharmacySection } from './components/pharmacy-section';
import { ServicesManagement } from './components/services-management';
import { DoctorsRatings } from './components/doctors-ratings';

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger
} from './components/ui/sidebar';

import { Button } from './components/ui/button';
import { Home, Users, Calendar, Pill, Settings, Star, LogOut } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { ToastContainer } from 'react-toastify';

function DashboardLayout({ onLogout, currentUser }) {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // الحفاظ على المسار الحالي عند الريلود
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== '/') {
      navigate(currentPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  // تحديد المسار الحالي وتحويله إلى اسم المكون
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' ) return 'home';
    if (path === '/users') return 'users';
    if (path === '/appointments') return 'appointments';
    if (path === '/pharmacy') return 'pharmacy';
    if (path === '/services') return 'services';
    if (path === '/ratings') return 'ratings';
    return 'home';
  };

  const currentPage = getCurrentPage();

  const sidebarItems = [
    { path: '/', label: t('sidebar.dashboard'), icon: Home, id: 'home' },
    { path: '/users', label: t('sidebar.userManagement'), icon: Users, id: 'users' },
    { path: '/appointments', label: t('sidebar.appointments'), icon: Calendar, id: 'appointments' },
    { path: '/pharmacy', label: t('sidebar.prescriptions'), icon: Pill, id: 'pharmacy' },
    { path: '/services', label: t('sidebar.servicesSpecialties'), icon: Settings, id: 'services' },
    { path: '/ratings', label: t('sidebar.doctorRatings'), icon: Star, id: 'ratings' },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home': return t('app.dashboardOverview');
      case 'users': return t('sections.userManagement');
      case 'appointments': return t('sections.appointmentsManagement');
      case 'pharmacy': return t('sections.prescriptions');
      case 'services': return t('sections.servicesSpecialties');
      case 'ratings': return t('sections.doctorRatings');
      default: return '';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex w-full bg-background ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Sidebar className={isRTL ? 'right-0' : 'left-0'}>
          <SidebarHeader className="p-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg font-semibold text-primary">{t('app.title')}</h2>
              <div className="text-sm text-muted-foreground">
                <p>{t('common.welcome')}, {currentUser?.username}</p>
                <p className="capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('common.navigation')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={currentPage === item.id}>
                        <Link to={item.path}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={onLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      <span>{t('common.logout')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-primary">{getPageTitle()}</h1>
            </div>
            <LanguageToggle />
          </header>

          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/appointments" element={<AppointmentsManagement />} />
              <Route path="/pharmacy" element={<PharmacySection />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/ratings" element={<DoctorsRatings />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// ========================

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // تحقق عند التحميل إذا كان فيه توكن
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // ممكن تجيب بيانات المستخدم من التوكن أو API
      setCurrentUser({ username: 'user', role: 'admin' });
    }
  }, []);

  const handleLogin = (username, role) => {
    setCurrentUser({ username, role });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      {/* صفحة تسجيل الدخول */}
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        }
      />

      {/* صفحة الداشبورد مع جميع المسارات الفرعية */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <DashboardLayout onLogout={handleLogout} currentUser={currentUser} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <Router>
          <AppRoutes />
        </Router>
        <ToastContainer />
      </LanguageProvider>
    </Provider>
  );
}
