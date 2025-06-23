import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhone } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Custom Tailwind CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 1s ease-in-out;
  }
  .animate-scale-in {
    animation: scale-in 0.8s ease-in-out;
  }
`;
document.head.appendChild(style);

// Icons for features
import { FaCalendarCheck, FaVideo, FaHeartbeat, FaAmbulance, FaLungs, FaBed } from 'react-icons/fa';

function Home() {
  // Features data
  const features = [
    {
      icon: <FaCalendarCheck className="w-12 h-12 text-blue-600" />,
      title: 'Appointment Book',
      description: 'Schedule your visit with top doctors easily.',
      link: '/all-doctors',
    },
    {
      icon: <FaVideo className="w-12 h-12 text-blue-600" />,
      title: 'Online Consult',
      description: 'Connect with specialists from anywhere.',
      link: '/not-available',
    },
    {
      icon: <FaHeartbeat className="w-12 h-12 text-blue-600" />,
      title: 'Book Health Checkup',
      description: 'Comprehensive health packages for you.',
      link: '/all-doctors',
    },
    {
      icon: <FaAmbulance className="w-12 h-12 text-blue-600" />,
      title: 'Instant Ambulance',
      description: 'Emergency transport at your fingertips.',
      link: '/not-available',
    },
    {
      icon: <FaLungs className="w-12 h-12 text-blue-600" />,
      title: 'Get Your Oxygen',
      description: 'Reliable oxygen supply when needed.',
      link: '/not-available',
    },
    {
      icon: <FaBed className="w-12 h-12 text-blue-600" />,
      title: 'Bed Booking',
      description: 'Reserve hospital beds in advance.',
      link: '/not-available',
    },
  ];

  // Expanded medical specialties data
  const specialties = [
    'Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Dermatology', 'Oncology',
    'Gastroenterology', 'Ophthalmology', 'Endocrinology', 'Urology', 'Pulmonology',
    'Rheumatology', 'Nephrology', 'Gynecology', 'Psychiatry', 'ENT',
    'Anesthesiology', 'Radiology', 'Pathology', 'Emergency Medicine', 'Family Medicine'
  ];

  // Why Choose Us data with stats
  const whyChooseUs = [
    {
      title: 'Expert Doctors',
      description: 'Board-certified specialists with extensive experience.',
      stat: '50+ Doctors',
    },
    {
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for precise diagnosis.',
      stat: '98% Accuracy',
    },
    {
      title: 'Patient Satisfaction',
      description: 'Committed to exceptional patient care.',
      stat: '97% Rating',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock medical assistance.',
      stat: '24/7 Available',
    },
  ];

  // Highlighted services data for ad banners
  const highlightedServices = [
    {
      title: 'Online Consultation',
      description: 'Consult top specialists from anywhere with secure video calls.',
      link: '/not-available',
      image: 'https://ik.imagekit.io/un5p4k39x/online%20consultation.jpg?updatedAt=1750146854831',
      icon: <FaVideo className="w-10 h-10 text-white" />,
    },
    {
      title: 'Ambulance Service',
      description: 'Rapid emergency response with fully equipped ambulances.',
      link: '/not-available',
      image: 'https://imgs.search.brave.com/Xg-0L00dV5fHlkhk7m6lXXeNSXP1xNcCAxdaPlKwmcQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvcGFyYW1lZGlj/LW1hbi13aXRoLWZp/cnN0LWFpZC1iYWct/YmFja2dyb3VuZC1h/bWJ1bGFuY2UtZW1l/cmdlbmN5LW1lZGlj/YWwtc2VydmljZS13/b3JrZXJfMTY1NDI5/LTEyNTYuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MA',
      icon: <FaAmbulance className="w-10 h-10 text-white" />,
    },
    {
      title: 'Oxygen Cylinder Service',
      description: 'Reliable delivery of medical-grade oxygen for critical care.',
      link: '/not-available',
      image: 'https://imgs.search.brave.com/sg1c7jstKC-tLdJW3uuh1qEGkb3t35LtkPFuCR9fwOc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTAz/MTM3NDg2L3Bob3Rv/L21lZGljYWwtb3h5/Z2VuLXR1YmUuanBn/P2I9MSZzPTYxMng2/MTImdz0wJms9MjAm/Yz1welRkT2hsUERM/Z3hQN1pmX09FWnBK/cE9OWnE1TkxMejA4/dUdlX0F6WDRJPQ',
      icon: <FaLungs className="w-10 h-10 text-white" />,
    },
  ];

  // Mission and goals data
  const missionPoints = [
    {
      title: 'Accessible Healthcare',
      description: 'Making quality healthcare accessible to everyone, everywhere.',
      icon: '🏥',
    },
    {
      title: 'Innovation in Medicine',
      description: 'Leveraging cutting-edge technology for better outcomes.',
      icon: '🔬',
    },
    {
      title: 'Compassionate Care',
      description: 'Treating every patient with dignity and empathy.',
      icon: '❤️',
    },
    {
      title: 'Excellence in Service',
      description: 'Maintaining the highest standards in medical care.',
      icon: '⭐',
    },
  ];

  // Console log to confirm component rendering
  console.log('Home component rendered successfully');

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    {/* Hero Section */}
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="text-5xl text-black md:text-7xl font-bold mb-6 animate-scale-in">
          Your Health, Our<span className="block" style={{ color: '001233' }}>Priority</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-black">
          Experience world-class healthcare with our expert medical team. Book appointments, consult specialists, and access emergency services - all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/all-doctors"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center"
          >
            Book Appointment <FaArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/contact"
            className=" text-black bg-red-500 hover:bg-red-700 hover:text-black-700 px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center"
          >
            Emergency Call <FaPhone className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
      {/* Floating Emergency Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/contact"
          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl animate-pulse"
        >
          <FaPhone className="w-6 h-6" />
        </Link>
      </div>
    </section>


      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your medical needs
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border-0"
              >
                <div className="p-8 text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transform group-hover:scale-105 transition-all duration-300 inline-flex items-center"
                  >
                    Learn More <FaArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Healthcare Solutions Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
        <div prostu className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Priority Healthcare Solutions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immediate access to critical medical services when you need them most
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlightedServices.map((service, index) => (
              <Link
                to={service.link}
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0"
              >
                <div className="relative h-[200px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    {service.icon}
                    <h3 className="text-xl font-bold text-gray-800 ml-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                    Explore Now <FaArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Priority Service
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Specialties Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://media.istockphoto.com/id/1418999473/photo/doctors-comforting-disabled-elderly-patient.jpg?s=612x612&w=0&k=20&c=ggVR5D9U8IY7irIrgvfqSmlLwA7se4vc2fRSAjV2lSs="
                alt="Doctor checking patient"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0  to-transparent rounded-2xl"></div>
            </div>
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
                Medical Specialties
                <span className="text-blue-600 block text-2xl font-normal mt-2">20+ Expert Departments</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive range of medical specialties ensures expert care for every health concern, backed by years of experience and cutting-edge technology.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {specialties.map((specialty, index) => (
                  <Link
                    to={`/specialty/${specialty.toLowerCase()}`}
                    key={index}
                    className="bg-white p-3 rounded-lg text-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <p className="text-sm font-medium group-hover:font-semibold">{specialty}</p>
                  </Link>
                ))}
              </div>
              <Link
                to="/all-doctors"
                className="mt-8 inline-flex bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg text-white rounded-full font-semibold transform hover:scale-105 transition-all duration-300"
              >
                View All Specialists <FaArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Aim and Goal Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission & Vision</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
              Transforming healthcare through innovation, compassion, and excellence. We're committed to making quality medical care accessible to everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 ">
            {missionPoints.map((point, index) => (
              <div
                key={index}
                className="bg-blue-200 backdrop-blur-md border-white/20 text-white rounded-2xl p-8 hover:bg-blue-250 transition-all duration-500 transform hover:scale-105 shadow-lg"
              >
                <div className="text-4xl mb-4">{point.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-2">{point.title}</h3>
                <p className="text-black text-lg">{point.description}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Our Vision for the Future</h3>
            <p className="text-lg leading-relaxed opacity-90 mb-6">
              To be the leading healthcare provider setting new standards in medical excellence, patient care, and healthcare innovation for all.
            </p>
            <div className="w-24 h-1 bg-black mx-auto my-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-black ">1k+</div>
                <div className="text-sm opacity-80">Patients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">50+</div>
                <div className="text-sm opacity-80">Expert Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">10+</div>
                <div className="text-sm opacity-80">Locations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence in healthcare
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="group text-center bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0"
              >
                <div className="p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {item.stat}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-20 bg-cover bg-center"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Health Journey?</h3>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Take the first step towards better health. Book your appointment today and experience world-class healthcare with our expert medical team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/all-doctors"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center"
                  >
                    Book Appointment Now <FaArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center"
                  >
                    Call Us: +91 1234567890 <FaPhone className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from those who have experienced our exceptional care
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Doe',
                quote: 'The online consultation was seamless, and the doctor was very professional. Highly recommend!',
              },
              {
                name: 'Jane Smith',
                quote: 'The ambulance service arrived quickly and saved my father’s life. Thank you!',
              },
              {
                name: 'Emily Johnson',
                quote: 'Booking a health checkup was so easy, and the staff was incredibly supportive.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-800 font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;