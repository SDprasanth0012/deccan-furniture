"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ThankYou = () => {
  const router = useRouter();

  useEffect(() => {
    // Set a timeout to redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 2000); // 2000 ms = 2 seconds

    // Cleanup the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen overflow-y-hidden flex justify-center items-center">
      <div className="flex flex-col items-center justify-center  bg-[#f4f0ea] text-[#4d3d30] text-center">
        <h1 className="text-4xl font-normal
         mb-4">Thank You!</h1>
        <p className="text-lg mb-8">Your order has been placed successfully.</p>
        <a
          href="/products"
          className="bg-[#4d3d30] text-[#f4f0ea] border border-[#4d3d30] rounded px-4 py-2 hover:bg-[#f4f0ea] hover:text-[#4d3d30] transition-colors duration-300"
        >
          Continue shopping
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
