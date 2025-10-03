import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const DealsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRewardType, setSelectedRewardType] = useState('all');

  // Mock data - replace with actual API calls
  const deals = [
    {
      id: 1,
      businessName: 'TechStore Pro',
      businessLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      dealTitle: '20% Off Electronics',
      dealDescription: 'Get 20% off on all electronics with cashback rewards',
      rewardType: 'commission',
      rewardAmount: '$5',
      subscribers: 1250,
      rating: 4.8,
      category: 'electronics',
      isSubscribed: false
    },
    {
      id: 2,
      businessName: 'Fashion Hub',
      businessLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center',
      dealTitle: 'Buy 2 Get 1 Free',
      dealDescription: 'Fashion deals with instant rewards',
      rewardType: 'discount',
      rewardAmount: 'Free Item',
      subscribers: 890,
      rating: 4.6,
      category: 'fashion',
      isSubscribed: true
    },
    {
      id: 3,
      businessName: 'Food Palace',
      businessLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=center',
      dealTitle: '50% Off First Order',
      dealDescription: 'Delicious meals with great savings',
      rewardType: 'commission',
      rewardAmount: '$3',
      subscribers: 2100,
      rating: 4.9,
      category: 'food',
      isSubscribed: false
    },
    {
      id: 4,
      businessName: 'Beauty Store',
      businessLogo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop&crop=center',
      dealTitle: '30% Off Skincare',
      dealDescription: 'Premium skincare products with amazing discounts',
      rewardType: 'commission',
      rewardAmount: '$8',
      subscribers: 650,
      rating: 4.7,
      category: 'beauty',
      isSubscribed: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'beauty', label: 'Beauty & Health' },
    { value: 'travel', label: 'Travel' },
    { value: 'home', label: 'Home & Garden' }
  ];

  const rewardTypes = [
    { value: 'all', label: 'All Rewards' },
    { value: 'commission', label: 'Commission' },
    { value: 'discount', label: 'Discount' },
    { value: 'cashback', label: 'Cashback' }
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    const matchesRewardType = selectedRewardType === 'all' || deal.rewardType === selectedRewardType;
    
    return matchesSearch && matchesCategory && matchesRewardType;
  });

  const handleSubscribe = (dealId) => {
    // Implement subscription logic
    console.log('Subscribing to deal:', dealId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Deals</h1>
          <p className="text-gray-600">
            Discover amazing deals from our partner businesses and start earning commissions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals or businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <p className="text-gray-600">
            Showing {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filters applied</span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Business Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={deal.businessLogo}
                    alt={deal.businessName}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{deal.businessName}</h3>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{deal.rating}</span>
                    </div>
                  </div>
                  {deal.isSubscribed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Subscribed
                    </span>
                  )}
                </div>
                
                {/* Deal Info */}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {deal.dealTitle}
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  {deal.dealDescription}
                </p>
                
                {/* Stats */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deal.rewardType === 'commission' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deal.rewardAmount}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {deal.subscribers}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="px-6 py-3 bg-gray-50 border-t">
                <Link
                  to={`/deal/${deal.id}`}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  {deal.isSubscribed ? 'View Details' : 'Subscribe Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all deals
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRewardType('all');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
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
