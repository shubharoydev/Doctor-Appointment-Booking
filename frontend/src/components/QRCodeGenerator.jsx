import { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

function QRCodeGenerator({ url, doctorName }) {
  const [showShareOptions, setShowShareOptions] = useState(false);

  // URL encode the share text
  const shareText = encodeURIComponent(`Check out Dr. ${doctorName}'s profile: ${url}`);
  
  // Create share URLs
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const facebookShareUrl = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
  const instagramShareUrl = `https://www.instagram.com/direct/new/?text=${shareText}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Share Doctor's Profile</h3>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <span className="mr-2">Share Profile</span>
        </button>
        
        {showShareOptions && (
          <div className="flex justify-around mt-2">
            <a 
              href={whatsappShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700"
            >
              <FaWhatsapp size={24} />
            </a>
            <a 
              href={facebookShareUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook size={24} />
            </a>
            <a 
              href={instagramShareUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRCodeGenerator;