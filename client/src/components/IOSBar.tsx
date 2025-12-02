import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Icon components
const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BotIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LayoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const BookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700/50"
          style={{
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
          }}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

// Dock item component
const DockItem = ({ children, tooltip }: { children: React.ReactNode; tooltip: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative"
    >
      <Tooltip content={tooltip}>
        {children}
      </Tooltip>
    </motion.div>
  );
};

// Separator component
const Separator = () => (
  <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-500 to-transparent mx-1.5 opacity-50" />
);

// Main dock component
const Dock = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl"
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
      }}
    >
      {children}
    </motion.div>
  );
};

interface IOSBarProps {
  onNavigate: (path: string) => void;
  currentView?: string;
}

export function IOSBar({ onNavigate, currentView = '/dashboard' }: IOSBarProps) {
  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/book-call', icon: CalendarIcon, label: 'Réserver un Call' },
    { path: '/chatbot', icon: BotIcon, label: 'Chatbot IA' },
    { path: '/formation', icon: BookIcon, label: 'Formations' },
    { path: '/landing-pages', icon: LayoutIcon, label: 'Landing Pages' },
  ];

  const moreItems = [
    { path: '/content', label: 'Contenu Drive' },
    { path: '/ads', label: 'Publicités' },
    { path: '/funnel', label: 'Entonnoir' },
    { path: '/calendar', label: 'Calendrier' },
    { path: '/revenue', label: 'Revenus' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/kpis', label: 'KPIs' },
  ];

  return (
    <div 
      className="fixed bottom-6 z-[9999] w-full flex justify-center"
      style={{
        left: 0,
        right: 0,
        margin: '0 auto'
      }}
    >
      <Dock>
          {/* Main navigation items */}
          {menuItems.map((item) => {
            const isActive = currentView === item.path;
            return (
              <DockItem key={item.path} tooltip={item.label}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900 shadow-lg shadow-gray-900/50'
                      : 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 text-gray-300 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 hover:text-white'
                  }`}
                  style={isActive ? {
                    boxShadow: '0 4px 12px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
                  } : {}}
                  aria-label={item.label}
                >
                  <item.icon className={isActive ? 'w-5 h-5' : 'w-4 h-4'} />
                </button>
              </DockItem>
            );
          })}

          <Separator />

          {/* More menu */}
          <DockItem tooltip="Plus">
            <button
              onClick={() => onNavigate('/more')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                currentView === '/more'
                  ? 'bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900 shadow-lg shadow-gray-900/50'
                  : 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 text-gray-300 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 hover:text-white'
              }`}
              style={currentView === '/more' ? {
                boxShadow: '0 4px 12px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
              } : {}}
              aria-label="Plus d'options"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </DockItem>
        </Dock>
    </div>
  );
}

