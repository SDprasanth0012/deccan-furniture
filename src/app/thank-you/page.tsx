// pages/thank-you.js

const ThankYou = () => {
    return (
      <div className="flex flex-col items-center justify-center mt-64 bg-[#f4f0ea] text-[#4d3d30] text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg mb-8">Your order has been placed successfully.</p>
        <a 
          href="/products" 
          className="bg-[#4d3d30] text-[#f4f0ea] border border-[#4d3d30] rounded px-4 py-2 hover:bg-[#f4f0ea] hover:text-[#4d3d30] transition-colors duration-300"
        >
          continue shopping 
        </a>
      </div>
    );
  };
  
  export default ThankYou;
  