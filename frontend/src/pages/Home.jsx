import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import images
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";
import image4 from "../assets/images/image4.png";
import image5 from "../assets/images/image5.jpg";

const images = [
  { src: image1, buttonText: "Book Now", link: "/book-appointment" },
  { src: image2, buttonText: "Order Now", link: "/order-now" },
  { src: image3, buttonText: "Consult Now", link: "/consult-now" },
  { src: image4, buttonText: "Consult Now", link: "/call-now" },
];

const medicalSpecialties = [
  "Neurologist", "Orthopedic", "Cardiologist", "Dermatologist", "Pediatrician",
  "Gynecologist", "Oncologist", "Psychiatrist", "Radiologist", "Urologist",
  "Endocrinologist", "Nephrologist", "Pulmonologist",
  "Rheumatologist", "Hematologist", "Allergist", "Otolaryngologist", "Ophthalmologist",
  "Dentist", "Physiotherapist", "Dietitian", "Chiropractor", "Surgeon", "Anesthesiologist"
];

const ROW_SIZE = 4; // Number of specialties per row
const DEFAULT_ROWS = 4; // Number of rows visible by default

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const visibleSpecialtiesCount = showAllSpecialties
    ? medicalSpecialties.length
    : ROW_SIZE * DEFAULT_ROWS;

  return (
    <div className="relative ">
      {/* Slider Container */}
      <div className="relative w-full h-[490px] overflow-hidden" style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              {/* Image with Overlay for Better Text Contrast */}
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain"
                style={{ maxWidth: "1600px", maxHeight: "490px" }}
              />
            
              {/* Text and Button */}
              <div className="absolute top-95 left-220 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">{image.text}</h2>
                <Link
                  to={image.link}
                  className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  {image.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Our Main Features Section */}
      <div className="container mx-auto mt-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Main Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Boxes */}
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
            <p className="text-gray-600">Schedule appointments with doctors easily.</p>
          </Link>
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Consult Online</h3>
            <p className="text-gray-600">Get medical advice from the comfort of your home.</p>
          </Link>
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Bed Booking</h3>
            <p className="text-gray-600">Book hospital beds for emergencies.</p>
          </Link>
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Get Your Oxygen</h3>
            <p className="text-gray-600">Order oxygen supplies for critical needs.</p>
          </Link>
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Book Health Check-Up</h3>
            <p className="text-gray-600">Schedule comprehensive health check-ups.</p>
          </Link>
          <Link
            to="/about"
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Instant Ambulance</h3>
            <p className="text-gray-600">Call for an ambulance instantly in emergencies.</p>
          </Link>
        </div>
      </div>

      {/* Explore Our Centers of Clinical Excellence Section */}
      <div className="container mx-auto mt-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore Our Centers of Clinical Excellence
        </h2>
        <div className="flex flex-col lg:flex-row gap-4"> {/* Reduced gap from 8 to 4 */}
          {/* Image Section - Adjusted Positioning */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={image5}
              alt="Clinical Excellence"
              className="w-3/4 h-auto rounded-lg shadow-md"
              style={{ maxWidth: "612px", maxHeight: "408px" }} // Set to actual size
            />
          </div>

          {/* Medical Specialties Section */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-4 gap-4">
              {medicalSpecialties
                .slice(0, visibleSpecialtiesCount)
                .map((specialty, index) => {
                  // Map specialties to emojis/icons for a professional look
                  const specialtyIcon = {
                    Neurologist: "🧠",
                    Orthopedic: "🦴",
                    Cardiologist: "❤️",
                    Dermatologist: "🩺",
                    Pediatrician: "👶",
                    Gynecologist: "♀️",
                    Oncologist: "🎗️",
                    Psychiatrist: "🧘",
                    Radiologist: "📷",
                    Urologist: "💧",
                    Endocrinologist: "⏳",
                    Nephrologist: "🫀",
                    Pulmonologist: "🌬️",
                    Rheumatologist: "🤲",
                    Hematologist: "🩸",
                    Allergist: "🌸",
                    Otolaryngologist: "👂",
                    Ophthalmologist: "👁️",
                    Dentist: "🦷",
                    Physiotherapist: "🏋️",
                    Dietitian: "🥗",
                    Chiropractor: "💆",
                    Surgeon: "🔪",
                    Anesthesiologist: "💉",
                  }[specialty] || "";

                  return (
                    <Link
                      key={index}
                      to="/about"
                      className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow flex items-center justify-center min-h-[120px]" // Increased size
                    >
                      <h3 className="text-base font-semibold break-words">
                        {specialtyIcon} {specialty}
                      </h3>
                    </Link>
                  );
                })}
            </div>

            {/* View More / View Less Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                className="text-black hover:underline font-bold"
              >
                {showAllSpecialties ? "View Less" : "View All"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;