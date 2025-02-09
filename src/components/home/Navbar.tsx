import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Lock } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-white" />
            <span className="text-white font-semibold">Personality Breakthrough Profile</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#foundations">Foundations</NavLink>
            <NavLink href="#benefits">Benefits</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <Link 
              to="/register"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-medium hover:scale-105 transition-all"
            >
              Register Now
            </Link>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <Lock className="w-4 h-4" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-white/80 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}