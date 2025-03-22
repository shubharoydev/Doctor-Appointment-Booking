import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function DoctorPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`);
        console.log('Doctor data fetched:', response.data); // Debug
        setDoctor(response.data);
      } catch (err) {
        console.error('Fetch doctor error:', err.response?.data || err.message);
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
    setError('');
  };

  const handlePlaceChange = (e) => {
    setSelectedPlace(e.target.value);
    setSelectedTime('');
    setError('');
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setError('');
  };

  const handleBookAppointment = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Please log in as a user to book an appointment');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole === 'doctor') {
      setError('Doctors cannot book appointments');
      return;
    }

    if (!selectedDay || !selectedPlace || !selectedTime) {
      setError('Please select a day, place, and time interval');
      return;
    }

    const [start, end] = selectedTime.split('-').map((t) => convertTo24Hour(t.trim()));
    console.log('Booking data:', { doctorId: id, day: selectedDay, place: selectedPlace, timeInterval: { start, end } }); // Debug

    if (window.confirm('Are you sure you want to book this appointment?')) {
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
        console.log('Booking response:', response.data); // Debug
        alert('Appointment booked successfully!');
        setError('');
        setSelectedDay('');
        setSelectedPlace('');
        setSelectedTime('');
        
        // Redirect to user profile to see the appointment
        const userId = localStorage.getItem('userId');
        if (userId) {
          navigate(`/profile/${userId}`);
        }
      } catch (err) {
        console.error('Book appointment error:', err.response?.data || err.message);
        if (err.response?.status === 400 && err.response?.data?.message?.includes('fully booked')) {
          setError('This slot is fully booked. Please select another time.');
        } else {
          setError(err.response?.data?.message || 'Failed to book appointment');
        }
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Doctor Profile</h1>

        <section className="mb-8">
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
              <img
                src={doctor?.picture || 'https://via.placeholder.com/64'}
                alt={doctor?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{doctor?.name}</h2>
              <p className="text-gray-600">{doctor?.experienceYears} years, {doctor?.specialist}</p>
              <p className="text-gray-600">{doctor?.education}</p>
              <p className="text-gray-600">Languages: {doctor?.language}</p>
              <p className="text-gray-600">Consultation Fees: ₹{doctor?.fees}</p>
              <p className="text-gray-600 mt-2">{doctor?.about || 'No description available.'}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Schedule</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-gray-600">Day</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Time Slot</th>
                  <th className="py-2 px-4 border-b text-left text-gray-600">Place</th>
                </tr>
              </thead>
              <tbody>
                {doctor?.schedule?.flatMap((sched, dayIndex) =>
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

          <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Appointment Slot</h3>
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
                {doctor?.schedule?.map((sched, index) => (
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
                {doctor?.schedule
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
                {doctor?.schedule
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
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={!selectedTime}
            >
              Book Appointment
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DoctorPublicProfile;