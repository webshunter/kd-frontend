import React, { useState, useEffect, useRef } from 'react';
import { View, DashboardView } from '../types';
import Sidebar from '../components/dashboard/Sidebar';
import UMKMDashboard from './UMKMDashboard';
import CustomerDashboard from './CustomerDashboard';
import Profile from '../components/dashboard/Profile';
import Products from '../components/dashboard/Products';
import Orders from '../components/dashboard/Orders';
import Courses from '../components/dashboard/Courses';
import Settings from '../components/dashboard/Settings';
import Checkout from './Checkout';
import { useAuth } from '../contexts/AuthContext';
import { DASHBOARD_NAV_LINKS, ROLE_DISPLAY_CONFIG } from '../constants';
import ManageUMKMView from './dashboard/ManageUMKMView';
import PemkotDashboard from './dashboard/PemkotDashboard';
import { umkmService } from '../src/services/umkmService';
import PaymentMembership from './PaymentMembership';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import NewsManagement from '../components/dashboard/NewsManagement';
import ForumManagement from '../components/dashboard/ForumManagement';
import EventsManagement from '../components/dashboard/EventsManagement';
import CoursesManagement from '../components/dashboard/CoursesManagement';
import MentoringManagement from '../components/dashboard/MentoringManagement';
import JobsManagement from '../components/dashboard/JobsManagement';
import BusinessMatchingManagement from '../components/dashboard/BusinessMatchingManagement';

interface DashboardProps {
  setCurrentView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  // Check for dashboard view from sessionStorage (for checkout redirect)
  const savedDashboardView = sessionStorage.getItem('kd-dashboard-view');
  const initialView = (savedDashboardView && Object.values(DashboardView).includes(savedDashboardView as DashboardView)) 
    ? (savedDashboardView as DashboardView) 
    : DashboardView.Overview;
  
  const [activeView, setActiveView] = useState<DashboardView>(initialView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [shouldPromptProfile, setShouldPromptProfile] = useState(false);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);
  
  // Clear dashboard view from sessionStorage after using it
  useEffect(() => {
    if (savedDashboardView) {
      sessionStorage.removeItem('kd-dashboard-view');
    }
  }, [savedDashboardView]);

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView(View.Home);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Effect to reset view if the current view is not allowed for the new role
  useEffect(() => {
      const currentLink = DASHBOARD_NAV_LINKS.find(link => link.view === activeView);
      if (role && currentLink && !currentLink.roles.includes(role)) {
          setActiveView(DashboardView.Overview);
      }
  }, [role, activeView]);

  useEffect(() => {
    let cancelled = false;

    const evaluateProfile = async () => {
      if (!user?.id || role !== 'umkm_owner') {
        setShouldPromptProfile(false);
        return;
      }

      const profile = await umkmService.getMyProfile();
      if (cancelled) {
        return;
      }

      if (!profile) {
        setShouldPromptProfile(true);
        setActiveView(prev => (prev === DashboardView.Profile ? prev : DashboardView.Profile));
      } else {
        setShouldPromptProfile(false);
      }
    };

    evaluateProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id, role]);

  // Effect untuk cek membership status
  useEffect(() => {
    const checkMembership = async () => {
      if (role !== 'umkm_owner') return;
      
      try {
        const paymentService = (await import('../src/services/paymentService')).default;
        const membershipData = await paymentService.getMembershipStatus();
        
        // Check if membershipData exists and has the expected structure
        if (membershipData && typeof membershipData.hasActiveMembership !== 'undefined') {
          setHasActiveMembership(membershipData.hasActiveMembership);
        } else {
          console.warn('Membership data structure unexpected:', membershipData);
          setHasActiveMembership(false);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setHasActiveMembership(false);
      }
    };

    checkMembership();
  }, [role]);

  // Effect to handle click outside user menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);


  const activeViewLabel = DASHBOARD_NAV_LINKS.find(link => link.view === activeView)?.label || 'Dashboard';

  const renderView = () => {
    if (!role) {
      return null;
    }

    switch (activeView) {
      case DashboardView.Overview:
        if (role === 'admin') {
          return <AdminDashboard setActiveDashboardView={setActiveView} />;
        }
        if (role === 'pemkot_staff' || role === 'kadin_staff') {
          return <PemkotDashboard setActiveDashboardView={setActiveView} />;
        }
        if (role === 'customer') {
          return <CustomerDashboard />;
        }
        return <UMKMDashboard setCurrentView={setCurrentView} setActiveDashboardView={setActiveView} />;
      
      case DashboardView.ManageUMKM:
        if (role === 'pemkot_staff' || role === 'admin' || role === 'kadin_staff') {
          return <ManageUMKMView />;
        }
        return <PemkotDashboard setActiveDashboardView={setActiveView} />;
      
      // Admin Management Views
      case DashboardView.NewsManagement:
        if (role === 'admin') {
          return <NewsManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.EventsManagement:
        if (role === 'admin') {
          return <EventsManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.ForumManagement:
        if (role === 'admin') {
          return <ForumManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.CoursesManagement:
        if (role === 'admin') {
          return <CoursesManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.MentoringManagement:
        if (role === 'admin') {
          return <MentoringManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.JobsManagement:
        if (role === 'admin') {
          return <JobsManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.BusinessMatchingManagement:
        if (role === 'admin') {
          return <BusinessMatchingManagement />;
        }
        return <AdminDashboard setActiveDashboardView={setActiveView} />;
      
      case DashboardView.Profile:
        return (
          <Profile
            showProfileReminder={shouldPromptProfile}
            onProfileSaved={() => setShouldPromptProfile(false)}
          />
        );
      case DashboardView.Products:
        return <Products />;
      case DashboardView.Orders:
        return <Orders />;
      case DashboardView.MembershipPremium:
        // Render PaymentMembership view untuk menampilkan halaman membership
        return <PaymentMembership setCurrentView={setCurrentView} />;
      case DashboardView.Checkout:
        return <Checkout setCurrentView={setCurrentView} />;
      case DashboardView.Courses:
        return <Courses />;
      case DashboardView.Settings:
        return <Settings />;
      default:
        return <UMKMDashboard setCurrentView={setCurrentView} setActiveDashboardView={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        setCurrentView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        role={role}
      />
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-80">
        {/* Dashboard Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{activeViewLabel}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Halo, <span className="font-semibold">{user?.displayName || user?.email?.split('@')[0] || 'Pengguna'}</span></span>
                  {hasActiveMembership && role === 'umkm_owner' && (
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <span className="material-symbols-outlined text-xs mr-1">workspace_premium</span>
                      Premium
                    </span>
                  )}
                </div>
                 {role && ROLE_DISPLAY_CONFIG[role] && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${ROLE_DISPLAY_CONFIG[role].color}`}>
                        {ROLE_DISPLAY_CONFIG[role].name}
                    </span>
                )}
            </div>
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email || 'U'}&background=random&color=fff`}
                  alt="User Avatar"
                />
              </button>

              {/* User Dropdown Menu */}
              <div
                className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-[60] transform transition-all duration-300 origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                /* Pastikan menu pengguna dashboard berada di lapisan tertinggi agar tombol tetap interaktif */
              >
                  <div className="px-4 py-3 border-b">
                      <p className="font-bold text-gray-800 truncate">{user?.displayName || user?.email?.split('@')[0]}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                      <button
                          onClick={() => { setActiveView(DashboardView.Settings); setIsUserMenuOpen(false); }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                          <span className="material-symbols-outlined mr-3">settings</span>
                          <span>Pengaturan</span>
                      </button>
                  </div>
                  <div className="py-1 border-t">
                      <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                          <span className="material-symbols-outlined mr-3">logout</span>
                          <span>Keluar</span>
                      </button>
                  </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;