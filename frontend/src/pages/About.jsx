import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to <span className="font-semibold text-blue-600">HealthCare Connect</span>, your trusted partner in managing your healthcare needs. We are dedicated to providing seamless and reliable services for appointment booking, bed booking, oxygen booking, and health check-up booking.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our mission is to make healthcare accessible and convenient for everyone. Whether you need to consult a doctor, book a hospital bed, arrange oxygen supplies, or schedule a comprehensive health check-up, we are here to help you every step of the way.
        </p>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Services</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
          <li className="mb-2">Appointment Booking: Schedule consultations with top doctors.</li>
          <li className="mb-2">Bed Booking: Reserve hospital beds for emergencies.</li>
          <li className="mb-2">Oxygen Booking: Arrange oxygen supplies for critical needs.</li>
          <li className="mb-2">Health Check-Up: Book comprehensive health check-ups.</li>
        </ul>
        <p className="text-lg text-gray-700 mb-6">
          At <span className="font-semibold text-blue-600">HealthCare Connect</span>, we prioritize your health and well-being. Our team of professionals is committed to delivering exceptional service and ensuring a hassle-free experience for all our users.
        </p>
        <p className="text-lg text-gray-700">
          Thank you for choosing us. We look forward to serving you and helping you achieve your health goals.
        </p>
      </div>
    </div>
  );
};

export default About;