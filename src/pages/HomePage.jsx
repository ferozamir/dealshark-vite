import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated, userType } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDeals = [
    {
      id: 1,
      businessName: 'TechStore Pro',
      businessLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      dealTitle: '20% Off Electronics',
      dealDescription: 'Get 20% off on all electronics with cashback rewards',
      rewardType: 'commission',
      rewardAmount: '$5',
      subscribers: 1250,
      rating: 4.8
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
      rating: 4.6
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
      rating: 4.9
    }
  ];

  const features = [
    {
      icon: UserGroupIcon,
      title: 'Connect & Earn',
      description: 'Join deals and earn commissions on every referral'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Track Earnings',
      description: 'Real-time analytics and earnings tracking'
    },
    {
      icon: ChartBarIcon,
      title: 'Grow Business',
      description: 'Reach more customers through our referral network'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Deals
              <span className="block text-yellow-300">Earn as You Share</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Connect with businesses, subscribe to deals, and earn commissions 
              on every successful referral. Join the DealShark community today!
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for brands, stores, or deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-gray-900 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
                  >
                    Start Earning Today
                  </Link>
                  <Link
                    to="/deals"
                    className="border-2 border-white hover:bg-white hover:text-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Browse Deals
                  </Link>
                </>
              ) : (
                <Link
                  to={userType === 'customer' ? '/my-subscriptions' : '/my-subscribers'}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DealShark?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy for customers and businesses to connect through 
              our innovative referral platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Deals
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most popular deals from our partner businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={deal.businessLogo}
                      alt={deal.businessName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{deal.businessName}</h3>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{deal.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {deal.dealTitle}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {deal.dealDescription}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        deal.rewardType === 'commission' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.rewardAmount}
                      </span>
                      <span className="text-sm text-gray-500">
                        {deal.subscribers} subscribers
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t">
                  <Link
                    to={`/deal/${deal.id}`}
                    className="flex items-center justify-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    View Deal
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/deals"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View All Deals
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-indigo-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Partner Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$50K+</div>
              <div className="text-indigo-200">Earned Commissions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-indigo-200">Deals Shared</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
