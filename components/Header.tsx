import React, { useState, useEffect, useRef } from 'react';
import { View, type NavLink } from '../types';
import { NAV_LINKS, ROLE_DISPLAY_CONFIG } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const { user, logout, role } = useAuth();
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const desktopUserMenuRef = useRef<HTMLDivElement>(null);
  const mobileUserMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock body scroll when mobile menu or search is open
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
  setIsSearchOpen(false);
  setIsDesktopUserMenuOpen(false);
  setIsMobileUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close user menus when clicking outside active dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isDesktopUserMenuOpen && desktopUserMenuRef.current && !desktopUserMenuRef.current.contains(target)) {
        setIsDesktopUserMenuOpen(false);
      }

      if (isMobileUserMenuOpen && mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(target)) {
        setIsMobileUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDesktopUserMenuOpen, isMobileUserMenuOpen]);

  // Ensure the mobile user menu closes whenever the mobile navigation drawer closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileUserMenuOpen(false);
    }
  }, [isMenuOpen]);


  const handleNavigation = (view: View) => {
    console.log('[Header] handleNavigation ->', view);
    setCurrentView(view);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const handleLogout = async () => {
    try {
        await logout();
        handleNavigation(View.Home);
    } catch (error) {
        console.error("Failed to log out:", error);
    }
  };

  const AuthButtons: React.FC<{
    isMobile?: boolean;
    onAction?: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
    isMenuOpen: boolean;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
  }> = ({ isMobile = false, onAction, menuRef, isMenuOpen, onToggleMenu, onCloseMenu }) => {
    const commonClasses = isMobile ? 'w-full text-center' : '';

    const handleAction = (view: View) => {
      console.log('[Header] handleAction ->', view);
      handleNavigation(view);
      onCloseMenu();
      if (onAction) onAction();
    };

    if (user) {
        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={onToggleMenu}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'U'}&background=random&color=fff`}
                        alt="User Avatar"
                    />
                    <span className="hidden sm:inline font-semibold text-gray-700">{user.displayName || user.email?.split('@')[0]}</span>
                    <span className="hidden sm:inline material-symbols-outlined text-gray-500">expand_more</span>
                </button>
                {/* User Dropdown Menu */}
                <div
                  className={`absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-[60] transform transition-all duration-300 origin-top-right ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  /* Menjaga menu pengguna berada di atas komponen fixed lain (mis. NotificationBell) */
                >
                    <div className="px-4 py-3 border-b">
                        <p className="font-bold text-gray-800 truncate">{user.displayName || user.email?.split('@')[0]}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        {role && (
                            <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_DISPLAY_CONFIG[role]?.color || ROLE_DISPLAY_CONFIG.null.color}`}>
                                {ROLE_DISPLAY_CONFIG[role]?.name || 'Pengguna'}
                            </span>
                        )}
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                            onClick={() => {
                                console.log('[Header] Dashboard button clicked');
                                handleAction(View.UMKMDashboard);
                            }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <span className="material-symbols-outlined mr-3">dashboard</span>
                        <span>Dasbor Saya</span>
                      </button>
                    </div>
                    <div className="py-1 border-t">
                        <button
                            onClick={() => {
                                // Close menus first to prevent state updates on unmounted components
                                onCloseMenu();
                                if (onAction) onAction();
                                // Then, initiate logout
                                handleLogout();
                            }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <span className="material-symbols-outlined mr-3">logout</span>
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
    <button onClick={() => handleAction(View.Login)} className={`${commonClasses} bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300`}>
            Masuk / Daftar
        </button>
    )
  }

  const renderNavLinks = (isMobile: boolean) => {
    const handleMobileDropdown = (label: string) => {
      setOpenMobileDropdown(prev => (prev === label ? null : label));
    };

    // Combine 'Fitur Lainnya' and 'Informasi' for a cleaner mobile view
    const linksToRender: NavLink[] = isMobile
      ? [
          NAV_LINKS[0], // Beranda
          NAV_LINKS[1], // Ekosistem
          {
            label: 'Lainnya & Info',
            children: [
              ...(NAV_LINKS[2]?.children || []),
              ...(NAV_LINKS[3]?.children || []),
            ],
            view: NAV_LINKS[2]?.view, // Inherit view from the original 'Fitur Lainnya'
          },
        ]
      : NAV_LINKS;

    return linksToRender.map((link) => {
      if (link.children && link.children.length > 0) {
        // Dropdown link
        return (
          <div key={link.label} className={isMobile ? 'py-2' : 'relative group'}>
            {isMobile ? (
              // --- Mobile View with split functionality ---
              <>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (link.view) {
                        handleNavigation(link.view);
                        setIsMenuOpen(false);
                      }
                    }}
                    className="py-2 text-gray-600 hover:text-blue-600 transition duration-300 font-medium"
                  >
                    <span>{link.label}</span>
                  </button>
                  <button
                    onClick={() => handleMobileDropdown(link.label)}
                    className="p-2 -mr-2 text-gray-600"
                    aria-label={`Toggle submenu for ${link.label}`}
                    aria-expanded={openMobileDropdown === link.label}
                  >
                    <span className={`material-symbols-outlined transition-transform duration-300 ${openMobileDropdown === link.label ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                </div>
                 <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openMobileDropdown === link.label ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="pl-6 pt-2 space-y-2 border-l-2 border-gray-200">
                        {link.children.map(child => (
                        child.view && <button
                            key={child.label}
                            onClick={() => {
                              handleNavigation(child.view!);
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 text-gray-500 hover:text-blue-600"
                        >
                            {child.label}
                        </button>
                        ))}
                    </div>
                </div>
              </>
            ) : (
              // --- Desktop View with clickable parent ---
              <>
                <button
                  onClick={() => link.view && handleNavigation(link.view)}
                  className={`flex items-center text-gray-600 hover:text-blue-600 transition duration-300 font-medium`}
                >
                  <span>{link.label}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 group-hover:rotate-180`}>
                    expand_more
                  </span>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-white rounded-md shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 invisible group-hover:visible">
                  {link.children.map(child => (
                      child.view && <button
                      key={child.label}
                      onClick={() => handleNavigation(child.view!)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      }
      // Simple link
      return (
        link.view && <button
          key={link.view}
          onClick={() => {
            handleNavigation(link.view!);
            if (isMobile) setIsMenuOpen(false);
          }}
          className={`text-gray-600 hover:text-blue-600 transition duration-300 font-medium ${isMobile ? 'py-2 text-left' : ''} ${
            currentView === link.view && !isMobile ? 'text-blue-600 border-b-2 border-blue-600' : ''
          } ${currentView === link.view && isMobile ? 'font-bold text-blue-600' : ''}`}
        >
          {link.label}
        </button>
      );
    });
  };

  return (
    <>
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => handleNavigation(View.Home)}>
          <h1 className="text-xl font-bold text-gray-800">Kampung Digital</h1>
          <p className="text-sm font-medium text-gray-500 leading-tight">Tangerang Selatan</p>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {renderNavLinks(false)}
        </nav>
        <div className="flex items-center space-x-4">
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                aria-label="Cari"
            >
                <span className="material-symbols-outlined">search</span>
            </button>
            <div className="hidden md:block">
              <AuthButtons
                menuRef={desktopUserMenuRef}
                isMenuOpen={isDesktopUserMenuOpen}
                onToggleMenu={() => {
                  setIsDesktopUserMenuOpen(prev => {
                    const next = !prev;
                    if (next) {
                      setIsMobileUserMenuOpen(false);
                    }
                    return next;
                  });
                }}
                onCloseMenu={() => setIsDesktopUserMenuOpen(false)}
              />
            </div>
            <div className="md:hidden flex items-center">
              <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full text-gray-700"
                  aria-label="Cari"
              >
                  <span className="material-symbols-outlined text-3xl">search</span>
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <span className="material-symbols-outlined text-gray-700 text-3xl">
                  {isMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
        </div>
      </div>
      
      {/* Mobile Menu with smooth transition */}
      <div 
        className={`absolute w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}
      >
          <nav className="flex flex-col px-6 pb-4">
            {renderNavLinks(true)}
             <div className="mt-4 border-t pt-4">
                <AuthButtons
                  isMobile={true}
                  onAction={() => setIsMenuOpen(false)}
                  menuRef={mobileUserMenuRef}
                  isMenuOpen={isMobileUserMenuOpen}
                  onToggleMenu={() => {
                    setIsMobileUserMenuOpen(prev => {
                      const next = !prev;
                      if (next) {
                        setIsDesktopUserMenuOpen(false);
                      }
                      return next;
                    });
                  }}
                  onCloseMenu={() => setIsMobileUserMenuOpen(false)}
                />
            </div>
          </nav>
      </div>
    </header>
     <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setCurrentView={setCurrentView} />
    </>
  );
};

export default Header;