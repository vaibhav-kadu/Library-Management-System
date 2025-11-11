import React, { useState } from 'react';
import { User, BookOpen, Shield, Eye, EyeOff, Mail, Lock, X } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login({ onClose, theme }) {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState({ student: false, librarian: false, admin: false });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    student: { email: '', password: '' },
    librarian: { email: '', password: '' },
    admin: { email: '', password: '' }
  });

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (tab) => {
    setShowPassword(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    const credentials = formData[userType];

    if (!credentials.email || !credentials.password) {
      setError("Please fill in both email and password");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const apiEndpoint = userType === 'student' ? 'loginStudent' :
                         userType === 'librarian' ? 'loginLibrarian' : 'loginAdmin';

      const response = await api.post(`/${apiEndpoint}`, credentials);

      if (response.data.success) {
        login(response.data);
        
        const role = response.data.user?.role;
        
        if (role === "student") {
          navigate('/student-dashboard');
        } else if (role === "librarian") {
          navigate('/librarian-dashboard');
        } else if (role === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
        
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || "Server Error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabColors = {
    student: 'primary',
    librarian: 'success',
    admin: 'danger',
  };

  const getTabClasses = (tabId) => {
    const color = tabColors[tabId];
    if (activeTab === tabId) {
      return `flex-fill btn btn-${color}`;
    }
    return `flex-fill btn ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`;
  };

  const renderForm = (userType, title) => {
    const data = formData[userType];

    return (
      <form
        onSubmit={(e) => handleSubmit(e, userType)}
        className={activeTab === userType ? '' : 'd-none'}
      >
        {error && (
          <div className={`alert alert-danger ${isDark ? 'bg-danger bg-opacity-10' : ''}`}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <Mail size={20} />
            </span>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange(userType, 'email', e.target.value)}
              className={`form-control ${isDark ? 'bg-dark text-white' : ''}`}
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <Lock size={20} />
            </span>
            <input
              type={showPassword[userType] ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => handleInputChange(userType, 'password', e.target.value)}
              className={`form-control ${isDark ? 'bg-dark text-white' : ''}`}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(userType)}
              className="btn btn-outline-secondary"
            >
              {showPassword[userType] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            onClick={() => alert('Forgot password flow not implemented')}
            className="btn btn-link text-decoration-none p-0"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className={`btn btn-${tabColors[userType]} w-100`}
          disabled={submitting}
        >
          {submitting ? "Signing In..." : `Sign In as ${title}`}
        </button>
      </form>
    );
  };

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-content ${isDark ? 'bg-surface text-white' : ''}`}>
          <div className={`modal-header border-bottom ${isDark ? 'border-secondary' : ''}`}>
            <div className="w-100 text-center">
              <h5 className={`modal-title ${isDark ? 'text-white' : 'text-dark'}`}>
                Welcome Back
              </h5>
              <p className="text-muted mb-0">Sign in to your account</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className={`btn-group w-100 mb-4 ${isDark ? 'bg-dark' : 'bg-light'} p-1 rounded`}>
              <button onClick={() => setActiveTab('student')} className={getTabClasses('student')}>
                <User size={16} className="me-2" />
                Student
              </button>
              <button onClick={() => setActiveTab('librarian')} className={getTabClasses('librarian')}>
                <BookOpen size={16} className="me-2" />
                Librarian
              </button>
              <button onClick={() => setActiveTab('admin')} className={getTabClasses('admin')}>
                <Shield size={16} className="me-2" />
                Admin
              </button>
            </div>

            {renderForm('student', 'Student')}
            {renderForm('librarian', 'Librarian')}
            {renderForm('admin', 'Admin')}
          </div>
        </div>
      </div>
    </div>
  );
}