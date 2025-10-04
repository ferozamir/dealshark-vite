import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: '💰',
      title: 'Earn Commissions',
      description: 'Get paid for every successful referral you make'
    },
    {
      icon: '📊',
      title: 'Track Performance',
      description: 'Monitor your earnings and referral analytics'
    },
    {
      icon: '🚀',
      title: 'Grow Your Income',
      description: 'Scale your referral business with our platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark flex">
      {/* Left Side - Content */}
      <div className="max-w-7xl flex  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-dealshark-yellow rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full opacity-10 animate-float delay-200"></div>
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-dealshark-yellow rounded-full opacity-15 animate-float delay-400"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full opacity-10 animate-float delay-300"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-12 animate-fade-in-left">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Welcome Back to
                <br />
                <span className="text-dealshark-yellow">DealShark!</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Sign in to your account and continue earning commissions on your referrals.
              </p>
            </div>

            <div className="space-y-8 animate-fade-in-left delay-200">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-6 group hover-lift">
                  <div className="w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8 animate-slide-in-top">
              <Link to="/" className="inline-flex items-center space-x-2 text-3xl font-bold hover-scale transition-bounce">
                <span className="text-white">Deal</span>
                <span className="text-dealshark-yellow">Shark</span>
                <SparklesIcon className="h-8 w-8 text-dealshark-yellow animate-pulse" />
              </Link>
            </div>

            <div className="auth-card animate-fade-in-up delay-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600 text-responsive-base">Sign in to your account to continue.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-top">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div className="flex bg-gray-100 rounded-xl p-1 animate-fade-in-up delay-200">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${formData.userType === 'customer'
                      ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'business' }))}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${formData.userType === 'business'
                      ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    Business
                  </button>
                </div>

                {/* Email Field */}
                <div className="animate-fade-in-up delay-300">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="custom-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="animate-fade-in-up delay-400">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="custom-input pr-12"
                      placeholder="Enter your password"
                      required
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
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between animate-fade-in-up delay-500">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-dealshark-blue focus:ring-dealshark-blue border-gray-300 rounded transition-colors"
                    />
                    <span className="ml-2 text-sm text-gray-600 font-medium">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-dealshark-blue hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 animate-fade-in-up delay-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 mb-6 animate-fade-in-up delay-700">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-800">
                <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center animate-fade-in-up delay-900">
                <p className="text-gray-600 text-responsive-base">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-dealshark-blue hover:text-blue-700 font-bold transition-colors duration-300 hover:underline"
                  >
                    Sign up for free
                  </Link>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  For businesses,{' '}
                  <Link
                    to="/business-onboarding"
                    className="text-dealshark-blue hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline"
                  >
                    register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;