import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import toast from 'react-hot-toast';

const CreateDealPage = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    deal_name: '',
    deal_description: '',
    reward_type: 'commission', // 'commission' or 'no_reward'
    customer_incentive: '',
    no_reward_reason: '',
    poster_text: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect if not business user
  React.useEffect(() => {
    if (userType !== 'business') {
      navigate('/login');
    }
  }, [userType, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Clear related fields when switching types
        customer_incentive: value === 'no_reward' ? '' : prev.customer_incentive,
        no_reward_reason: value === 'commission' ? '' : prev.no_reward_reason,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deal_name.trim()) {
      newErrors.deal_name = 'Deal/Offer title is required';
    }

    if (!formData.deal_description.trim()) {
      newErrors.deal_description = 'Deal/Offer description is required';
    }

    if (formData.reward_type === 'commission') {
      if (!formData.customer_incentive.trim()) {
        newErrors.customer_incentive = 'Customer incentive is required for commission deals';
      }
    } else if (formData.reward_type === 'no_reward') {
      if (!formData.no_reward_reason) {
        newErrors.no_reward_reason = 'Please select a reason for no reward';
      }
    }

    if (!formData.poster_text) {
      newErrors.poster_text = 'Please select a deal poster option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const dealData = {
        deal_name: formData.deal_name.trim(),
        deal_description: formData.deal_description.trim(),
        reward_type: formData.reward_type,
        poster_text: formData.poster_text,
      };

      // Add type-specific fields
      if (formData.reward_type === 'commission') {
        dealData.customer_incentive = parseFloat(formData.customer_incentive);
      } else {
        dealData.no_reward_reason = formData.no_reward_reason;
      }

      // Use the appropriate service method based on deal type
      const result = formData.reward_type === 'commission' 
        ? await dealsService.createCommissionDeal(dealData)
        : await dealsService.createNoRewardDeal(dealData);

      if (result.success) {
        toast.success('Deal created successfully!');
        navigate('/business/deals'); // Redirect to deals list
      } else {
        toast.error(result.error || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Create deal error:', error);
      toast.error('Failed to create deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dealPosterOptions = [
    'This discount is big enough to share!',
    'Exclusive / Limited offer — don\'t miss it!',
    'High-demand deal — share with your friends!'
  ];

  const noRewardReasons = [
    'big_discount',
    'exclusive_access',
    'loyalty_program',
    'free_gift',
    'limited_time'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Deal</h1>
          <p className="text-gray-600">Set up your deal to start attracting customers</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Deal/Offer Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                DEAL/OFFER TITLE*
              </label>
              <input
                type="text"
                name="deal_name"
                value={formData.deal_name}
                onChange={handleInputChange}
                placeholder="Enter Deal/Offer Name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors ${
                  errors.deal_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deal_name && (
                <p className="text-red-500 text-sm mt-1">{errors.deal_name}</p>
              )}
            </div>

            {/* Deal/Offer Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                DEAL/OFFER DESCRIPTION*
              </label>
              <textarea
                name="deal_description"
                value={formData.deal_description}
                onChange={handleInputChange}
                placeholder="Enter deal description here..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors resize-none ${
                  errors.deal_description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deal_description && (
                <p className="text-red-500 text-sm mt-1">{errors.deal_description}</p>
              )}
            </div>

            {/* Type of Deal/Offer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                TYPE OF DEAL/OFFER
              </label>
              
              {/* Commission Deal Option */}
              <div className="mb-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reward_type"
                    value="commission"
                    checked={formData.reward_type === 'commission'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dealshark-blue focus:ring-dealshark-blue border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Commission Deal (Recommended)
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      You set a commission referral reward per new customer (e.g. £5-£20). 
                      Referrers are highly motivated to share your offers and deals because they earn money - 
                      (These deals get priority visibility on our platform, as the businesses gain new customers, 
                      the referrers are rewarded for bringing new customers to the business and the customer gets 
                      a discount or saving).
                    </p>
                  </div>
                </label>
              </div>

              {/* Non-Commission Option */}
              <div className="mb-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reward_type"
                    value="no_reward"
                    checked={formData.reward_type === 'no_reward'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-dealshark-blue focus:ring-dealshark-blue border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Non-Commission Based Incentive
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Instead of cash, you offer perks for bringing in customers (e.g. free products / services, 
                      discount vouchers or loyalty credit). This option still gives referrers an incentive to share 
                      your deals and offers while being rewarded for their time and effort.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Incentive (for commission deals) */}
            {formData.reward_type === 'commission' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  CUSTOMER INCENTIVE*
                </label>
                <input
                  type="text"
                  name="customer_incentive"
                  value={formData.customer_incentive}
                  onChange={handleInputChange}
                  placeholder="What's the benefit for customer? (e.g discount, free trial, free gift)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors ${
                    errors.customer_incentive ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_incentive && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_incentive}</p>
                )}
              </div>
            )}

            {/* No Reward Reason (for non-commission deals) */}
            {formData.reward_type === 'no_reward' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  NO REWARD REASON*
                </label>
                <select
                  name="no_reward_reason"
                  value={formData.no_reward_reason}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors ${
                    errors.no_reward_reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose an option...</option>
                  <option value="big_discount">Big Discount</option>
                  <option value="exclusive_access">Exclusive Access</option>
                  <option value="loyalty_program">Loyalty Program</option>
                  <option value="free_gift">Free Gift</option>
                  <option value="limited_time">Limited Time Offer</option>
                </select>
                {errors.no_reward_reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.no_reward_reason}</p>
                )}
              </div>
            )}

            {/* Deal Poster Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                DEAL POSTER OPTIONS*
              </label>
              <select
                name="poster_text"
                value={formData.poster_text}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors ${
                  errors.poster_text ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose an option...</option>
                {dealPosterOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              {errors.poster_text && (
                <p className="text-red-500 text-sm mt-1">{errors.poster_text}</p>
              )}
            </div>

            {/* Privacy and Communication Consent */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  Deal Shark is committed to protecting and respecting your privacy, and we'll only use 
                  the information provided to administer your account and to provide the products and 
                  services you requested from us.
                </p>
                
                <p>
                  From time to time, we would like to contact you about our products and services, as 
                  well as other content that may be of interest to you. If you consent to us contacting 
                  you for this purpose.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="communications"
                  className="mt-1 h-4 w-4 text-dealshark-blue focus:ring-dealshark-blue border-gray-300 rounded"
                />
                <label htmlFor="communications" className="text-sm text-gray-700">
                  I agree to receive other communications from Deal Shark.
                </label>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  In order to provide you the content requested, we need to store and process this entered data.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="data-processing"
                  className="mt-1 h-4 w-4 text-dealshark-blue focus:ring-dealshark-blue border-gray-300 rounded"
                />
                <label htmlFor="data-processing" className="text-sm text-gray-700">
                  I agree to allow Deal Shark to store and process the information I have entered.
                </label>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  You can unsubscribe from these communications at any time. For more information on how to 
                  unsubscribe, our privacy practices, and how we are committed to protecting and respecting 
                  your privacy, please review our{' '}
                  <a href="#" className="text-dealshark-blue hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? 'Creating Deal...' : 'Create Deal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDealPage;