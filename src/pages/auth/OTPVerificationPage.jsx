import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { verifyOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || 'user@example.com';

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      return;
    }

    setIsLoading(true);
    const result = await verifyOTP(email, otpString);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    
    // Implement resend OTP logic
    console.log('Resending OTP to:', email);
    
    // Reset countdown
    setCountdown(60);
    setCanResend(false);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start countdown on component mount
  useState(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure Verification',
      description: 'Your account is protected with industry-standard security'
    },
    {
      icon: SparklesIcon,
      title: 'Instant Access',
      description: 'Get immediate access to all DealShark features'
    },
    {
      icon: CheckCircleIcon,
      title: 'Verified Account',
      description: 'Join our community of verified users'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex">
      {/* Left Side - Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🦈</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DealShark</h1>
              <p className="text-sm text-gray-600">Referral Platform</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Almost there! 🎉
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've sent a verification code to your email address. 
              Enter the code below to complete your account setup and start earning.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Security Notice</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This verification code expires in 10 minutes. If you don't receive it, 
              check your spam folder or request a new code.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>Code valid for 10 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🦈</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DealShark</span>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify your email
              </h2>
              <p className="text-gray-600 mb-2">
                We've sent a 6-digit code to
              </p>
              <p className="font-semibold text-gray-900">{email}</p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    maxLength="1"
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                    isLoading || otp.join('').length !== 6
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <CheckCircleIcon className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Resend Section */}
            <div className="mt-8 text-center">
              <div className="mb-4">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="inline-flex items-center text-green-600 hover:text-green-500 font-medium transition-colors"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Resend code
                  </button>
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Resend code in {countdown}s</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                Didn't receive the code? Check your spam folder or{' '}
                <button className="text-green-600 hover:text-green-500 underline">
                  contact support
                </button>
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                    1
                  </div>
                  <span>Sign Up</span>
                </div>
                <div className="w-8 h-0.5 bg-green-500"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                    2
                  </div>
                  <span>Verify Email</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold mr-2">
                    3
                  </div>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
