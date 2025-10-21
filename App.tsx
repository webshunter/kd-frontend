import React, { useState, useEffect, useRef } from 'react';
import { View } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import UMKM from './views/UMKM';
import TangselMart from './views/TangselMart';
import GoodSkill from './views/GoodSkill';
import HalloHukum from './views/HalloHukum';
import Pendanaan from './views/Pendanaan';
import Forum from './views/Forum';
import Koperasi from './views/Koperasi';
import LowonganKerja from './views/LowonganKerja';
import BusinessMatching from './views/BusinessMatching';
import EventTangsel from './views/EventTangsel';
import Mentoring from './views/Mentoring';
import GoodEx from './views/GoodEx';
import About from './views/About';
import Pemkot from './views/Pemkot';
import Berita from './views/Berita';
import Chatbot from './components/Chatbot';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';
import { useAuth } from './contexts/AuthContext';
import NotificationBell from './components/NotificationBell';
import DigitalMarketing from './views/DigitalMarketing';
import PaymentMembership from './views/PaymentMembership';
import PaymentStatus from './views/PaymentStatus';

const VIEW_STORAGE_KEY = 'kd-current-view';

const isValidStoredView = (value: string | null): value is View => {
  if (!value) {
    return false;
  }
  return Object.values(View).includes(value as View);
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const hasForcedDashboard = useRef(false);
  
  // Debug current view
  console.log('🏠 App - Current View:', currentView);
  console.log('👤 App - User:', user?.email);
  
  const isDashboard = currentView === View.UMKMDashboard;

  useEffect(() => {
    if (typeof window === 'undefined' || loading) {
      return;
    }

    const storedView = sessionStorage.getItem(VIEW_STORAGE_KEY);

    if (!isValidStoredView(storedView)) {
      setCurrentView(View.Home);
      return;
    }

    if (!user && [View.Login, View.Register, View.UMKMDashboard].includes(storedView as View)) {
      // Menjaga landing page tetap tampil pertama kali saat pengguna belum memiliki sesi aktif
      sessionStorage.setItem(VIEW_STORAGE_KEY, View.Home);
      setCurrentView(View.Home);
      return;
    }

    setCurrentView(storedView as View);
  }, [user, loading]);

  useEffect(() => {
    if (isDashboard) {
      document.body.classList.add('dashboard-mode');
    } else {
      document.body.classList.remove('dashboard-mode');
    }
    return () => {
      document.body.classList.remove('dashboard-mode');
    };
  }, [isDashboard]);

  useEffect(() => {
    if (loading) {
      return;
    }

    setCurrentView(prevView => {
      if (!user && prevView === View.UMKMDashboard) {
        hasForcedDashboard.current = false;
        return View.Login;
      }

      if (user && (prevView === View.Login || prevView === View.Register)) {
        return View.UMKMDashboard;
      }

      return prevView;
    });
  }, [user, loading]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    sessionStorage.setItem(VIEW_STORAGE_KEY, currentView);
  }, [currentView]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      if (!hasForcedDashboard.current && currentView !== View.UMKMDashboard) {
        hasForcedDashboard.current = true;
        setCurrentView(View.UMKMDashboard);
      }
    } else {
      hasForcedDashboard.current = false;
    }
  }, [user, loading, currentView]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Define views that are full-screen and shouldn't have the main layout or chatbot
  const isAuthView = currentView === View.Login || currentView === View.Register;

  const renderGuardMessage = (message: string) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );

  // The main marketing pages that use the standard Header/Footer layout
  const renderMarketingView = () => {
    switch (currentView) {
      case View.Home:
        return <Home setCurrentView={setCurrentView} />;
      case View.UMKM:
        return <UMKM setCurrentView={setCurrentView} />;
      case View.TangselMart:
        return <TangselMart />;
      case View.GoodSkill:
        return <GoodSkill />;
      case View.HalloHukum:
        return <HalloHukum />;
      case View.Pendanaan:
        return <Pendanaan />;
      case View.Forum:
          return <Forum />;
      case View.Koperasi:
          return <Koperasi />;
      case View.LowonganKerja:
          return <LowonganKerja />;
      case View.BusinessMatching:
          return <BusinessMatching />;
      case View.DigitalMarketing:
          return <DigitalMarketing />;
      case View.EventTangsel:
          return <EventTangsel />;
      case View.Mentoring:
          return <Mentoring />;
      case View.GoodEx:
          return <GoodEx />;
      case View.About:
          return <About setCurrentView={setCurrentView} />;
      case View.Pemkot:
          return <Pemkot setCurrentView={setCurrentView} />;
      case View.Berita:
          return <Berita setCurrentView={setCurrentView} />;
      case View.PaymentMembership:
          return <PaymentMembership setCurrentView={setCurrentView} />;
      case View.PaymentStatus:
          return <PaymentStatus onBack={() => setCurrentView(View.UMKMDashboard)} />;
      // Login, Register, and Dashboard are handled outside this function
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  let pageContent;

  // Render full-screen views and handle authentication redirects
  if (currentView === View.Login) {
    pageContent = user
      ? renderGuardMessage('Mengalihkan ke dasbor UMKM...')
      : <Login setCurrentView={setCurrentView} />;
  } else if (currentView === View.Register) {
    pageContent = user
      ? renderGuardMessage('Mengalihkan ke dasbor UMKM...')
      : <Register setCurrentView={setCurrentView} />;
  } else if (currentView === View.UMKMDashboard) {
    pageContent = user
      ? <Dashboard setCurrentView={setCurrentView} />
      : renderGuardMessage('Mengalihkan ke halaman masuk...');
  } else {
    // Standard layout for all other pages
    pageContent = (
      <>
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-grow">
          {renderMarketingView()}
        </main>
        <Footer setCurrentView={setCurrentView} />
        <NotificationBell />
      </>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen flex flex-col`}>
      {pageContent}
      {!isAuthView && <Chatbot />}
    </div>
  );
};

export default App;