import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Loader from '../components/Loader';

// Icons for features
import { FaCalendarCheck, FaVideo, FaHeartbeat, FaAmbulance, FaLungs, FaBed } from 'react-icons/fa';

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`);
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load doctors');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Features data
  const features = [
    {
      icon: <FaCalendarCheck className="text-4xl text-blue-600" />,
      title: 'Appointment Book',
      description: 'Schedule your visit with top doctors easily.',
      link: '/appointments',
    },
    {
      icon: <FaVideo className="text-4xl text-blue-600" />,
      title: 'Online Consult',
      description: 'Connect with specialists from anywhere.',
      link: '/consult',
    },
    {
      icon: <FaHeartbeat className="text-4xl text-blue-600" />,
      title: 'Book Health Checkup',
      description: 'Comprehensive health packages for you.',
      link: '/health-checkup',
    },
    {
      icon: <FaAmbulance className="text-4xl text-blue-600" />,
      title: 'Instant Ambulance',
      description: 'Emergency transport at your fingertips.',
      link: '/ambulance',
    },
    {
      icon: <FaLungs className="text-4xl text-blue-600" />,
      title: 'Get Your Oxygen',
      description: 'Reliable oxygen supply when needed.',
      link: '/oxygen',
    },
    {
      icon: <FaBed className="text-4xl text-blue-600" />,
      title: 'Bed Booking',
      description: 'Reserve hospital beds in advance.',
      link: '/bed-booking',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="h-full"
        >
          <SwiperSlide>
            <div className="relative h-full">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">Your Health, Our Priority</h1>
                  <p className="text-xl md:text-2xl mb-8 text-black">Find the best doctors and book appointments easily</p>
                  <Link
                    to="/doctors"
                    className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    Find Doctors <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-full">
              <img
                src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Medical Care"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black">Expert Medical Care</h1>
                  <p className="text-xl md:text-2xl mb-8 text-black">Access top specialists in various fields</p>
                  <Link
                    to="/doctors"
                    className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    Find Doctors <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                style={{ perspective: '1000px' }}
              >
                <div className="p-6 text-center transform transition-transform duration-300 group-hover:rotate-y-5">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;