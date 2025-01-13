import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="bg-[#f4f0ea] text-[#4d3d30] min-h-screen">
      {/* Header */}
      <section className="bg-[#4d3d30] text-[#f4f0ea] py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg">
          We’re here to help. Get in touch with us through the details below.
        </p>
      </section>

      {/* Contact Details */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-4">
              Feel free to contact us for inquiries, support, or feedback.
            </p>

            <div className="mb-6 flex items-start gap-4">
              {/* Phone Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.5A3.5 3.5 0 016.5 2h11A3.5 3.5 0 0121 5.5v13a3.5 3.5 0 01-3.5 3.5h-11A3.5 3.5 0 013 18.5v-13z"
                />
              </svg>
              <div>
                <h3 className="text-xl font-semibold">Phone Numbers</h3>
                <p className="text-lg">+91 83097 45617</p>
                <p className="text-lg">+91 91339 60303</p>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-4">
              {/* Location Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-[#4d3d30]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2c3.866 0 7 3.134 7 7 0 4.97-7 13-7 13S5 13.97 5 9c0-3.866 3.134-7 7-7z"
                />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold">Address</h3>
                <p>
                  Deccan Furniture, <br />
                  123 Elegant Street, <br />
                  Hyderabad, Telangana, 500001 <br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Find Us Here</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.9970452234287!2d78.46906257418566!3d17.385044047121798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97e8176c3b9f%3A0xab9e7e0f120eb5c5!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1673772484736!5m2!1sen!2sin"
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-[#4d3d30] text-[#f4f0ea] py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Deccan Furniture. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
