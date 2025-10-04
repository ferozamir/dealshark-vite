import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon, XMarkIcon, SparklesIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { authService, uploadService } from '../../services';

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    userDesignation: '',
    businessEmail: '',
    businessPhone: '',
    businessDescription: '',
    businessLogo: null,
    // businessCoverImage: null,

    // Step 2: Legal Info
    registrationNo: '',
    businessWebsite: '',
    businessAddress: '',
    businessState: '',
    businessCity: '',
    businessCountry: '',
    businessIndustry: '',

    // Step 3: Promotion
    createDeal: '',
    dealTitle: '',
    dealDescription: '',
    dealType: '',
    noRewardReason: '',
    customerIncentive: '',
    dealPosterOptions: '',
    noDealReason: '',
    agreeCommunications: false,
    agreeDataProcessing: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      try {
        setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));

        // Simulate file upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [fieldName]: progress }));
        }

        // Simulate successful upload
        const mockUrl = URL.createObjectURL(file);
        setFormData({
          ...formData,
          [fieldName]: mockUrl
        });

        setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
      } catch (error) {
        console.error('File upload failed:', error);
        setError('File upload failed. Please try again.');
      }
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email &&
          formData.phone_number && formData.businessName && formData.userDesignation &&
          formData.businessEmail && formData.businessPhone && formData.businessDescription &&
          formData.password && formData.confirmPassword &&
          formData.password === formData.confirmPassword && formData.businessLogo;
      case 2:
        return formData.registrationNo && formData.businessWebsite && formData.businessAddress &&
          formData.businessState && formData.businessCity && formData.businessCountry && formData.businessIndustry;
      case 3:
        return formData.createDeal && 
          ((formData.createDeal === 'yes' && formData.dealTitle && formData.dealDescription && formData.dealType) ||
           (formData.createDeal === 'no' && formData.noDealReason)) &&
          formData.agreeDataProcessing;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
        setError('');
      } else {
        setError('Please fill in all required fields before proceeding.');
      }
    } else {
      // Handle form submission
      if (validateStep(3)) {
        setIsSubmitting(true);
        setError('');

        try {
          const businessData = {
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_name: formData.businessName,
            business_email: formData.businessEmail,
            business_phone: formData.businessPhone,
            business_description: formData.businessDescription,
            website: formData.businessWebsite,
            registration_no: formData.registrationNo,
            business_address: formData.businessAddress,
            business_city: formData.businessCity,
            business_state: formData.businessState,
            business_country: formData.businessCountry,
            industry: formData.businessIndustry,
            business_logo_url: formData.businessLogo,
            // Deal creation data
            deal: formData.createDeal === 'yes' ? {
              deal_name: formData.dealTitle,
              deal_description: formData.dealDescription,
              reward_type: formData.dealType === 'commission' ? 'commission' : 'no_reward',
              customer_incentive: formData.customerIncentive,
              no_reward_reason: formData.noRewardReason
            } : null,
            no_deal_reason: formData.createDeal === 'no' ? formData.noDealReason : null,
          };

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));

          setSuccess('Business registration successful! Please check your email for verification.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          setError('Registration failed. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setError('Please fill in all required fields.');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Details', active: currentStep >= 1 },
    { id: 2, title: 'Legal Info', active: currentStep >= 2 },
    { id: 3, title: 'Promotion', active: currentStep >= 3 }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'No Upfront Costs',
      description: 'Start earning without any initial investment'
    },
    {
      icon: '🛡️',
      title: 'Risk-Free Platform',
      description: 'Only pay when customers make real purchases'
    },
    {
      icon: '🎯',
      title: 'You Set the Rewards',
      description: 'Control your commission rates and incentives'
    },
    {
      icon: '📈',
      title: 'Real Customer Growth',
      description: 'Get new customers through word-of-mouth referrals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark flex">
      {/* Left Side - Content */}
      <div className="max-w-7xl flex mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                Grow Your Business with
                <br />
                <span className="text-dealshark-yellow">DealShark!</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of businesses already earning through our referral platform. No upfront costs, no risks.
              </p>
            </div>

            <div className="space-y-8 animate-fade-in-left delay-200">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-6 group hover-lift">
                  <div className="w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{benefit.title}</h3>
                    <p className="text-blue-100 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-2xl">
            {/* Logo */}
            <div className="text-center mb-8 animate-slide-in-top">
              <div className="inline-flex items-center space-x-2 text-3xl font-bold hover-scale transition-bounce">
                <span className="text-white">Deal</span>
                <span className="text-dealshark-yellow">Shark</span>
                <SparklesIcon className="h-8 w-8 text-dealshark-yellow animate-pulse" />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8 animate-fade-in-up delay-200">
              <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step.active
                      ? currentStep === step.id
                        ? 'bg-dealshark-yellow text-gray-900 shadow-yellow animate-pulse-gentle'
                        : 'bg-white text-dealshark-blue shadow-lg'
                      : 'bg-white/20 text-white'
                      }`}>
                      {step.active && currentStep !== step.id ? <CheckIcon className="h-5 w-5" /> : step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${step.active ? 'bg-dealshark-yellow' : 'bg-white/20'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </h2>
                <p className="text-blue-100 text-sm">Complete all fields to continue</p>
              </div>
            </div>

            {/* Form */}
            <div className="auth-card animate-fade-in-up delay-300">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-top">
                  <div className="flex items-center">
                    <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in-top">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-600 text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-100">
                      <label htmlFor="firstName" className="form-label">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-200">
                      <label htmlFor="lastName" className="form-label">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-300">
                      <label htmlFor="email" className="form-label">
                        User Email *
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
                    <div className="animate-fade-in-up delay-400">
                      <label htmlFor="phone_number" className="form-label">
                        User Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Name and Designation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-500">
                      <label htmlFor="businessName" className="form-label">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter your business name"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-600">
                      <label htmlFor="userDesignation" className="form-label">
                        User Designation *
                      </label>
                      <input
                        type="text"
                        id="userDesignation"
                        name="userDesignation"
                        value={formData.userDesignation}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="e.g., CEO, Manager, Owner"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-700">
                      <label htmlFor="businessEmail" className="form-label">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        id="businessEmail"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter business email address"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-800">
                      <label htmlFor="businessPhone" className="form-label">
                        Business Phone *
                      </label>
                      <input
                        type="tel"
                        id="businessPhone"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter business phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Description */}
                  <div className="animate-fade-in-up delay-900">
                    <label htmlFor="businessDescription" className="form-label">
                      Business Description *
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows="4"
                      className="custom-input resize-none"
                      placeholder="Describe your business and what you offer"
                      required
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-1000">
                      <label htmlFor="password" className="form-label">
                        Password *
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
                    <div className="animate-fade-in-up delay-1100">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="custom-input pr-12"
                          placeholder="Confirm your password"
                          required
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
                    </div>
                  </div>

                  {/* Image Upload Sections */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="animate-fade-in-up delay-1200">
                      <label className="form-label">
                        Business Logo *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-dealshark-blue transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-dealshark-blue rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div className='flex flex-col gap-4'>
                            <div className="flex-1">
                              <p className="text-gray-700 text-sm font-medium">Upload Business Logo</p>
                              <p className="text-gray-500 text-xs">JPG, PNG up to 5MB</p>
                            </div>
                            <div>
                              <input
                                type="file"
                                id="businessLogo"
                                name="businessLogo"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <label htmlFor="businessLogo" className="btn-primary text-sm cursor-pointer">
                                Choose File
                              </label>
                            </div>
                          </div>
                        </div>
                        {uploadProgress.businessLogo !== undefined && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-dealshark-blue h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.businessLogo}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress.businessLogo}% uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <div className="animate-fade-in-up delay-1300">
                      <label className="form-label">
                        Business Cover Image (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-dealshark-blue transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 text-sm font-medium">Upload Cover Image</p>
                            <p className="text-gray-500 text-xs">JPG, PNG up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            id="businessCoverImage"
                            name="businessCoverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="businessCoverImage" className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-700 transition-colors">
                            Choose File
                          </label>
                        </div>
                        {uploadProgress.businessCoverImage !== undefined && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.businessCoverImage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress.businessCoverImage}% uploaded</p>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="animate-fade-in-up delay-100">
                    <label htmlFor="registrationNo" className="form-label">
                      REGISTRATION NO.*
                    </label>
                    <input
                      type="text"
                      id="registrationNo"
                      name="registrationNo"
                      value={formData.registrationNo}
                      onChange={handleInputChange}
                      className="custom-input"
                      placeholder="Enter registration no."
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up delay-200">
                    <label htmlFor="businessWebsite" className="form-label">
                      BUSINESS WEBSITE*
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">https://</span>
                      <input
                        type="text"
                        id="businessWebsite"
                        name="businessWebsite"
                        value={formData.businessWebsite}
                        onChange={handleInputChange}
                        className="custom-input pl-16"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in-up delay-300">
                    <label htmlFor="businessAddress" className="form-label">
                      BUSINESS ADDRESS*
                    </label>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      className="custom-input"
                      placeholder="Enter Business Address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up delay-400">
                      <label htmlFor="businessState" className="form-label">
                        BUSINESS STATE*
                      </label>
                      <input
                        type="text"
                        id="businessState"
                        name="businessState"
                        value={formData.businessState}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter Business State"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-500">
                      <label htmlFor="businessCity" className="form-label">
                        BUSINESS CITY*
                      </label>
                      <input
                        type="text"
                        id="businessCity"
                        name="businessCity"
                        value={formData.businessCity}
                        onChange={handleInputChange}
                        className="custom-input"
                        placeholder="Enter Business City"
                        required
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in-up delay-600">
                    <label htmlFor="businessCountry" className="form-label">
                      BUSINESS COUNTRY*
                    </label>
                    <input
                      type="text"
                      id="businessCountry"
                      name="businessCountry"
                      value={formData.businessCountry}
                      onChange={handleInputChange}
                      className="custom-input"
                      placeholder="Enter Business Country"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up delay-700">
                    <label htmlFor="businessIndustry" className="form-label">
                      BUSINESS INDUSTRY*
                    </label>
                    <input
                      type="text"
                      id="businessIndustry"
                      name="businessIndustry"
                      value={formData.businessIndustry}
                      onChange={handleInputChange}
                      className="custom-input"
                      placeholder="Enter Business Industry"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="animate-fade-in-up delay-100">
                    <label className="form-label">
                      Do you want to Create a Deal?*
                    </label>
                    <div className="flex space-x-6 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="createDeal"
                          value="yes"
                          checked={formData.createDeal === 'yes'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="createDeal"
                          value="no"
                          checked={formData.createDeal === 'no'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.createDeal === 'yes' && (
                    <>
                      <div className="animate-fade-in-up delay-200">
                        <label htmlFor="dealTitle" className="form-label">
                          DEAL/OFFER TITLE*
                        </label>
                        <input
                          type="text"
                          id="dealTitle"
                          name="dealTitle"
                          value={formData.dealTitle}
                          onChange={handleInputChange}
                          className="custom-input"
                          placeholder="Enter Deal/Offer Name"
                          required
                        />
                      </div>

                      <div className="animate-fade-in-up delay-300">
                        <label htmlFor="dealDescription" className="form-label">
                          DEAL/OFFER DESCRIPTION*
                        </label>
                        <textarea
                          id="dealDescription"
                          name="dealDescription"
                          value={formData.dealDescription}
                          onChange={handleInputChange}
                          rows="4"
                          className="custom-input resize-none"
                          placeholder="Enter deal description here..."
                          required
                        />
                      </div>

                      <div className="animate-fade-in-up delay-400">
                        <label className="form-label">
                          TYPE OF DEAL/OFFER
                        </label>
                        <div className="space-y-4 mt-2">
                          <label className="flex items-start">
                            <input
                              type="radio"
                              name="dealType"
                              value="commission"
                              checked={formData.dealType === 'commission'}
                              onChange={handleInputChange}
                              className="mr-3 mt-1"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">Commission Deal (Recommended)</span>
                              <p className="text-sm text-gray-600 mt-1">
                                You set a commission referral reward per new customer (e.g. £5-£20). Referrers are highly motivated to share your offers and deals because they earn money - (These deals get priority visibility on our platform, as the businesses gain new customers, the referrers are rewarded for bringing new customers to the business and the customer gets a discount or saving).
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start">
                            <input
                              type="radio"
                              name="dealType"
                              value="non-commission"
                              checked={formData.dealType === 'non-commission'}
                              onChange={handleInputChange}
                              className="mr-3 mt-1"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">Non-Commission Based Incentive</span>
                              <p className="text-sm text-gray-600 mt-1">
                                Instead of cash, you offer perks for bringing in customers (e.g. free products / services, discount vouchers or loyalty credit). This option still gives referrers an incentive to share your deals and offers while being rewarded for their time and effort.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {formData.dealType === 'non-commission' && (
                        <div className="animate-fade-in-up delay-500">
                          <label htmlFor="noRewardReason" className="form-label">
                            NO REWARD REASON
                          </label>
                          <select
                            id="noRewardReason"
                            name="noRewardReason"
                            value={formData.noRewardReason}
                            onChange={handleInputChange}
                            className="custom-input"
                          >
                            <option value="">Choose an option...</option>
                            <option value="already_discounted">Our products/services are already heavily discounted</option>
                            <option value="exclusive_services">We offer exclusive/limited services that don't need deals</option>
                            <option value="premium_branding">We want to maintain premium branding without discounts</option>
                            <option value="high_demand">We already have high demand and don't need promotions</option>
                            <option value="testing_phase">We're still testing the product/service before launching deals</option>
                          </select>
                        </div>
                      )}

                      <div className="animate-fade-in-up delay-600">
                        <label htmlFor="customerIncentive" className="form-label">
                          CUSTOMER INCENTIVE
                        </label>
                        <input
                          type="text"
                          id="customerIncentive"
                          name="customerIncentive"
                          value={formData.customerIncentive}
                          onChange={handleInputChange}
                          className="custom-input"
                          placeholder="What's the benefit for customer? (e.g discount, free trial, free gift)"
                        />
                      </div>

                      <div className="animate-fade-in-up delay-700">
                        <label htmlFor="dealPosterOptions" className="form-label">
                          DEAL POSTER OPTIONS
                        </label>
                        <select
                          id="dealPosterOptions"
                          name="dealPosterOptions"
                          value={formData.dealPosterOptions}
                          onChange={handleInputChange}
                          className="custom-input"
                        >
                          <option value="">Choose an option...</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </select>
                      </div>
                    </>
                  )}

                  {formData.createDeal === 'no' && (
                    <div className="animate-fade-in-up delay-200">
                      <label htmlFor="noDealReason" className="form-label">
                        Why you do not want to Create a Deal? Give a reason.*
                      </label>
                      <select
                        id="noDealReason"
                        name="noDealReason"
                        value={formData.noDealReason}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                      >
                        <option value="">Choose an option...</option>
                        <option value="already_discounted">Our products/services are already heavily discounted</option>
                        <option value="exclusive_services">We offer exclusive/limited services that don't need deals</option>
                        <option value="premium_branding">We want to maintain premium branding without discounts</option>
                        <option value="high_demand">We already have high demand and don't need promotions</option>
                        <option value="testing_phase">We're still testing the product/service before launching deals</option>
                      </select>
                    </div>
                  )}

                  <div className="animate-fade-in-up delay-800">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeCommunications"
                        checked={formData.agreeCommunications}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to receive other communications from Deal Shark.
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      In order to provide you the content requested, we need to store and process this entered data.
                    </p>
                  </div>

                  <div className="animate-fade-in-up delay-900">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeDataProcessing"
                        checked={formData.agreeDataProcessing}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to allow Deal Shark to store and process the information I have entered.
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Deal Shark is committed to protecting and respecting your privacy, and we'll only use the information provided to administer your account and to provide the products and services you requested from us.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover-lift"
                  >
                    Previous
                  </button>
                )}

                <div className="flex-1"></div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === 3 ? 'Complete Registration' : 'Next'}</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-responsive-base">
                  Already have an account?{' '}
                  <button
                    className="text-dealshark-blue hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;