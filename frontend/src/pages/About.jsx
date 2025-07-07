import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">
            <span style={{ color: '#14213D' }}>MEDI</span>
            <span style={{ color: '#2ec4b6' }}>LINK</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in healthcare, connecting you to seamless medical services with care and convenience.
          </p>
          <img
            src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Healthcare professional assisting a patient"
            className="w-full h-90 object-cover rounded-lg shadow-md mt-6"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white p-10 rounded-xl shadow-2xl mb-12">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Welcome to <span className="font-semibold" style={{ color: '#14213D' }}>MEDI</span><span style={{ color: '#2ec4b6' }}>LINK</span>, your one-stop platform for all your healthcare needs. We are dedicated to simplifying access to medical services, offering a seamless experience for online appointment booking, online consultations, health checkups, instant ambulance services, oxygen supply, and hospital bed booking.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Our mission is to bridge the gap between you and quality healthcare. With <span className="font-semibold" style={{ color: '#14213D' }}>MEDI</span><span style={{ color: '#2ec4b6' }}>LINK</span>, we aim to provide accessible, reliable, and compassionate care, ensuring your health is our top priority.
          </p>

          {/* Services Section */}
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#14213D' }}>Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Online Appointment Booking</h3>
                <p className="text-gray-600">Schedule offline checkups with top doctors at your convenience.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Online Consult</h3>
                <p className="text-gray-600">Connect with healthcare professionals virtually from anywhere.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Book Health Checkup</h3>
                <p className="text-gray-600">Schedule comprehensive health checkups tailored to your needs.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1m4 6v7m6-11H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Instant Ambulance</h3>
                <p className="text-gray-600">Access emergency ambulance services at the click of a button.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Get Your Oxygen</h3>
                <p className="text-gray-600">Arrange oxygen supplies quickly for critical needs.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <svg className="w-8 h-8" style={{ color: '#2ec4b6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M6 21h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Bed Booking</h3>
                <p className="text-gray-600">Reserve hospital beds for emergencies with ease.</p>
              </div>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#14213D' }}>Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#14213D' }}>Our Mission</h3>
              <p className="text-gray-600">
                To empower individuals with accessible, efficient, and compassionate healthcare solutions, ensuring seamless access to quality medical care.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#14213D' }}>Our Vision</h3>
              <p className="text-gray-600">
                To transform healthcare delivery by leveraging cutting-edge technology, creating a patient-centric experience worldwide.
              </p>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#14213D' }}>Why Choose MEDILINK?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center" style={{ color: '#2ec4b6' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Trusted & Reliable</h3>
                <p className="text-gray-600">Partnered with top hospitals and certified professionals for quality care.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center" style={{ color: '#2ec4b6' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">24/7 Availability</h3>
                <p className="text-gray-600">Access our services anytime, anywhere for your convenience.</p>
              </div>
            </div>
          </div>
          <img
            src="https://plus.unsplash.com/premium_photo-1702599099948-5ed43d0a3048?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern hospital facility"
            className="w-full h-80 object-cover rounded-lg shadow-md mb-8"
          />

          {/* Testimonials Section */}
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#14213D' }}>What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">"MEDILINK made booking my health checkup so easy and stress-free. Highly recommend!"</p>
              <p className="text-gray-800 font-semibold mt-4">– Sarah K.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">"The instant ambulance service saved us during an emergency. Thank you, MEDILINK!"</p>
              <p className="text-gray-800 font-semibold mt-4">– John M.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">
            Join thousands of satisfied users who trust <span style={{ color: '#14213D' }}>MEDI</span><span style={{ color: '#2ec4b6' }}>LINK</span> for their healthcare needs. Start your journey to better health today!
          </p>
          <a
            href="/all-doctors"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
            style={{ backgroundColor: '#2ec4b6' }}
          >
            Get Started Now
          </a>
        </div>
      </div>

      {/* Tailwind Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform匆

System: transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default About;