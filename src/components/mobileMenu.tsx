// components/MobileMenu.tsx
'use client'; // Ensure this component is a client component

import { FC } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ menuOpen, toggleMenu }) => {
  return (
    <nav
      className={`fixed top-0 right-0 h-1/2 w-full bg-[#4d3d30] text-white shadow-lg z-40 ${menuOpen ? 'block' : 'hidden'}`}
      style={{ transition: 'transform 0.5s ease-in-out' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="text-2xl font-light text-white uppercase">
            DECCAN FURNITURE
          </Link>
          <button
            onClick={toggleMenu}
            aria-label="Close menu"
            className="text-white hover:text-gray-400"
          >
            <X className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col items-start justify-center h-full space-y-6 pl-10">
          <Link href="/" className="text-white text-3xl font-thin animate-slide-in" onClick={() => toggleMenu()}>
            Home
          </Link>
          <Link href="/products" className="text-white text-3xl font-thin animate-slide-in" onClick={() => toggleMenu()}>
            Shop
          </Link>
          <Link href="/about" className="text-white text-3xl font-thin animate-slide-in" onClick={() => toggleMenu()}>
            About
          </Link>
          <Link href="/contact" className="text-white text-3xl font-thin animate-slide-in" onClick={() => toggleMenu()}>
            Contact
          </Link>
        </div>
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 p-4 border-t border-gray-800">
          <Link href="https://www.facebook.com" className="text-white hover:text-gray-400" aria-label="Facebook" target="_blank">
            <FaFacebookF className="text-2xl" />
          </Link>
          <Link href="https://www.instagram.com" className="text-white hover:text-gray-400" aria-label="Instagram" target="_blank">
            <FaInstagram className="text-2xl" />
          </Link>
          <Link href="https://www.youtube.com" className="text-white hover:text-gray-400" aria-label="YouTube" target="_blank">
            <FaYoutube className="text-2xl" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MobileMenu;
