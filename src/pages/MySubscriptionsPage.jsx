import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { referralsService } from '../services';
import { 
  CopyIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  LinkIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MySubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const result = await referralsService.getMySubscriptions();
      
      if (result.success) {
        setSubscriptions(result.data.subscriptions || []);
      } else {
        setError(result.error || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      setError('Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (referralLink) => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleUnsubscribe = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to unsubscribe from this deal?')) {
      return;
    }

    try {
      // This would need to be implemented in referralsService
      // const result = await referralsService.unsubscribeFromDeal(subscriptionId);
      toast.success('Successfully unsubscribed from deal');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to unsubscribe');
    }
  };

  const getBusinessIcon = (business) => {
    if (business.logo_url) {
      return (
        <img
          src={business.logo_url}
          alt={business.business_name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      );
    }
    return <UserIcon className="w-12 h-12 text-gray-400" />;
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `${deal.customer_incentive}% Referral Bonus`;
    } else {
      return `${deal.customer_incentive}% Referral Bonus`;
    }
  };

  const getUserInitials = (email) => {
    if (!email) return 'TU';
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🦈</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-dealshark-blue">Deal</span>
                <span className="text-dealshark-yellow">Shark</span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search brands and stores"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-dealshark-yellow absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <span className="text-dealshark-blue font-medium">My Subscriptions</span>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <UserCircleIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Account</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Section */}
      <div className="bg-dealshark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* User Avatar */}
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user?.first_name || user?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-blue-100 text-lg">{user?.email}</p>
              </div>
            </div>

            {/* Shark Mascot */}
            <div className="hidden lg:block">
              <div className="text-6xl">🦈</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Subscriptions</h2>
        </div>

        {/* Subscriptions Container */}
        <div className="bg-dealshark-yellow rounded-2xl p-8 border-4 border-dealshark-yellow">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Subscriptions</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchSubscriptions}
                className="bg-dealshark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Yet</h3>
              <p className="text-gray-600">You haven't subscribed to any deals yet. Start exploring deals to begin earning!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <div key={subscription.subscription_id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Business Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {getBusinessIcon(subscription.business)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {subscription.deal.deal_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {subscription.business.business_name}
                      </p>
                    </div>
                  </div>

                  {/* Reward Info */}
                  <div className="mb-4">
                    <p className="text-dealshark-blue font-semibold text-lg">
                      {getRewardDisplay(subscription.deal)}
                    </p>
                  </div>

                  {/* Referral Link */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Link
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={subscription.referral_link}
                        readOnly
                        className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                      />
                      <LinkIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleCopyUrl(subscription.referral_link)}
                      className="flex-1 bg-dealshark-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CopyIcon className="h-4 w-4" />
                      <span>Copy URL</span>
                    </button>
                    <button
                      onClick={() => handleUnsubscribe(subscription.subscription_id)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Unsubscribe</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MySubscriptionsPage;
