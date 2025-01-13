import React from "react";

const About: React.FC = () => {
  return (
    <div className="bg-[#f4f0ea] text-[#4d3d30]">
      {/* Hero Section */}
      <section className="bg-[#4d3d30] text-[#f4f0ea] py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About Deccan Furniture</h1>
        <p className="text-lg max-w-2xl mx-auto">
          At Deccan Furniture, we bring elegance, comfort, and durability to
          your living spaces. Our mission is to craft furniture that complements
          your lifestyle and stands the test of time.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7 16h10M5 20h14M9 4h6M7 8h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">High-Quality Materials</h3>
            <p>
              We use the finest materials to ensure every piece of furniture is
              built to last.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l2.4 6.93L21 9.75l-4.8 4.3 1.8 7.45L12 16.5l-6.01 4.4 1.8-7.45L3 9.75l6.6-.82L12 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Timeless Designs</h3>
            <p>
              Our designs combine modern trends with classic styles to fit any
              home decor.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12l2 2 4-4m-4-4a4 4 0 110 8 4 4 0 010-8zm-3 8a6 6 0 1112 0H5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer-Centric</h3>
            <p>
              Your satisfaction is our priority. We strive to deliver the best
              service and support.
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 11l4-4m0 0l4 4M7 7v10M3 19l4-4m0 0l4 4M7 17v-8m10-5h1.5a2.5 2.5 0 110 5H17V6m-3 5H8.5a2.5 2.5 0 010-5H10v5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable Practices</h3>
            <p>
              We are committed to eco-friendly practices to reduce our carbon
              footprint.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#4d3d30] text-[#f4f0ea] py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 lg:px-24">
          <div className="bg-[#f4f0ea] text-[#4d3d30] p-6 rounded shadow-lg">
            <p className="text-sm mb-4">
              "Deccan Furniture transformed my living room. The quality and
              design are unmatched!"
            </p>
            <h4 className="text-lg font-semibold">- Priya R.</h4>
          </div>
          <div className="bg-[#f4f0ea] text-[#4d3d30] p-6 rounded shadow-lg">
            <p className="text-sm mb-4">
              "Their customer service is exceptional. I highly recommend Deccan
              Furniture."
            </p>
            <h4 className="text-lg font-semibold">- Ravi S.</h4>
          </div>
          <div className="bg-[#f4f0ea] text-[#4d3d30] p-6 rounded shadow-lg">
            <p className="text-sm mb-4">
              "Stylish and durable furniture! It perfectly fits my space and
              style."
            </p>
            <h4 className="text-lg font-semibold">- Anjali K.</h4>
          </div>
        </div>
      </section>

      {/* 25 Years of Experience */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">25 Years of Excellence</h2>
        <p className="text-lg">
          For over 25 years, Deccan Furniture has been a trusted name in the
          industry, delivering premium quality furniture and unmatched customer
          service. We take pride in creating spaces where memories are made.
        </p>
      </section>
    </div>
  );
};

export default About;
