import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shield,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  BarChart2,
  ShieldAlert,
  ChevronDown,
  Lock
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenProfile }) => {
  const { user, logout, openAuthModal, quickLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'training', label: 'Training' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'safety-tips', label: 'Safety Tips' },
    { id: 'red-flags', label: 'Red Flags' },
    { id: 'about', label: 'About' }
  ];

  if (user && user.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin Studio' });
  }

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 group-hover:text-cyan-300">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  SpamShield
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  EDU
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
                Spam Training Simulator
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              const isAdmin = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? isAdmin
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : isAdmin
                      ? 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Auth & Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                {/* Quick 1-click demo button for quick evaluation */}
                <button
                  onClick={() => quickLogin('USER')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 rounded-lg transition-all flex items-center gap-1.5"
                  title="Instant Demo Access"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Demo Mode</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg transition-all shadow-md shadow-cyan-500/20"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                      {user.display_name.split(' ')[0]}
                      {user.role === 'ADMIN' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <div className="text-xs font-bold text-white">{user.display_name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          handleNav('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <BarChart2 className="w-4 h-4 text-cyan-400" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        <span>Profile & Security</span>
                      </button>
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            handleNav('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-amber-950/40 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Admin Studio</span>
                        </button>
                      )}
                    </div>
                    <div className="p-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:bg-rose-950/40 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{user.display_name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="py-2 text-xs text-slate-300 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2 text-xs text-rose-300 bg-rose-950/40 rounded-lg border border-rose-800/40"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
