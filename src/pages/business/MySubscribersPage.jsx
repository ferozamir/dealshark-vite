import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { referralsService } from '../../services';
import { 
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  EyeIcon,
  ClipboardIcon,
  LinkIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MySubscribersPage = () => {
  const { user, business } = useAuth();
  const [subscribersData, setSubscribersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (business?.id) {
      fetchSubscribers();
    }
  }, [business?.id]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const result = await referralsService.getMySubscribers(business.id);
      
      if (result.success) {
        setSubscribersData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch subscribers');
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

  // Calculate business stats
  const totalSubscribers = subscribersData?.total_subscribers || 0;
  const totalRevenue = subscribersData?.subscribers?.reduce((sum, sub) => sum + (sub.business_revenue || 0), 0) || 0;
  const totalCommissions = subscribersData?.subscribers?.reduce((sum, sub) => sum + (sub.commission_earned || 0), 0) || 0;
  const avgRevenuePerSubscriber = totalSubscribers > 0 ? Math.round(totalRevenue / totalSubscribers) : 0;

  const businessStats = [
    {
      label: 'Total Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+15%',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Commissions Paid',
      value: `$${totalCommissions.toLocaleString()}`,
      icon: GiftIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Revenue/Subscriber',
      value: `$${avgRevenuePerSubscriber}`,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `${deal.customer_incentive}% Commission`;
    } else {
      return 'Special Offer';
    }
  };

  const getRewardColor = (deal) => {
    if (deal.reward_type === 'commission') {
      return 'from-green-500 to-emerald-500';
    } else {
      return 'from-blue-500 to-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Business Profile Header */}
          <div className="business-profile-header auth-card mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                {/* Business Logo */}
                <div className="w-20 h-20 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {subscribersData?.business?.logo_url ? (
                    <img
                      src={subscribersData.business.logo_url}
                      alt={subscribersData.business.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <BuildingOfficeIcon className="h-10 w-10 text-white" />
                  )}
                </div>
                
                {/* Business Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {subscribersData?.business?.name || business?.business_name || 'My Business'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span className="text-sm">{subscribersData?.business?.industry || business?.industry || 'Business'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{subscribersData?.business?.city || business?.city}, {subscribersData?.business?.state || business?.state}</span>
                    </div>
                    {subscribersData?.business?.is_verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <StarIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscribers Count Badge */}
              <div className="flex items-center space-x-3">
                <div className="bg-dealshark-blue text-white px-6 py-3 rounded-xl">
                  <div className="text-2xl font-bold">{totalSubscribers}</div>
                  <div className="text-sm opacity-90">Active Subscribers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {businessStats.map((stat, index) => (
              <div key={stat.label} className={`stat-card auth-card animate-fade-in-up delay-${(index + 1) * 100}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Business Details Card */}
          {/* <div className="business-details-card auth-card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <EnvelopeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Email</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.email || business?.email || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <PhoneIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Phone</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.phone_number || business?.phone_number || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <GlobeAltIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Website</span>
                </div>
                <p className="text-gray-600">
                  {subscribersData?.business?.website || business?.website ? (
                    <a href={subscribersData?.business?.website || business?.website} target="_blank" rel="noopener noreferrer" className="text-dealshark-blue hover:underline">
                      {subscribersData?.business?.website || business?.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPinIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Address</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.address || business?.business_address || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Registration</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.registration_no || business?.registration_no || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Industry</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.industry || business?.industry || 'Not specified'}</p>
              </div>
            </div>
          </div> */}

          {/* Subscribers Section */}
          <div className="subscribers-section auth-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Subscribers</h2>
              <div className="text-sm text-gray-600">
                {subscribersData?.subscribers?.length || 0} {subscribersData?.subscribers?.length === 1 ? 'subscriber' : 'subscribers'} total
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-message mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Subscribers Grid */}
            {!subscribersData || subscribersData.subscribers?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UsersIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscribers yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your deals are live! Share them with your network to start getting subscribers and earning referrals.
                </p>
                <div className="text-sm text-gray-500">
                  💡 Tip: Share your deals on social media and with your customers to attract more subscribers
                </div>
              </div>
            ) : (
              <div className="subscribers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscribersData.subscribers.map((subscriber, index) => (
                  <div key={subscriber.subscription_id} className={`subscriber-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-${(index + 1) * 100}`}>
                    <div className="p-6">
                      {/* Subscriber Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center">
                          {subscriber.referrer.profile_image_url ? (
                            <img
                              src={subscriber.referrer.profile_image_url}
                              alt={`${subscriber.referrer.first_name} ${subscriber.referrer.last_name}`}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {getUserInitials(subscriber.referrer)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {subscriber.referrer.first_name} {subscriber.referrer.last_name}
                          </h3>
                          <p className="text-gray-600 text-sm">{subscriber.referrer.email}</p>
                        </div>
                      </div>

                      {/* Deal Info */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          {subscriber.deal.deal_name}
                        </h4>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getRewardColor(subscriber.deal)}`}>
                          {subscriber.deal.reward_type === 'commission' ? (
                            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <GiftIcon className="h-3 w-3 mr-1" />
                          )}
                          {getRewardDisplay(subscriber.deal)}
                        </div>
                      </div>

                      {/* Subscription Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Joined:</span>
                          <span className="font-medium text-sm">
                            {new Date(subscriber.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Referral Code:</span>
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {subscriber.referral_code}
                          </span>
                        </div>

                        {subscriber.commission_earned && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Commission Earned:</span>
                            <span className="font-semibold text-green-600">
                              ${subscriber.commission_earned}
                            </span>
                          </div>
                        )}

                        {subscriber.business_revenue && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Revenue Generated:</span>
                            <span className="font-semibold text-blue-600">
                              ${subscriber.business_revenue}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Referral Link */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referral Link
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={subscriber.referral_link}
                            readOnly
                            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                          />
                          <LinkIcon className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleCopyUrl(subscriber.referral_link)}
                        className="w-full btn-secondary flex items-center justify-center space-x-2"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                        <span>Copy Referral Link</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MySubscribersPage;