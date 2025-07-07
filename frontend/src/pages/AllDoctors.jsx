import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/all/doctors`);
        //console.log('Fetch doctors response:', response.data);
        
        // Check if data is an array and has items
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Dump the entire first doctor object to see all fields
          
          // Process doctors to add a unique identifier for each doctor
          const processedDoctors = response.data.map((doctor, index) => {
            // Create a doctorId field using any available identifier or fallback to index
            let doctorId = null;
            
            // Try different possible ID fields
            if (doctor._id) {
              doctorId = doctor._id;
              //console.log(`Doctor ${index} has _id:`, doctorId);
            } else if (doctor.id) {
              doctorId = doctor.id;
              //console.log(`Doctor ${index} has id:`, doctorId);
            } else if (doctor.user) {
              doctorId = doctor.user;
              //console.log(`Doctor ${index} has user id:`, doctorId);
            } else {
              // If no ID field is found, use the index as a last resort
              doctorId = `temp-${index}`;
              //console.log(`Doctor ${index} has no ID, using index:`, doctorId);
            }
            
            // Return doctor with guaranteed ID field
            return { ...doctor, doctorId };
          });
          
          //console.log('Processed doctors with IDs:', processedDoctors.map(d => ({ name: d.name, id: d.doctorId })));
          setDoctors(processedDoctors);
        } else {
          console.warn('No doctors found or invalid data format:', response.data);
          setDoctors([]);
        }
      } catch (err) {
        console.error('Fetch doctors error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const doctorCards = useMemo(() => {
    return doctors.map((doctor) => (
      <div key={doctor.doctorId} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src={doctor.picture || 'https://via.placeholder.com/64'}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
            loading="lazy"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialist}</p>
          </div>
        </div>
        <p className="text-gray-600">Experience: {doctor.experienceYears || 'N/A'} years</p>
        <p className="text-gray-600">Fees: ₹{doctor.fees}</p>
        <Link
          to={`/doctors/${doctor.doctorId}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={(e) => {
            // Log the doctor ID being used for navigation
           //console.log('Navigating to doctor profile with ID:', doctor.doctorId);
            //console.log('Full doctor object:', doctor);
            
            // If no valid ID or temporary ID, prevent navigation and show error
            if (!doctor.doctorId || doctor.doctorId.startsWith('temp-')) {
              e.preventDefault();
              console.error('No valid ID found for doctor:', doctor);
              alert('Error: Cannot view this doctor profile due to missing ID');
            }
          }}
        >
          View Profile
        </Link>
      </div>
    ));
  }, [doctors]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">All Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctorCards
        ) : (
          <p className="text-gray-600 text-center col-span-full">No doctors available.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorList;