import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService, referralsService } from '../services';
import {
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ShareIcon,
  ClipboardIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DealDetailPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    debugger
    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getDeal(dealId, user?.id);

      if (result?.success) {
        setDeal(result.deal);
      } else {
        setError(result.error);
        toast.error(result.error || 'Failed to fetch deal details');
      }
    } catch (err) {
      setError('Failed to fetch deal details');
      toast.error('Failed to fetch deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setSubscribing(true);

      if (deal.subscription_info?.is_subscribed) {
        // Unsubscribe
        const result = await referralsService.unsubscribeFromDeal(dealId, user.id);
        if (result.success) {
          toast.success('Successfully unsubscribed from deal');
          // Refresh deal data
          await fetchDealDetails();
        } else {
          toast.error(result.error || 'Failed to unsubscribe');
        }
      } else {
        // Subscribe
        const result = await referralsService.subscribeToDeal(dealId, user.id);
        if (result.success) {
          toast.success('Successfully subscribed to deal!');
          // Refresh deal data
          await fetchDealDetails();
        } else {
          toast.error(result.error || 'Failed to subscribe');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe/unsubscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const copyReferralLink = async () => {
    if (deal?.subscription_info?.referral_link) {
      try {
        await navigator.clipboard.writeText(deal.subscription_info.referral_link);
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `$${parseFloat(deal.customer_incentive).toFixed(2)} Commission`;
    } else {
      return 'No Reward';
    }
  };

  const getRewardColor = (deal) => {
    if (deal.reward_type === 'commission') {
      return 'from-green-500 to-emerald-500';
    } else {
      return 'from-blue-500 to-indigo-500';
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Deal Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The deal you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/deals')}
            className="bg-dealshark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/deals')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Deals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Business Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                    {deal.business?.business_logo_url ? (
                      <img
                        src={deal.business.business_logo_url}
                        alt={deal.business.business_name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {deal.business?.business_name?.charAt(0) || 'B'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {deal.business?.business_name}
                    </h1>
                    <p className="text-gray-600 mb-2">{deal.business?.industry}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {deal.business?.business_subscribers_count || 0} total subscribers
                      </div>
                      {deal.is_featured && (
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-dealshark-yellow fill-current mr-1" />
                          <span className="text-sm font-medium text-dealshark-yellow">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deal Title and Description */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {deal.deal_name}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {deal.deal_description}
                  </p>
                </div>

                {/* Reward Badge */}
                <div className="mb-6">
                  <div className={`inline-flex items-center px-5 py-2 rounded-full text-sm text-white font-semibold bg-gradient-to-r ${getRewardColor(deal)}`}>
                    {deal.reward_type === 'commission' ? (
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <GiftIcon className="h-5 w-5 mr-2" />
                    )}
                    {/* {getRewardDisplay(deal)} */}
                    {deal.poster_text}
                  </div>
                </div>

                {/* Deal Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg align-middle content-center">
                    <div className="text-2xl font-bold text-gray-900">{deal.subscribers_count || 0}</div>
                    <div className="text-sm text-gray-600">Subscribers</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg align-middle content-center">
                    <div className="text-2xl font-bold text-gray-900">{deal.business?.business_subscribers_count || 0}</div>
                    <div className="text-sm text-gray-600">Business Total</div>
                  </div>
                  <div className={`text-center p-4 bg-gray-50 rounded-lg align-middle content-center ${deal.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className={`font-bold text-gray-900 px-4 py-1 mx-auto w-fit rounded-full ${deal.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {deal.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg align-middle content-center">
                    <div className="font-bold text-gray-900">
                      {formatDate(deal.created_at)}
                    </div>
                    <div className="text-sm text-gray-600">Created</div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Email:</span> {deal.business?.business_email}</p>
                      <p><span className="font-medium">Phone:</span> {deal.business?.business_phone}</p>
                      <p><span className="font-medium">Website:</span>
                        <a
                          href={deal.business?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dealshark-blue hover:underline ml-1"
                        >
                          {deal.business?.website}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deal Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Reward Type:</span> {deal.reward_type.replace('_', ' ')}</p>
                      {deal.no_reward_reason && (
                        <p><span className="font-medium">Reason:</span> {deal.no_reward_reason.replace('_', ' ')}</p>
                      )}
                      <p><span className="font-medium">Poster Text:</span> {deal.poster_text}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Subscription Status */}
              {deal.subscription_info?.is_subscribed ? (
                <div className="mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">You're subscribed!</span>
                    </div>
                  </div>

                  {/* Referral Information */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Your Referral Link</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={deal.subscription_info.referral_link}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      />
                      <button
                        onClick={copyReferralLink}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <ClipboardIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Referral Code: <span className="font-mono font-medium">{deal.subscription_info.referral_code}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-800">Not subscribed</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Subscribe to start earning from this deal!
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${deal.subscription_info?.is_subscribed
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-dealshark-blue hover:bg-blue-700 text-white'
                    } ${subscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {subscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {deal.subscription_info?.is_subscribed ? 'Unsubscribing...' : 'Subscribing...'}
                    </div>
                  ) : (
                    deal.subscription_info?.is_subscribed ? 'Unsubscribe' : 'Subscribe Now'
                  )}
                </button>

                {deal.subscription_info?.is_subscribed && (
                  <button
                    onClick={copyReferralLink}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Referral Link
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">How it works</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Share your referral link with friends</p>
                  <p>• When they make a purchase, you earn commission</p>
                  <p>• Track your earnings in your profile</p>
                  <p>• Withdraw your earnings anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-[#00000040] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-dealshark-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-6">
                  You need to login first to subscribe to deals and start earning commissions.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="flex-1 py-2 px-4 bg-dealshark-blue hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetailPage;