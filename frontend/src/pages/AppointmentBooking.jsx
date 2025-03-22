import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Popup from '../components/Popup';

function AppointmentBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    confirmText: 'OK',
    showCancel: false
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setPopup({
          isOpen: true,
          title: 'Error',
          message: 'No doctor found',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();

    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      setPopup({
        isOpen: true,
        title: 'Leave Page?',
        message: 'Are you sure you want to leave? Your booking progress will be lost.',
        type: 'warning',
        onConfirm: () => navigate('/'),
        confirmText: 'Leave',
        showCancel: true
      });
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [id, navigate]);

  const handleBooking = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setPopup({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to book an appointment',
        type: 'warning'
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments`,
        { doctorId: id, day: selectedDay, place: selectedPlace, timeInterval },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPopup({
        isOpen: true,
        title: 'Success!',
        message: 'Your appointment has been successfully booked.',
        type: 'success',
        onConfirm: () => navigate('/dashboard')
      });
    } catch (err) {
      setPopup({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.message || 'Failed to book appointment',
        type: 'error'
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-8">
      <Popup {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      
      {doctor && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Book Appointment with Dr. {doctor.name}</h2>
          {/* Add your booking form here */}
          <button
            onClick={handleBooking}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default AppointmentBooking;