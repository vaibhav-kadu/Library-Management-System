import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Shield, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';

const LandingPage = ({ theme }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Book Management",
      description: "Efficiently manage your library's book collection with advanced search and categorization."
    },
    {
      icon: <Users className="h-8 w-8" style={{color: 'var(--bs-success)'}} />,
      title: "User Management", 
      description: "Handle student and librarian accounts with role-based access control."
    },
    {
      icon: <Shield className="h-8 w-8" style={{color: '#8B5CF6'}} />,
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
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="position-relative min-vh-100 d-flex align-items-center justify-content-center px-3 px-md-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 text-center">
              {/* Hero Content */}
              <div className="mb-4 mb-md-5">
                <div className={`d-inline-flex align-items-center px-4 py-2 border rounded-pill mb-4 ${
                  theme === 'dark' 
                    ? 'bg-opacity-25 border-primary text-primary' 
                    : 'bg-light border-primary text-primary'
                }`}>
                  <Star className="me-2" size={16} />
                  <span className="small fw-medium">#1 Library Management System</span>
                </div>
                
                <h1 className={`display-3 display-md-1 fw-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-dark'
                }`}>
                  Modern{' '}
                  <span className="text-primary">
                    Library
                  </span>{' '}
                  Management
                </h1>
                
                <p className={`lead fs-4 mb-4 ${
                  theme === 'dark' ? 'text-white-50' : 'text-muted'
                }`}>
                  Streamline your library operations with our comprehensive management system. 
                  Handle books, users, and transactions with ease.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className="btn btn-primary btn-lg shadow-lg hover-lift"
                >
                  Get Started
                  <ArrowRight className="ms-2" size={20} />
                </button>
                
                <button
                  onClick={() => navigate('/viewAllBooks')}
                  className={`btn btn-outline-primary btn-lg ${
                    theme === 'dark' ? 'btn-outline-light' : ''
                  }`}
                >
                  Browse Books
                </button>
              </div>

              {/* Stats */}
              <div className="row g-4 mt-5">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <div className="text-center">
                      <div className={`display-4 fw-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-dark'
                      }`}>
                        {stat.number}
                      </div>
                      <div className="text-muted">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className={`display-5 fw-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-dark'
            }`}>
              Powerful Features
            </h2>
            <p className={`lead ${
              theme === 'dark' ? 'text-white-50' : 'text-muted'
            }`}>
              Everything you need to manage your library efficiently in one comprehensive platform.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className={`card border h-100 hover-lift ${
                  theme === 'dark' 
                    ? 'bg-surface border-secondary' 
                    : 'bg-light'
                }`}>
                  <div className="card-body p-4">
                    <div className={`d-inline-flex p-3 rounded-3 mb-3 ${
                      theme === 'dark' ? 'bg-dark' : 'bg-white'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className={`h4 fw-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-dark'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted mb-0">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6">
              <h2 className={`display-5 fw-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-dark'
              }`}>
                Why Choose Our System?
              </h2>
              
              <div className="d-flex flex-column gap-3">
                {[
                  "Intuitive interface designed for librarians",
                  "Real-time book availability tracking", 
                  "Advanced search and filtering capabilities",
                  "Comprehensive reporting and analytics",
                  "Mobile-responsive design",
                  "24/7 customer support"
                ].map((benefit, index) => (
                  <div key={index} className="d-flex align-items-start">
                    <CheckCircle className="text-success flex-shrink-0 me-3 mt-1" size={24} />
                    <p className={`mb-0 fs-5 ${
                      theme === 'dark' ? 'text-white-50' : 'text-muted'
                    }`}>
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className={`card border p-4 ${
                theme === 'dark' 
                  ? 'bg-surface border-secondary' 
                  : 'bg-light'
              }`}>
                <div className="d-flex flex-column gap-3">
                  <div className={`card p-3 ${
                    theme === 'dark' ? 'bg-dark' : 'bg-white'
                  }`}>
                    <div className="d-flex align-items-center">
                      <TrendingUp className="text-primary me-3" size={32} />
                      <div>
                        <h5 className={`mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-dark'
                        }`}>Improved Efficiency</h5>
                        <p className="text-muted small mb-0">85% faster book management</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`card p-3 ${
                    theme === 'dark' ? 'bg-dark' : 'bg-white'
                  }`}>
                    <div className="d-flex align-items-center">
                      <Users className="text-success me-3" size={32} />
                      <div>
                        <h5 className={`mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-dark'
                        }`}>Better User Experience</h5>
                        <p className="text-muted small mb-0">Simplified borrowing process</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`card p-3 ${
                    theme === 'dark' ? 'bg-dark' : 'bg-white'
                  }`}>
                    <div className="d-flex align-items-center">
                      <Shield style={{color: '#8B5CF6'}} className="me-3" size={32} />
                      <div>
                        <h5 className={`mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-dark'
                        }`}>Enhanced Security</h5>
                        <p className="text-muted small mb-0">Role-based access control</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;