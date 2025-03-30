import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
// import {QRCode} from 'qrcode.react';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLink, FaQrcode } from 'react-icons/fa';
import Popup from '../components/Popup';

function DoctorPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const convertTo24Hour = (time12) => {
    if (!time12) return '';
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
    setSelectedPlace('');
    setSelectedTime('');
  };

  const handlePlaceChange = (e) => {
    setSelectedPlace(e.target.value);
    setSelectedTime('');
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleBookAppointment = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please log in as a user to book an appointment',
        type: 'warning',
        onConfirm: () => navigate('/user/login')
      });
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole === 'doctor') {
      setPopup({
        isOpen: true,
        title: 'Not Allowed',
        message: 'Doctors cannot book appointments. Please use a patient account.',
        type: 'error'
      });
      return;
    }

    if (!selectedDay || !selectedPlace || !selectedTime) {
      setPopup({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please select a day, place, and time interval',
        type: 'warning'
      });
      return;
    }

    const [start, end] = selectedTime.split('-').map(t => t.trim());

    setPopup({
      isOpen: true,
      title: 'Confirm Booking',
      message: `Are you sure you want to book an appointment with Dr. ${doctor.name} on ${selectedDay} at ${selectedPlace} from ${start} to ${end}?`,
      type: 'info',
      showCancel: true,
      confirmText: 'Book Now',
      onConfirm: async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointments/book`,
            {
              doctorId: id,
              day: selectedDay,
              place: selectedPlace,
              timeInterval: { 
                start: convertTo24Hour(start), 
                end: convertTo24Hour(end) 
              },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setPopup({
            isOpen: true,
            title: 'Success!',
            message: 'Your appointment has been booked successfully!',
            type: 'success',
            onConfirm: () => {
              // Clear form
              setSelectedDay('');
              setSelectedPlace('');
              setSelectedTime('');
              
              // Navigate to user dashboard
              navigate('/dashboard');
            }
          });
        } catch (err) {
          let errorMessage = err.response?.data?.message || 'Failed to book appointment';
          if (errorMessage.includes('fully booked')) {
            errorMessage = 'This slot is fully booked. Please select another time.';
          }
          
          setPopup({
            isOpen: true,
            title: 'Booking Failed',
            message: errorMessage,
            type: 'error'
          });
        }
      }
    });
  };

  const currentUrl = window.location.href;
  const shareText = doctor ? `Check out Dr. ${doctor.name}'s profile` : 'Check out this doctor profile';
  const encodedShareText = encodeURIComponent(`${shareText}: ${currentUrl}`);
  
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedShareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: 'Link copied to clipboard',
        type: 'success'
      });
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-8 px-4">
      <Popup {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      
      {showQRPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQRPopup(false)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Scan QR Code</h3>
            <div className="flex justify-center mb-4">
              <QRCode 
                value={currentUrl} 
                size={250} 
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-gray-600 text-center mb-4">Scan with your phone camera to view this profile</p>
            <button
              onClick={() => setShowQRPopup(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {doctor && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Doctor Image and QR Code */}
            <div className="md:w-1/3 p-6 flex flex-col items-center border-r border-gray-200">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                <img
                  src={doctor.picture || 'https://via.placeholder.com/300?text=Doctor'}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
                <p className="text-gray-600">{doctor.specialist}</p>
                <p className="text-blue-600 font-semibold mt-1">{doctor.experienceYears} years of experience</p>
              </div>
              
              <div className="w-full">
                <button
                  onClick={() => setShowQRPopup(true)}
                  className="mb-4 w-full flex items-center justify-center bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  <FaQrcode className="mr-2" /> Show QR Code
                </button>
                
                <div className="flex justify-around mb-4">
                  <button
                    onClick={handleCopyLink}
                    className="text-gray-500 hover:text-gray-700 p-2"
                    title="Copy Link"
                  >
                    <FaLink size={24} />
                  </button>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 p-2"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp size={24} />
                  </a>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Share on Facebook"
                  >
                    <FaFacebook size={24} />
                  </a>
                  <button
                    onClick={() => {
                      alert('To share on Instagram, save the QR code and upload it with a caption');
                    }}
                    className="text-pink-600 hover:text-pink-800 p-2"
                    title="Share on Instagram"
                  >
                    <FaInstagram size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Doctor Details */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
                <p className="text-gray-600">{doctor.about || 'No information provided.'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Education</h2>
                  <p className="text-gray-600">{doctor.education || 'Not specified'}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Languages</h2>
                  <p className="text-gray-600">{doctor.language || 'Not specified'}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Consultation Fee</h2>
                  <p className="text-gray-600">₹{doctor.fees || 'Not specified'}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
                  <p className="text-gray-600">{doctor.contactNumber || 'Not specified'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Schedule</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Day</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Place</th>
                        <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctor.schedule?.flatMap((sched, dayIndex) =>
                        sched.places.map((place, placeIndex) => (
                          <tr key={`${dayIndex}-${placeIndex}`} className="border-b">
                            <td className="py-2 px-3">{sched.day}</td>
                            <td className="py-2 px-3">{place.place}</td>
                            <td className="py-2 px-3">{`${place.timeInterval.start} - ${place.timeInterval.end}`}</td>
                          </tr>
                        ))
                      ) || (
                        <tr>
                          <td colSpan="3" className="py-2 px-3 text-center">No schedule available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Appointment Booking Form */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Book an Appointment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Day</label>
                    <select
                      value={selectedDay}
                      onChange={handleDayChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a day</option>
                      {doctor.schedule?.map((sched, index) => (
                        <option key={index} value={sched.day}>{sched.day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Place</label>
                    <select
                      value={selectedPlace}
                      onChange={handlePlaceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      disabled={!selectedDay}
                    >
                      <option value="">Select a place</option>
                      {doctor.schedule
                        ?.find(sched => sched.day === selectedDay)
                        ?.places.map((place, index) => (
                          <option key={index} value={place.place}>{place.place}</option>
                        )) || []}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                    <select
                      value={selectedTime}
                      onChange={handleTimeChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      disabled={!selectedPlace}
                    >
                      <option value="">Select a time</option>
                      {doctor.schedule
                        ?.find(sched => sched.day === selectedDay)
                        ?.places.filter(place => place.place === selectedPlace)
                        .map((place, index) => {
                          const start = convertTo12Hour(place.timeInterval.start);
                          const end = convertTo12Hour(place.timeInterval.end);
                          return (
                            <option key={index} value={`${start} - ${end}`}>
                              {`${start} - ${end}`}
                            </option>
                          );
                        }) || []}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleBookAppointment}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={!selectedDay || !selectedPlace || !selectedTime}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPublicProfile;