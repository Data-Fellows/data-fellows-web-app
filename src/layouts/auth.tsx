import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-background">
    <motion.div
      className="hidden md:flex md:w-1/2 lg:w-2/5 items-center justify-center bg-primary/10 relative overflow-hidden"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <img
        src="/images/data-community-hero.jpg"
        alt="Auth Visual"
        className="absolute inset-0 h-full w-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-primary/70 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center p-8 text-white text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Welcome to Data Fellows
        </motion.h2>
        <motion.p
          className="text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Empowering Data Excellence Through Community
        </motion.p>
      </div>
    </motion.div>

    <motion.main
      className="flex flex-1 items-center justify-center p-6 md:w-1/2 lg:w-3/5 bg-background"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="w-full max-w-md mx-auto">{children}</div>
    </motion.main>
  </div>
);

export default AuthLayout;
