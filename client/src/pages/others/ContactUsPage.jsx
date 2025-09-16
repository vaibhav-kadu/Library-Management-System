import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Users, 
  Headphones, 
  CheckCircle,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Building,
  Calendar,
  Zap
} from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    userType: '',
    message: '',
    priority: 'medium'
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Handle form submission logic here
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "+91 9503213058",
      secondary: "+91 7083950651",
      description: "Available 24/7 for urgent issues",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Mail,
      title: "Email Support",
      primary: "vkadu02@gmail.com",
      secondary: "vkdon-2@gmail.com",
      description: "Response within 2 hours",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      primary: "123 Innovation Drive",
      secondary: "1st floor, Dangat Park, near Swarnaa Restaurant, Giridhar Nagar, Warje, Pune, Maharashtra 411058",
      description: "Mon-Fri: 9AM-6PM PST",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      primary: "Instant Support",
      secondary: "Available on website",
      description: "Quick answers to common questions",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  const supportTeam = [
    {
      name: "Vaibhav Kadu",
      role: "Backend Desigin & Developer",
      email: "vkadu02@gmail.com",
      phone: "+91 9503213058",
      avatar: "VK",
      speciality: "Implementation & Training",
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "Abhishek Yadav",
      role: "Frontend Designer & Developer",
      email: "vkdon02@gmail.com.com",
      phone: "+91 7083950651",
      avatar: "AY",
      speciality: "System Integration & API",
      color: "from-green-500 to-teal-600"
    }
  ];

  const faqItems = [
    {
      question: "How quickly can we implement the system?",
      answer: "Implementation typically takes 2-4 weeks depending on your library size and data migration needs."
    },
    {
      question: "Do you offer training for staff?",
      answer: "Yes! We provide comprehensive training sessions, video tutorials, and ongoing support for all staff levels."
    },
    {
      question: "Is there a free trial available?",
      answer: "We offer a 30-day free trial with full access to all features and dedicated support."
    },
    {
      question: "What about data security?",
      answer: "We use enterprise-grade encryption and comply with all major security standards including SOC 2 Type II."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative pt-10 pb-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
   
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Multiple Ways to Reach Us
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Choose the communication method that works best for you. Our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className={`${method.bgColor} rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mb-6 shadow-lg`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-gray-800">{method.primary}</p>
                  <p className="text-gray-600">{method.secondary}</p>
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h3>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h4>
                  <p className="text-green-600">We'll get back to you within 2 hours.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+91 9503213058"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Metro Public Library"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        User Type
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                </div>
              )}
            </div>

            {/* Company Info & Team */}
            <div className="space-y-12">
              {/* Company Info */}
              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-4">Follow Us</h5>
                    <div className="flex space-x-4">
                      <button className="w-10 h-10 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-colors flex items-center justify-center">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-blue-100 hover:bg-blue-400 text-blue-600 hover:text-white rounded-lg transition-colors flex items-center justify-center">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-blue-100 hover:bg-blue-700 text-blue-600 hover:text-white rounded-lg transition-colors flex items-center justify-center">
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white rounded-lg transition-colors flex items-center justify-center">
                        <Instagram className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Team */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {supportTeam.map((member, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${member.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                          {member.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{member.speciality}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center mx-auto">
              View All FAQs
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}