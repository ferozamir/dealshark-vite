import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService } from '../services';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GiftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DealsPage = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRewardType, setSelectedRewardType] = useState('all');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getAllDeals();
      
      if (result.success) {
        setDeals(result.deals || []);
      } else {
        setError(result.error);
        toast.error(result.error || 'Failed to fetch deals');
      }
    } catch (err) {
      setError('Failed to fetch deals');
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Food', label: 'Food & Dining' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Beauty', label: 'Beauty & Health' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Home', label: 'Home & Garden' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Sports', label: 'Sports & Fitness' }
  ];

  const rewardTypes = [
    { value: 'all', label: 'All Rewards' },
    { value: 'commission', label: 'Commission' },
    { value: 'no_reward', label: 'No Reward' }
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.deal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.business?.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.deal_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deal.business?.industry === selectedCategory;
    const matchesRewardType = selectedRewardType === 'all' || deal.reward_type === selectedRewardType;
    
    return matchesSearch && matchesCategory && matchesRewardType;
  });

  const handleSubscribe = async (dealId) => {
    if (!user) {
      toast.error('Please login to subscribe to deals');
      return;
    }
    
    try {
      // Implement subscription logic here
      console.log('Subscribing to deal:', dealId);
      toast.success('Successfully subscribed to deal!');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe to deal');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    } else {
      return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Deals</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDeals}
            className="bg-dealshark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Deals</h1>
          <p className="text-gray-600 text-lg">
            Discover amazing deals from our partner businesses and start earning commissions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals, businesses, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reward Type Filter */}
            <div>
              <select
                value={selectedRewardType}
                onChange={(e) => setSelectedRewardType(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-colors"
              >
                {rewardTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-lg">
            Showing <span className="font-semibold text-gray-900">{filteredDeals.length}</span> deal{filteredDeals.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filters applied</span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              {/* Business Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    {deal.business?.business_logo_url ? (
                      <img
                        src={deal.business.business_logo_url}
                        alt={deal.business.business_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {deal.business?.business_name?.charAt(0) || 'B'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{deal.business?.business_name}</h3>
                    <p className="text-sm text-gray-500 truncate">{deal.business?.industry}</p>
                    {deal.is_featured && (
                      <div className="inline-flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-dealshark-yellow fill-current mr-1" />
                        <span className="text-xs font-medium text-dealshark-yellow">Featured</span>
                      </div>
                    )}
                  </div>
                  {deal.subscription_info?.is_subscribed && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Subscribed
                    </span>
                  )}
                </div>
                
                {/* Deal Info */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {deal.deal_name}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {deal.deal_description}
                  </p>
                </div>
                
                {/* Reward Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-semibold ${getRewardColor(deal)}`}>
                    {deal.reward_type === 'commission' ? (
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <GiftIcon className="h-4 w-4 mr-2" />
                    )}
                    {getRewardDisplay(deal)}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{deal.subscribers_count || 0} subscribers</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Created {formatDate(deal.created_at)}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Link
                  to={`/deal/${deal.id}`}
                  className="flex items-center justify-center w-full bg-dealshark-blue hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 group-hover:shadow-lg"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {deal.subscription_info?.is_subscribed ? 'View Details' : 'View Deal'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No deals found</h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or browse all available deals
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRewardType('all');
              }}
              className="bg-dealshark-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;