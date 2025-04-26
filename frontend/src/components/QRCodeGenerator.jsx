import { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import QRCode from 'react-qr-code'; // Updated import

function QRCodeGenerator({ url, doctorName }) {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareText = encodeURIComponent(`Check out Dr. ${doctorName}'s profile: ${url}`);
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-center">Share Doctor's Profile</h3>
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-2 border border-gray-200 rounded">
          <QRCode value={url} size={128} />
        </div>
        <p className="text-gray-600 text-center">Scan to share Dr. {doctorName}'s profile</p>
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <span className="mr-2">{showShareOptions ? 'Hide' : 'Show'} Share Options</span>
        </button>
        {showShareOptions && (
          <div className="flex justify-around w-full mt-2">
            <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
              <FaWhatsapp size={24} />
            </a>
            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={24} />
            </a>
            <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
              <FaInstagram size={24} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRCodeGenerator;
