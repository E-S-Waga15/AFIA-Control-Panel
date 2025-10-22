import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';

import { Provider, useSelector } from 'react-redux';
import store from './store/store';

import { Login } from './components/login';
import { DashboardHome } from './components/dashboard-home';
import { UserManagement } from './components/user-management';
import { AdminManagement } from './components/admin-management';
import { AppointmentsManagement } from './components/appointments-management';
import { UserInformation } from './components/user-information';
import { ServicesManagement } from './components/services-management';
import { DoctorsRatings } from './components/doctors-ratings';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger
} from './components/ui/sidebar';
import { RTLSidebar, RTLSidebarTrigger } from './components/ui/rtl-sidebar';

import { Button } from './components/ui/button';
import { Home, Users, Calendar, Pill, Settings, Star, LogOut } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { ToastContainer, toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';

function DashboardLayout({ onLogout, currentUser }) {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const accountType = useSelector((state: any) => state.auth.account_type);

  // إغلاق الـ sidebar تلقائياً عند الانتقال إلى صفحة جديدة في الموبايل فقط
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // إرسال event مخصص لإغلاق الـ sidebar
      window.dispatchEvent(new CustomEvent('close-mobile-sidebar'));
    }
  }, [location.pathname]);

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
    if (path === '/admins') return 'admins';
    if (path === '/appointments') return 'appointments';
    if (path === '/services') return 'services';
    if (path === '/ratings') return 'ratings';
    return 'home';
  };

  const currentPage = getCurrentPage();

  const sidebarItems = [
    { path: '/', label: t('sidebar.dashboard'), icon: Home, id: 'home' },
    { path: '/users', label: t('sidebar.userManagement'), icon: Users, id: 'users' },
    { path: '/admins', label: t('sidebar.adminManagement'), icon: Users, id: 'admins' },
    { path: '/appointments', label: t('sidebar.appointments'), icon: Calendar, id: 'appointments' },
    { path: '/services', label: t('sidebar.servicesSpecialties'), icon: Settings, id: 'services' },
    { path: '/ratings', label: t('sidebar.doctorRatings'), icon: Star, id: 'ratings' },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => item.path !== '/admins' || accountType === 'owner');

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home': return t('app.dashboardOverview');
      case 'users': return t('sections.userManagement');
      case 'admins': return t('sections.adminManagement');
      case 'appointments': return t('sections.appointmentsManagement');
      case 'services': return t('sections.servicesSpecialties');
      case 'ratings': return t('sections.doctorRatings');
      default: return '';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex w-full bg-background ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <RTLSidebar className={`${isRTL ? 'right-0' : 'left-0'} mobile-padding`}>
          <SidebarHeader className="mobile-padding">
            <div className="mobile-flex-between mobile-gap">
              <h2 className="mobile-heading text-primary">{t('app.title')}</h2>
              <div className="mobile-text-sm text-muted-foreground">
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
                  {filteredSidebarItems.map((item) => (
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
        </RTLSidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b print:hidden bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RTLSidebarTrigger />
              <h1 className="text-xl font-semibold text-primary">{getPageTitle()}</h1>
            </div>
            <LanguageToggle />
          </header>

          <div className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admins" element={accountType === 'owner' ? <AdminManagement /> : <Navigate to="/" />} />
              <Route path="/appointments" element={<AppointmentsManagement />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/ratings" element={<DoctorsRatings />} />
              <Route path="/user-information/:userId" element={<UserInformation />} />
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
  const accountType = useSelector((state: any) => state.auth.account_type);
  const token = useSelector((state: any) => state.auth.token);

  // تحقق عند التحميل إذا كان فيه توكن
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      setCurrentUser({ username: 'user', role: accountType });
    }
  }, [token, accountType]);

  const handleLogin = (username, role) => {
    setCurrentUser({ username, role });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('account_type');
    setCurrentUser(null);
    setIsLoggedIn(false);
    window.location.reload();
  };

   const confirmLogout = () => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", marginBottom: "12px", marginRight: "35px" }}>
            هل أنت متأكد من أنك تريد تسجيل الخروج؟
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirmp"
              onClick={() => {
                handleLogout();
                closeToast();
              }}
            >
              تأكيد
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              إلغاء
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "custom-toast",
      }
    );
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
            <DashboardLayout onLogout={confirmLogout} currentUser={currentUser} />
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
        <Router basename={process.env.NODE_ENV === 'production' ? process.env.VITE_BASENAME || '' : ''}>
          <AppRoutes />
        </Router>
        <ToastContainer aria-label="Notifications" />
      </LanguageProvider>
    </Provider>
  );
}
