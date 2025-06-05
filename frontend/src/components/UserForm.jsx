import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import SidebarLayout from './SidebarLayout';

function UserForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id'); // Not used for creation, only for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    gender: '',
    address: '',
    picture: null,
    existingPictureUrl: '',
    bloodGroup: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/user/login');

    // Get the user ID for the sidebar
    const fetchUserId = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userResponse.data;
        setUserId(user._id || user.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();

    if (profileId) {
      fetchUserProfile(token);
    }
  }, [profileId, navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Store the existing picture URL separately
      const existingPictureUrl = response.data.picture;
      
      setFormData({
        ...response.data,
        picture: null, // Reset picture to avoid showing the old one in the form
        existingPictureUrl, // Keep track of the existing picture URL
        bloodGroup: response.data.bloodGroup || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
      });
    } catch (error) {
      console.error('Fetch user profile error:', error.response?.data || error.message); // Debug
      setError(error.response?.data?.message || 'Failed to load profile');
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('pincode', formData.pincode);
      formDataToSend.append('bloodGroup', formData.bloodGroup);

      if (formData.picture) {
        formDataToSend.append('picture', formData.picture);
      }

      const endpoint = profileId
        ? `${import.meta.env.VITE_API_BASE_URL}/api/users/${profileId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/users`;
      
      const method = profileId ? 'put' : 'post';

      const response = await axios[method](endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setPopup({
        isOpen: true,
        title: 'Success!',
        message: profileId ? 'Profile updated successfully' : 'Profile created successfully',
        type: 'success',
        onConfirm: () => navigate('/dashboard')
      });
    } catch (error) {
      setPopup({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save profile',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!profileId) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      setIsSubmitting(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      navigate('/');
    } catch (err) {
      console.error('Delete user profile error:', err.response?.data || err.message);
      setError('Failed to delete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're editing an existing profile, use the sidebar layout
  if (profileId) {
    return (
      <SidebarLayout profileId={profileId} userRole="user" onDelete={handleDelete}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isSubmitting && <Loader text={profileId ? "Updating profile..." : "Creating profile..."} />}
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
              Edit User Profile
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber || ''}
                    onChange={handleInputChange}
                    placeholder="10-digit phone number"
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for appointment booking</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
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
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <div className="mt-2 flex items-center">
                    {formData.existingPictureUrl ? (
                      <img
                        src={formData.existingPictureUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Address Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
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
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
          Complete Your Profile
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber || ''}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Required for appointment booking</p>
            </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
            <input
              type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
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
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="mt-2 flex items-center">
                {formData.existingPictureUrl ? (
                  <img
                    src={formData.existingPictureUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Address Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
              name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
                  name="state"
                  value={formData.state}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
            />
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-medium"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default UserForm;