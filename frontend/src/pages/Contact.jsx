import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaQuestionCircle } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold animate-fade-in">
            <span style={{ color: '#14213D' }}>Contact MEDI</span>
            <span style={{ color: '#2ec4b6' }}>LINK</span>
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            We're here to assist you with all your healthcare needs. Reach out to us anytime!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#14213D' }}>Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FaPhoneAlt className="text-2xl" style={{ color: '#000000' }} />
                <span className="text-gray-700 text-lg">+91 8391850802</span>
              </div>
              <div className="flex items-center space-x-4">
                <FaEnvelope className="text-2xl" style={{ color: '#e2320c' }} />
                <span className="text-gray-700 text-lg">medilink.79@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className="text-2xl" style={{ color: '#3d4fd7' }} />
                <span className="text-gray-700 text-lg">Salt Lake Sector 5, Kolkata, West Bengal, India</span>
              </div>
            </div>
            {/* Map Placeholder */}
          <div className="mt-8">
 <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.238738469767!2d88.6560737!3d22.8421398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8b1e7c4c8b2b3%3A0x4b7c1e3c8f9a2d5!2sHabra%2C%20West%20Bengal%2C%20India!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
    width="100%"
    height="400"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-lg shadow-md"
    title="Habra, West Bengal, India Map"
></iframe>
</div>

          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#14213D' }}>Send Us a Message</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Message</label>
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <div
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg w-full text-center cursor-pointer hover:bg-blue-700 transition duration-300"
                style={{ backgroundColor: '#2ec4b6' }}
                onClick={() => alert('Message sent! We will get back to you soon.')}
              >
                Send Message
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 rounded-xl shadow-2xl mb-12">
          <h3 className="text-3xl font-bold mb-6" style={{ color: '#14213D' }}>Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="text-2xl" style={{ color: '#2ec4b6' }} />
                <h4 className="text-xl font-semibold text-gray-800">How do I book an appointment?</h4>
              </div>
              <p className="text-gray-600 mt-2">
               Visit our Services page and select "Online Appointment Booking" to get started. Browse through the list of available doctors, view their profiles, and choose a suitable time slot to book your offline checkup or online consultation easily.

              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="text-2xl" style={{ color: '#2ec4b6' }} />
                <h4 className="text-xl font-semibold text-gray-800">Is the ambulance service available 24/7?</h4>
              </div>
              <p className="text-gray-600 mt-2">
                Yes, our instant ambulance service is available round-the-clock to ensure you get help when you need it most.(Currently Unavailable)
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="text-2xl" style={{ color: '#2ec4b6' }} />
                <h4 className="text-xl font-semibold text-gray-800">How quickly can I get oxygen supplies?</h4>
              </div>
              <p className="text-gray-600 mt-2">
                We prioritize urgent requests and aim to deliver oxygen supplies within hours, depending on availability and location.(Currently Unavailable)
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">
            Ready to experience seamless healthcare with <span style={{ color: '#14213D' }}>MEDI</span><span style={{ color: '#2ec4b6' }}>LINK</span>? Contact us today!
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
            style={{ backgroundColor: '#2ec4b6' }}
          >
            Explore Our Services
          </a>
        </div>
      </div>

      {/* Tailwind Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
      </style>
    </div>
  );
};

export default Contact;