import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Target, Zap, Home, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleCalComRedirect } from './SimpleCalComRedirect';
import { IOSDock } from './IOSDock';
import logoImage from '../ChatGPT Image 10 oct. 2025, 21_52_06.png';

interface NewDashboardAppProps {
  onLogout?: () => void;
}

export function NewDashboardApp({ onLogout }: NewDashboardAppProps) {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('/dashboard');

  const handleLogout = () => {
    console.log('Logout button clicked!');
    onLogout?.();
    navigate('/');
  };

  // Handlers pour la barre iOS
  const handleHomeClick = () => {
    setCurrentView('/dashboard');
  };

  const handleCallClick = () => {
    setCurrentView('/book-call');
  };


  const renderContent = () => {
    switch (currentView) {
          case '/dashboard':
    return (
              <motion.div 
                className="min-h-screen flex items-center justify-center -mt-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
        <div className="text-center max-w-4xl mx-auto px-8">
                  {/* Titre principal avec animation simple */}
                  <motion.h1 
                    className="text-6xl md:text-8xl font-bold text-white mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Dashboard
                  </motion.h1>
                  
                  {/* Description avec animation simple */}
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Bienvenue dans votre espace RizeAppHub™
                  </motion.p>
                  
                  {/* Card de fonctionnalité avec animation simple */}
                  <motion.div 
                    className="flex justify-center mt-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-white/20 to-gray-200/20 border border-gray-300/30 rounded-2xl p-8 hover:border-gray-300/50 transition-all duration-200 max-w-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="flex items-center space-x-3 mb-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <motion.div 
                          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Calendar className="w-6 h-6 text-gray-400" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white">Booker un Call</h3>
                      </motion.div>
                      
                      <motion.p 
                        className="text-gray-300 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1 }}
                      >
                        Réservez un appel stratégique avec nos experts
                      </motion.p>
                      
                      <motion.button 
                        onClick={() => setCurrentView('/book-call')}
                        className="w-full py-4 px-8 bg-gray-600 hover:bg-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.2 }}
                      >
                        Réserve ton appel de semaine
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );

          case '/book-call':
            return (
              <div className="min-h-screen -mt-24">
                <SimpleCalComRedirect />
              </div>
            );



      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12">
                Bienvenue dans votre espace RizeAppHub™
              </p>
        </div>
      </div>
    );
    }
  };

  // Dashboard simplifié - pas besoin de variables complexes

  return (
    <div className="min-h-screen w-full bg-black relative" style={{ border: 'none !important' }}>
      {/* Background harmonisé */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black z-0"></div>
      
      {/* Header avec logo et logout */}
      <header 
        className="relative z-50 p-6 flex justify-between items-center"
        style={{ 
          position: 'relative',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg shadow-gray-500/30 overflow-hidden">
            <img 
              src={logoImage} 
              alt="RizeApp Logo" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">RizeAppHub™</h1>
            <p className="text-sm text-gray-300">Dashboard</p>
          </div>
        </div>
        
        {/* Bouton Logout - Position absolue pour éviter les conflits */}
        <div 
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
        >
          <button 
            onClick={() => {
              handleLogout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              pointerEvents: 'auto',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <LogOut style={{ width: '24px', height: '24px' }} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ border: 'none !important' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Barre iOS en bas */}
      <IOSDock 
        onHomeClick={handleHomeClick}
        onCallClick={handleCallClick}
        currentView={currentView}
      />

    </div>
  );
}