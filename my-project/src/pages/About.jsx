import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useMessages } from "../context/MessageContext";
import toast from "react-hot-toast";

const About = () => {
  const { sendMessage } = useMessages();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Send message
    const success = sendMessage({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      type: 'contact'
    });

    if (success) {
      toast.success("Message sent successfully! We'll get back to you soon.");
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } else {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About VavSport Hub</h1>
          <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              VavSport Hub is the premier sports management platform for Vav University.
              Established in 2024, our mission is to foster athletic excellence, promote
              team spirit, and provide a seamless experience for students, coaches, and fans alike.
            </p>
            <p className="mb-4">
              We manage over 20 different sports teams, organize annual championships,
              and maintain world-class facilities for our athletes. Our platform connects
              the entire university community through the love of sports.
            </p>
            <p>
              Whether you are looking to join a team, check match schedules, or just
              cheer for your friends, VavSport Hub is your go-to destination.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/images/university_entrance.jpg"
            alt="University Entrance"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 bg-blue-600 text-white">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8 text-blue-100">
              Have questions about joining a team or booking a facility?
              Reach out to us and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Visit Us</h3>
                  <p className="text-blue-100">University of Vavuniya<br />Playground, Indoor</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Phone />
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p className="text-blue-100">(+94) 24 222 2264</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Mail />
                <div>
                  <h3 className="font-semibold text-lg">Email Us</h3>
                  <p className="text-blue-100">sports@vavuniversity.edu</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={18} className="mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
