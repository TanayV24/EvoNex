import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="pl-20 lg:pl-[280px] transition-[padding] duration-300">
        <Header title={title} subtitle={subtitle} />
        
        <main className="min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-50 pointer-events-none" />
    </div>
  );
};
