import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Contact Us</h2>
        <p className="text-center text-gray-600 mt-2">
          Have any questions? Feel free to reach out to us!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-blue-600 text-xl" />
              <span className="text-gray-700">+1 234 567 890</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-blue-600 text-xl" />
              <span className="text-gray-700">support@healthcareapp.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
              <span className="text-gray-700">123 Health Street, New York, USA</span>
            </div>
          </div>

          <form className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">Send us a message</h3>
            <div className="mt-4">
              <label className="block text-gray-600">Name</label>
              <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-600">Email</label>
              <input type="email" placeholder="Your Email" className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-600">Message</label>
              <textarea placeholder="Your Message" className="w-full p-2 border rounded-lg h-24"></textarea>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
