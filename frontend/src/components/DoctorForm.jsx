import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import SidebarLayout from './SidebarLayout';

function DoctorForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: routeId } = useParams();
  const doctorId = routeId || searchParams.get('id');
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    contactNumber: '',
    qualification: '',
    experienceYears: '',
    specialist: '',
    gender: '',
    fees: '',
    language: '',
    location: '',
    about: '',
    achievement: '',
    schedule: [],
    picture: null,
    existingPictureUrl: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    //console.log('DoctorForm: doctorId from URL:', doctorId);
    
    if (doctorId) {
      //console.log('DoctorForm: Fetching doctor data for ID:', doctorId);
      fetchDoctor(token);
    } else {
      console.log('DoctorForm: No doctorId found, creating new doctor profile');
    }
  }, [doctorId, navigate]);

  const fetchDoctor = async (token) => {
    try {
      //console.log('DoctorForm: Fetching doctor data from API for ID:', doctorId);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctor = response.data;
      //console.log('DoctorForm: Doctor data fetched successfully:', doctor);
      const updatedSchedule = doctor.schedule.map((sched) => ({
        ...sched,
        places: sched.places.map((place) => ({
          ...place,
          timeInterval: {
            start: convertTo12Hour(place.timeInterval.start),
            end: convertTo12Hour(place.timeInterval.end),
          },
        })),
      }));
      
      // Store the existing picture URL
      const existingPictureUrl = doctor.picture;
      
      setFormData({ 
        ...doctor, 
        schedule: updatedSchedule, 
        picture: null,
        existingPictureUrl // Add this to keep track of the existing picture
      });
    } catch (error) {
      console.error('Fetch doctor error:', error.response?.data || error.message); // Debug
      setError(error.response?.data?.message || 'Failed to load data');
    }
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return '10:00 AM';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${minutes} ${period}`;
  };

  const convertTo24Hour = (time12) => {
    if (!time12) return '10:00';
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const isValid12HourTime = (time) => {
    if (!time) return false;
    return /^([1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(time);
  };

  const addDay = () =>
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', places: [{ place: '', timeInterval: { start: '10:00 AM', end: '12:00 PM' }, maxPatients: '' }] }],
    });

  const handleScheduleChange = (index, e) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][e.target.name] = e.target.value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addPlace = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].places.push({ place: '', timeInterval: { start: '10:00 AM', end: '12:00 PM' }, maxPatients: '' });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handlePlaceChange = (dayIndex, placeIndex, e) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].places[placeIndex][e.target.name] = e.target.value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleTimeIntervalChange = (dayIndex, placeIndex, type, value) => {
    if (!isValid12HourTime(value)) {
      setError(`Invalid ${type} time format. Use HH:MM AM/PM (e.g., 10:00 AM)`);
      return;
    }
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].places[placeIndex].timeInterval[type] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
    setError('');
  };

  const removePlace = (dayIndex, placeIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].places.splice(placeIndex, 1);
    if (!updatedSchedule[dayIndex].places.length) updatedSchedule.splice(dayIndex, 1);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file); // Debug
    setFormData({ ...formData, picture: file });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    //console.log('DoctorForm: handleSubmit called, doctorId:', doctorId);

    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    // Validate schedule
    if (formData.schedule.length === 0) {
      setError('Please add at least one schedule day');
      setIsSubmitting(false);
      return;
    }

    for (const sched of formData.schedule) {
      if (!sched.day) {
        setError('Please select a day for each schedule entry');
        setIsSubmitting(false);
        return;
      }
      for (const place of sched.places) {
        if (!place.place || !place.maxPatients || !isValid12HourTime(place.timeInterval.start) || !isValid12HourTime(place.timeInterval.end)) {
          setError('Please fill in all place details with valid time formats (HH:MM AM/PM)');
          setIsSubmitting(false);
          return;
        }
      }
    }

    const data = new FormData();
    for (const key in formData) {
      if (key === 'schedule') {
        const formattedSchedule = formData.schedule.map((sched) => ({
          ...sched,
          places: sched.places.map((place) => ({
            ...place,
            timeInterval: {
              start: convertTo24Hour(place.timeInterval.start),
              end: convertTo24Hour(place.timeInterval.end),
            },
          })),
        }));
        data.append('schedule', JSON.stringify(formattedSchedule));
      } else if (key === 'picture' && formData[key]) {
        //console.log('DoctorForm: Appending picture to FormData');
        data.append('picture', formData[key]);
      } else if (key === 'existingPictureUrl') {
        // If no new picture is uploaded, use the existing one
        if (!formData.picture && formData[key]) {
          //console.log('DoctorForm: Using existing picture URL:', formData[key]);
          data.append('existingPictureUrl', formData[key]);
        }
      } else if (key !== 'picture' && key !== 'existingPictureUrl') {
        data.append(key, formData[key]);
      }
    }
    //console.log('DoctorForm: Submitting FormData:', [...data.entries()]); // Debug FormData entries

    try {
      let response;
      if (doctorId) {
        //console.log('DoctorForm: Updating existing doctor profile with ID:', doctorId);
        response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${doctorId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        //console.log('DoctorForm: Creating new doctor profile');
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      //console.log('DoctorForm: Submission successful, response:', response.data);
      navigate(`/profile/${response.data._id}`);
    } catch (error) {
      console.error('DoctorForm: Submission error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a handleDelete function for the sidebar
  const handleDelete = async () => {
    if (!doctorId) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      setIsSubmitting(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error('Delete doctor profile error:', err.response?.data || err.message);
      setError('Failed to delete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're editing an existing profile, use the sidebar layout
  if (doctorId) {
    return (
      <SidebarLayout profileId={doctorId} userRole="doctor" onDelete={handleDelete}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isSubmitting && <Loader text="Updating profile..." />}
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
              Edit Doctor Profile
            </h2>
            
            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  {formData.existingPictureUrl && (
                    <div className="mt-2 mb-2">
                      <p className="text-sm text-gray-500 mb-2">Current picture:</p>
                      <img 
                        src={formData.existingPictureUrl} 
                        alt="Current profile" 
                        className="w-32 h-32 object-cover rounded-full border border-gray-300"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.existingPictureUrl && (
                    <p className="text-xs text-gray-500 mt-1">Upload a new picture only if you want to change the current one.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Professional Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience Years</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialist</label>
                  <input
                    type="text"
                    name="specialist"
                    value={formData.specialist || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fees</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">About</label>
                  <textarea
                    name="about"
                    value={formData.about || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Achievement</label>
                  <textarea
                    name="achievement"
                    value={formData.achievement || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Schedule */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Schedule</h3>
                <button
                  type="button"
                  onClick={addDay}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                >
                  Add Day
                </button>
              </div>
              
              {formData.schedule.map((sched, dayIndex) => (
                <div key={dayIndex} className="mb-4 p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-grow mr-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                      <select
                        name="day"
                        value={sched.day}
                        onChange={(e) => handleScheduleChange(dayIndex, e)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Day</option>
                        {dayOptions.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => addPlace(dayIndex)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm mt-6"
                    >
                      Add Place
                    </button>
                  </div>
                  
                  {sched.places.map((place, placeIndex) => (
                    <div key={placeIndex} className="mb-3 p-3 border rounded-md bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                          <input
                            type="text"
                            name="place"
                            value={place.place}
                            onChange={(e) => handlePlaceChange(dayIndex, placeIndex, e)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="text"
                            value={place.timeInterval.start}
                            onChange={(e) => handleTimeIntervalChange(dayIndex, placeIndex, 'start', e.target.value)}
                            placeholder="10:00 AM"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="text"
                            value={place.timeInterval.end}
                            onChange={(e) => handleTimeIntervalChange(dayIndex, placeIndex, 'end', e.target.value)}
                            placeholder="12:00 PM"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex-grow mr-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients</label>
                            <input
                              type="number"
                              name="maxPatients"
                              value={place.maxPatients}
                              onChange={(e) => handlePlaceChange(dayIndex, placeIndex, e)}
                              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePlace(dayIndex, placeIndex)}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              {formData.schedule.length === 0 && (
                <p className="text-gray-500 italic">No schedule days added yet. Click "Add Day" to start.</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-medium"
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </SidebarLayout>
    );
  }

  // For new profile creation, use the original layout
  return (
    <div className="container mx-auto py-8">
      {isSubmitting && <Loader text="Creating profile..." />}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Doctor Registration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'education', 'contactNumber', 'qualification', 'experienceYears', 'specialist', 'fees', 'language', 'location'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type={field.includes('Years') || field === 'fees' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {['about', 'achievement'].map((field) => (
            <div key={field} className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800">Schedule</h3>
          <button type="button" onClick={addDay} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Add Day
          </button>
          {formData.schedule.map((schedule, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Day</label>
                <select
                  name="day"
                  value={schedule.day}
                  onChange={(e) => handleScheduleChange(dayIndex, e)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              {schedule.places.map((place, placeIndex) => (
                <div key={placeIndex} className="border p-4 rounded mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Place</label>
                      <input
                        type="text"
                        name="place"
                        value={place.place}
                        onChange={(e) => handlePlaceChange(dayIndex, placeIndex, e)}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time Interval</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={place.timeInterval.start}
                          onChange={(e) => handleTimeIntervalChange(dayIndex, placeIndex, 'start', e.target.value)}
                          placeholder="e.g., 10:00 AM"
                          className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <span className="self-center">to</span>
                        <input
                          type="text"
                          value={place.timeInterval.end}
                          onChange={(e) => handleTimeIntervalChange(dayIndex, placeIndex, 'end', e.target.value)}
                          placeholder="e.g., 12:00 PM"
                          className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Patients</label>
                      <input
                        type="number"
                        name="maxPatients"
                        value={place.maxPatients}
                        onChange={(e) => handlePlaceChange(dayIndex, placeIndex, e)}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlace(dayIndex, placeIndex)}
                    className="text-red-500 mt-2 hover:text-red-700"
                  >
                    Remove Place
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addPlace(dayIndex)}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
              >
                + Add Place
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default DoctorForm;