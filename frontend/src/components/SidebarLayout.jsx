import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SidebarLayout({ children, profileId, userRole, onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set active tab based on current path
    if (location.pathname.includes('/dashboard')) return 'dashboard';
    if (location.pathname.includes('/edit')) return 'edit';
    return 'profile';
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'profile':
        navigate(`/profile/${profileId}`);
        break;
      case 'edit':
        console.log('Edit tab clicked, navigating to:', `/edit-doctor/${profileId}`);
        if (userRole === 'doctor') {
          navigate(`/edit-doctor/${profileId}`);
        } else {
          navigate(`/register?id=${profileId}`);
        }
        break;
      case 'dashboard':
        navigate(`/dashboard/${profileId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this profile?')) {
          onDelete();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {userRole === 'doctor' ? 'Doctor' : 'User'} Menu
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleTabClick('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('edit')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'edit'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Edit Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('delete')}
                  className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-red-50"
                >
                  Delete Profile
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout; 