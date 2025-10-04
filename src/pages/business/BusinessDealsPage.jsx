import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  EyeIcon,
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
  ArrowTrendingDownIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const BusinessDealsPage = () => {
  const { user, business } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyDeals();
  }, []);

  const fetchMyDeals = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getMyDeals();
      
      if (result.success) {
        setDeals(result.deals || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  // Calculate business stats
  const totalSubscribers = deals.reduce((sum, deal) => sum + (deal.subscription_count || 0), 0);
  const totalRevenue = deals.reduce((sum, deal) => sum + (deal.business_revenue || 0), 0);
  const activeDeals = deals.length;
  const avgSubscribersPerDeal = activeDeals > 0 ? Math.round(totalSubscribers / activeDeals) : 0;

  const businessStats = [
    {
      label: 'Total Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Deals',
      value: activeDeals,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Subscribers/Deal',
      value: avgSubscribersPerDeal,
      icon: ArrowTrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your deals...</p>
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
                  {business?.business_logo_url ? (
                    <img
                      src={business.business_logo_url}
                      alt={business.business_name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <BuildingOfficeIcon className="h-10 w-10 text-white" />
                  )}
                </div>
                
                {/* Business Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business?.business_name || 'My Business'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span className="text-sm">{business?.industry || 'Business'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{business?.city}, {business?.state}</span>
                    </div>
                    {business?.is_verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <StarIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Create Deal Button */}
              <Link
                to="/create-deal"
                className="btn-primary flex items-center space-x-2 animate-fade-in-up"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create New Deal</span>
              </Link>
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
                    {stat.changeType === 'positive' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Business Details Card */}
          <div className="business-details-card auth-card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <EnvelopeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Email</span>
                </div>
                <p className="text-gray-600">{business?.email || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <PhoneIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Phone</span>
                </div>
                <p className="text-gray-600">{business?.phone_number || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <GlobeAltIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Website</span>
                </div>
                <p className="text-gray-600">
                  {business?.website ? (
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-dealshark-blue hover:underline">
                      {business.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPinIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Address</span>
                </div>
                <p className="text-gray-600">{business?.business_address || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Registration</span>
                </div>
                <p className="text-gray-600">{business?.registration_no || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Industry</span>
                </div>
                <p className="text-gray-600">{business?.industry || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Deals Section */}
          <div className="deals-section auth-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Deals</h2>
              <div className="text-sm text-gray-600">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} total
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-message mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Deals Grid */}
            {deals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create your first deal to start attracting customers and growing your business through referrals.
                </p>
                <Link
                  to="/create-deal"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Create Your First Deal</span>
                </Link>
              </div>
            ) : (
              <div className="deals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal, index) => (
                  <div key={deal.id} className={`deal-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-${(index + 1) * 100}`}>
                    <div className="p-6">
                      {/* Deal Header */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-3">
                          {deal.deal_name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          deal.reward_type === 'commission' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {deal.reward_type === 'commission' ? 'Commission' : 'No Reward'}
                        </span>
                      </div>
                      
                      {/* Deal Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {deal.deal_description}
                      </p>

                      {/* Deal Stats */}
                      <div className="space-y-3 mb-6">
                        {deal.reward_type === 'commission' && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Customer Incentive:</span>
                            <span className="font-semibold text-green-600">
                              ${deal.customer_incentive}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Subscribers:</span>
                          <div className="flex items-center space-x-1">
                            <UsersIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{deal.subscription_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Created:</span>
                          <span className="font-medium text-sm">
                            {new Date(deal.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <Link
                          to={`/deal/${deal.id}`}
                          className="w-full btn-secondary flex items-center justify-center space-x-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
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

export default BusinessDealsPage;