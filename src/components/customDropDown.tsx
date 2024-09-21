import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (option: Option) => void;
  backgroundColor?: string; // Optional backgroundColor prop
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, backgroundColor = "#e8e0d4" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { scaleY: 0, opacity: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => {
            if (dropdownRef.current) {
              dropdownRef.current.style.display = "block"; // Ensure it's displayed before animating
            }
          }
        }
      );

      gsap.fromTo(
        dropdownRef.current.querySelectorAll('li'),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
          stagger: 0.1 // Stagger the appearance of list items
        }
      );
    } else if (dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        scaleY: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (dropdownRef.current) {
            dropdownRef.current.style.display = "none"; // Hide after animation completes
          }
        }
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full rounded-md border border-[#4d3d30] px-3 py-2 text-sm text-[#4d3d30] placeholder:text-[#4d3d30] placeholder:text-opacity-60 ring-offset-[#ede7ea] focus-visible:outline-2 focus-visible:outline-[#4d3d30]"
        ref={buttonRef}
      >
        {value ? options.find(option => option.value === value)?.label : "Select an option"}
      </button>
      <ul
        ref={dropdownRef}
        className="absolute z-10 mt-1 w-full rounded-md border border-[#4d3d30] shadow-lg overflow-hidden"
        style={{ display: "none", backgroundColor }} // Apply background color here
      >
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option)}
            className={`cursor-pointer px-3 py-2 text-sm ${value === option.value ? 'bg-[#4d3d30] text-white' : 'hover:bg-[#4d3d30] hover:text-white'}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomDropdown;
