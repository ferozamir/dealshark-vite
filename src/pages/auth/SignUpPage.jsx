import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, loading } = useAuth();
  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_type: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0]
    });
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (isBusinessSignup) {
      // Navigate to business onboarding
      navigate('/business-onboarding');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(formData.email, formData.password, formData.user_type, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone_number,
        user_type: formData.user_type,
        password: formData.password,
        confirm_password: formData.confirm_password,
        profile_picture: formData.profilePicture ? 'url' : null
      });

      if (result.success) {
        setSuccess('Registration successful! Please check your email for verification.');
        setTimeout(() => {
          navigate('/otp-verification', { 
            state: { 
              email: formData.email,
              password: formData.password
            } 
          });
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left Side - Welcome Section */}
            <div className="signup-welcome animate-fade-in-left">
              <div className="welcome-content text-white">
                <h2 className="welcome-title text-5xl font-bold mb-6 leading-tight">
                  Join <span className="text-dealshark-yellow">DealShark</span> Today
                </h2>
                <p className="welcome-subtitle text-xl text-purple-100 mb-12 leading-relaxed">
                  Start earning commissions from top brands and discover exclusive deals tailored just for you.
                </p>
                
                {/* Mascot above benefits */}
                <div className="mascot-container mb-12 animate-float">
                  <div className="w-32 h-32 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-6xl shadow-yellow">
                    🦈
                  </div>
                </div>
                
                <div className="welcome-benefits space-y-8">
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-200">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      💰
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Earn Up to 15% Commission</h4>
                      <p className="text-purple-100">Get paid for every successful referral you make</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-400">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      🏆
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Exclusive Deals</h4>
                      <p className="text-purple-100">Access special offers not available to the public</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-600">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      📊
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Track Your Success</h4>
                      <p className="text-purple-100">Monitor your earnings and performance in real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="signup-form-container animate-fade-in-right">
              <div className="signup-form-wrapper auth-card">
                <h1 className="signup-title text-3xl font-bold text-gray-900 mb-8 text-center">
                  Sign up to DealShark
                </h1>
                
                <div className="signup-type-switch flex bg-gray-100 rounded-xl p-1 mb-8">
                  <button 
                    className={`switch-btn flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      !isBusinessSignup
                        ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsBusinessSignup(false)}
                  >
                    Personal Account
                  </button>
                  <button 
                    className={`switch-btn flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isBusinessSignup
                        ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsBusinessSignup(true)}
                  >
                    Business Account
                  </button>
                </div>

                {error && (
                  <div className="error-message mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-top">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="success-message mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in-top">
                    <p className="text-green-600 text-sm font-medium">{success}</p>
                  </div>
                )}

                <form className="signup-form space-y-6" onSubmit={handleSubmit}>
                  <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group animate-fade-in-up delay-200">
                      <label htmlFor="firstName" className="form-label uppercase">FIRST NAME*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group animate-fade-in-up delay-300">
                      <label htmlFor="lastName" className="form-label uppercase">LAST NAME*</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group animate-fade-in-up delay-400">
                      <label htmlFor="email" className="form-label uppercase">EMAIL ADDRESS*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group animate-fade-in-up delay-500">
                      <label htmlFor="phone_number" className="form-label uppercase">PHONE*</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        placeholder="Enter Phone Number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group animate-fade-in-up delay-600">
                      <label htmlFor="password" className="form-label uppercase">PASSWORD*</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="custom-input pr-12"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group animate-fade-in-up delay-700">
                      <label htmlFor="confirm_password" className="form-label uppercase">CONFIRM PASSWORD*</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirm_password"
                          name="confirm_password"
                          placeholder="Enter Confirm Password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          className="custom-input pr-12"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirm_password && formData.password === formData.confirm_password && (
                        <div className="mt-2 flex items-center text-green-600 animate-fade-in-up">
                          <span className="text-sm font-medium">✓ Passwords match</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="form-group upload-section animate-fade-in-up delay-800">
                    <label className="form-label">Upload Profile Picture (Optional)</label>
                    <div className="upload-area border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-dealshark-blue transition-colors duration-300">
                      <div className="upload-content">
                        <div className="upload-icon text-4xl mb-4">☁️</div>
                        <p className="upload-text text-gray-700 font-medium mb-2">Please Upload Image</p>
                        <p className="upload-types text-gray-500 text-sm mb-4">Type: jpg, jpeg, png</p>
                        <input
                          type="file"
                          id="profilePicture"
                          name="profilePicture"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileChange}
                          className="file-input hidden"
                        />
                        <label htmlFor="profilePicture" className="file-label btn-primary cursor-pointer inline-block">
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="signup-btn w-full btn-secondary flex items-center justify-center space-x-2 animate-fade-in-up delay-900"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="signup-footer mt-8 text-center animate-fade-in-up delay-1000">
                  <p className="text-gray-600 text-responsive-base">
                    Already have an account?{' '}
                    <button 
                      className="login-link text-dealshark-blue hover:text-blue-700 font-bold transition-colors duration-300 hover:underline"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </button>
                  </p>
                </div>
                
                <div className="signup-divider mt-8 mb-6 animate-fade-in-up delay-1100">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>
                </div>
                
                <div className="social-signup grid grid-cols-2 gap-4 animate-fade-in-up delay-1200">
                  <button className="social-btn google-btn flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                    <span className="mr-2">🔍</span>
                    Google
                  </button>
                  <button className="social-btn facebook-btn flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                    <span className="mr-2">📘</span>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;