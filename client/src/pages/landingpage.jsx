import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Shield, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';

const LandingPage = ({ theme }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Book Management",
      description: "Efficiently manage your library's book collection with advanced search and categorization."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "User Management", 
      description: "Handle student and librarian accounts with role-based access control."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Secure Access",
      description: "Multi-level authentication ensures data security and proper access management."
    }
  ];

  const stats = [
    { number: "10K+", label: "Books Managed" },
    { number: "500+", label: "Active Users" },
    { number: "50+", label: "Libraries" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium backdrop-blur-sm ${
              theme === 'dark' 
                ? 'bg-blue-900/30 border-blue-700/50 text-blue-400' 
                : 'bg-blue-50/80 border-blue-200/50 text-blue-600'
            }`}>
              <Star className="h-4 w-4 mr-2" />
              #1 Library Management System
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Modern{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Library
              </span>{' '}
              Management
            </h1>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Streamline your library operations with our comprehensive management system. 
              Handle books, users, and transactions with ease.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/viewAllBooks')}
              className={`px-8 py-4 border-2 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'border-gray-600/50 text-white hover:bg-gray-800/50' 
                  : 'border-gray-300/50 text-gray-900 hover:bg-white/50'
              }`}
            >
              Browse Books
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.number}
                </div>
                <div className={`mt-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Everything you need to manage your library efficiently in one comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 backdrop-blur-sm rounded-2xl border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}
              >
                <div className={`mb-6 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-100/80'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Why Choose Our System?
              </h2>
              
              <div className="space-y-6">
                {[
                  "Intuitive interface designed for librarians",
                  "Real-time book availability tracking", 
                  "Advanced search and filtering capabilities",
                  "Comprehensive reporting and analytics",
                  "Mobile-responsive design",
                  "24/7 customer support"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className={`text-lg ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={`rounded-3xl p-8 backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20' 
                  : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20'
              }`}>
                <div className="space-y-6">
                  <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Improved Efficiency</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>85% faster book management</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <Users className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Better User Experience</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Simplified borrowing process</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-4 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <Shield className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Enhanced Security</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Role-based access control</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`backdrop-blur-sm rounded-3xl p-12 border ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-white/20' 
              : 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-white/20'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Transform Your Library?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of libraries worldwide who trust our management system to streamline their operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/viewAllBooks')}
                className={`px-8 py-4 border-2 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm ${
                  theme === 'dark' 
                    ? 'border-gray-600/50 text-white hover:bg-gray-800/50' 
                    : 'border-gray-300/50 text-gray-900 hover:bg-white/50'
                }`}
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;