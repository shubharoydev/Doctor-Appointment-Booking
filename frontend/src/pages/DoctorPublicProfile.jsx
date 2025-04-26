import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MedicalLoader from '../components/Loader';
import ToastNotification from '../components/Popup';
import QRCodeGenerator from '../components/QRCodeGenerator';

function DoctorPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    confirmText: 'OK',
    showCancel: false,
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`);
        console.log('Fetch doctor response:', response.data); // Log response
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No doctor data returned');
        }
        setDoctor(response.data);
        setError('');
      } catch (err) {
        console.error('Fetch doctor error:', err.response?.data || err.message); // Log error
        setError(err.response?.data?.message || 'Failed to load doctor profile. Please try again later.');
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
      setToast({
        isOpen: true,
        title: 'Login Required',
        message: 'Please log in as a user to book an appointment',
        type: 'warning',
        onConfirm: () => navigate('/user/login'),
        confirmText: 'Login',
        showCancel: true,
      });
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole === 'doctor') {
      setToast({
        isOpen: true,
        title: 'Not Allowed',
        message: 'Doctors cannot book appointments. Please use a patient account.',
        type: 'error',
        showCancel: true,
      });
      return;
    }

    if (!selectedDay || !selectedPlace || !selectedTime) {
      setToast({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please select a day, place, and time interval',
        type: 'warning',
        showCancel: true,
      });
      return;
    }

    setToast({
      isOpen: true,
      title: 'Confirm Booking',
      message: 'Are you sure you want to book this appointment?',
      type: 'info',
      onConfirm: async () => {
        const [start, end] = selectedTime.split('-').map((t) => convertTo24Hour(t.trim()));
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointments/book`,
            {
              doctorId: id,
              day: selectedDay,
              place: selectedPlace,
              timeInterval: { start, end },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Book appointment response:', response.data); // Log response
          setToast({
            isOpen: true,
            title: 'Success',
            message: 'Appointment booked successfully!',
            type: 'success',
            onConfirm: () => {
              const userId = localStorage.getItem('userId');
              if (userId) {
                navigate(`/profile/${userId}`);
              }
            },
          });
          setError('');
          setSelectedDay('');
          setSelectedPlace('');
          setSelectedTime('');
        } catch (err) {
          console.error('Book appointment error:', err.response?.data || err.message); // Log error
          const errorMessage = err.response?.status === 400 && err.response?.data?.message?.includes('fully booked')
            ? 'This slot is fully booked. Please select another time.'
            : err.response?.data?.message || 'Failed to book appointment';
          setError(errorMessage);
          setToast({
            isOpen: true,
            title: 'Error',
            message: errorMessage,
            type: 'error',
            showCancel: true,
          });
        }
      },
      confirmText: 'Confirm',
      showCancel: true,
    });
  };

  if (loading) return <MedicalLoader text="Loading Doctor Profile..." />;
  if (error) return (
    <div className="container mx-auto py-8 px-4 text-center">
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/all-doctors')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Doctors
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastNotification
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onConfirm={toast.onConfirm}
        confirmText={toast.confirmText}
        showCancel={toast.showCancel}
      />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-4">
              <img
                src={doctor.picture || 'https://via.placeholder.com/96'}
                alt={doctor.name}
                className="w-full h-full object-cover"
                loading="lazy" // Lazy-load image
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">{doctor.name}</h2>
            <p className="text-gray-600 text-center">
              {doctor.experienceYears} years, {doctor.specialist}
            </p>
            <div className="mt-6 w-full">
              <QRCodeGenerator url={window.location.href} doctorName={doctor.name || 'Doctor'} />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Profile</h1>

          {/* About Section */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">About</h3>
            <p className="text-gray-600">{doctor.about || 'No description available.'}</p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600"><strong>Education:</strong> {doctor.education || 'N/A'}</p>
              <p className="text-gray-600"><strong>Languages:</strong> {doctor.language || 'N/A'}</p>
              <p className="text-gray-600"><strong>Consultation Fees:</strong> ₹{doctor.fees}</p>
            </div>
          </section>

          {/* Schedule Section */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Schedule</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-gray-600">Day</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Time Slot</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Place</th>
                  </tr>
                </thead>
                <tbody>
                  {doctor.schedule?.flatMap((sched, dayIndex) =>
                    sched.places.map((place, placeIndex) => (
                      <tr key={`${dayIndex}-${placeIndex}`} className="border-b">
                        <td className="py-2 px-4">{sched.day}</td>
                        <td className="py-2 px-4">
                          {`${convertTo12Hour(place.timeInterval.start)} - ${convertTo12Hour(place.timeInterval.end)}`}
                        </td>
                        <td className="py-2 px-4">{place.place}</td>
                      </tr>
                    ))
                  ) || <tr><td colSpan="3" className="py-2 px-4 text-center">No schedule available</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {/* Appointment Booking Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Book an Appointment</h3>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Day</label>
                <select
                  value={selectedDay}
                  onChange={handleDayChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a day</option>
                  {doctor.schedule?.map((sched, index) => (
                    <option key={index} value={sched.day}>{sched.day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Place</label>
                <select
                  value={selectedPlace}
                  onChange={handlePlaceChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedDay}
                >
                  <option value="">Select a place</option>
                  {doctor.schedule
                    ?.find((sched) => sched.day === selectedDay)
                    ?.places.map((place, index) => (
                      <option key={index} value={place.place}>{place.place}</option>
                    )) || []}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Time Interval</label>
                <select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedPlace}
                >
                  <option value="">Select a time interval</option>
                  {doctor.schedule
                    ?.find((sched) => sched.day === selectedDay)
                    ?.places.filter((place) => place.place === selectedPlace)
                    .map((place, index) => {
                      const timeSlot = `${convertTo12Hour(place.timeInterval.start)} - ${convertTo12Hour(place.timeInterval.end)}`;
                      return (
                        <option key={index} value={timeSlot}>
                          {timeSlot}
                        </option>
                      );
                    }) || []}
                </select>
              </div>
              <button
                onClick={handleBookAppointment}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                disabled={!selectedTime}
              >
                Book Appointment
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DoctorPublicProfile;