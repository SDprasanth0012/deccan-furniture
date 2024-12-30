// components/Header.tsx
"use client"
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ShoppingCart, User } from 'lucide-react';
import MobileMenu from './mobileMenu'; // Import the MobileMenu component
import Wishlist from './wishList'; // Import the Wishlist component

const Cart = dynamic(() => import('./cart'), { ssr: false }); // Dynamically import Cart component

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    if (navRef.current) {
      if (!menuOpen) {
        gsap.fromTo(
          navRef.current,
          { y: '100%', opacity: 0 },
          { y: '50%', opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        gsap.to(
          navRef.current,
          { y: '100%', opacity: 0, duration: 0.5, ease: 'power3.in' }
        );
      }
    }
  };

  const toggleWishlist = () => {
    if (cartOpen) {
      setCartOpen(false); // Close cart if open
    }
    setWishlistOpen(prev => !prev);
  };

  const toggleCart = () => {
    if (wishlistOpen) {
      setWishlistOpen(false); // Close wishlist if open
    }
    setCartOpen(prev => !prev);
  };

  return (
    <header className="bg-[#f4f0ea] shadow-md fixed top-0 left-0 w-screen  z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-light uppercase">
          <Link href="/" className="hover:text-gray-600">
            DECCAN FURNITURE
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden text-xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-1 bg-gray-800 mb-1"></span>
          <span className="block w-6 h-1 bg-gray-800 mb-1"></span>
          <span className="block w-6 h-1 bg-gray-800"></span>
        </button>

        {/* Navigation Links for Larger Devices */}
        <div className="hidden lg:flex flex-1 items-center justify-center space-x-6">
          <Link href="/" className="text-gray-800 hover:text-gray-600 uppercase">
            Home
          </Link>
          <Link href="/products" className="text-gray-800 hover:text-gray-600 uppercase">
            Shop
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-gray-600 uppercase">
            About
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-gray-600 uppercase">
            Contact
          </Link>
        </div>

        {/* Icons for Larger Devices */}
        <div className="hidden lg:flex items-center space-x-6">
          <Wishlist wishlistOpen={wishlistOpen} toggleWishlist={toggleWishlist} />

          <div className="relative flex items-center">
            <button
              onClick={toggleCart}
              className="text-gray-800 hover:text-gray-600"
              aria-label="Cart"
            >
              <ShoppingCart className="text-xl" />
            </button>
            {/* Render Cart component here */}
            <Cart cartOpen={cartOpen} toggleCart={toggleCart} />
          </div>

          <Link href="/profile" className="text-gray-800 hover:text-gray-600">
            <User className="text-xl" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </header>
  );
};

export default Header;
