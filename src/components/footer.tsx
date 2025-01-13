import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4d3d30] text-[#f4f0ea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Deccan Furniture</h1>
          <p className="text-sm mt-2">
            High-quality furniture designed to elevate your living spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:underline">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="text-sm space-y-2">
              <li>
                <span className="font-semibold">Phone:</span> 
                <a href="tel:8309745617" className="hover:underline"> 8309745617</a>, 
                <a href="tel:9133960303" className="hover:underline"> 9133960303</a>
              </li>
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:support@deccanfurniture.com" className="hover:underline">
                  support@deccanfurniture.com
                </a>
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              Deccan Furniture specializes in premium furniture that combines
              style, comfort, and durability. Explore our range to transform
              your spaces.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#f4f0ea] mt-8 pt-4 text-sm text-center">
          <p>© {new Date().getFullYear()} Deccan Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
