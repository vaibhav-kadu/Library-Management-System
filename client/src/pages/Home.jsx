import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <header className="text-center d-flex align-items-center justify-content-center"
        style={{ height: "90vh" }}
      >
        <div
          className={`p-5 rounded shadow-lg ${
            theme === 'dark' 
              ? 'bg-gray-800/90 text-white border border-gray-700' 
              : 'bg-white/90 text-gray-900 border border-gray-200'
          }`}
          style={{ maxWidth: "700px" }}
        >
          <h1 className={`display-4 fw-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Library Management System
          </h1>
          <p className={`lead mt-3 mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your books, students, and librarians efficiently in one place.
          </p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="btn btn-primary btn-lg mt-3 px-5 py-3"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            Get Started
          </button>
        </div>
      </header>
    </>
  );
};

export default Home;