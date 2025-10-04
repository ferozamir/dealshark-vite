import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService } from '../services';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { isAuthenticated, userType, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getAllDeals();
      
      if (result?.deals) {
        // Take only the first 6 deals for homepage
        setDeals(result.deals.slice(0, 6));
      } else {
        console.error('Failed to fetch deals:', result.error);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDealClick = (dealId) => {
    navigate(`/deal/${dealId}`);
  };

  const getDealIcon = (industry) => {
    const icons = {
      'Food': '🍽️',
      'Electronics': '📱',
      'Fashion': '👗',
      'Beauty': '💄',
      'Fitness': '💪',
      'Travel': '✈️',
      'Home': '🏠',
      'Books': '📚',
      'Crafting': '🎨',
      'Automotive': '🚗',
      'Sports': '⚽',
      'Health': '🏥',
      'Education': '📚',
      'Entertainment': '🎬'
    };
    return icons[industry] || '🛍️';
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `$${parseFloat(deal.customer_incentive).toFixed(2)} Commission`;
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

  const stats = [
    { label: 'Active Users', value: '10K+', icon: UsersIcon },
    { label: 'Partner Brands', value: '500+', icon: StarIcon },
    { label: 'Total Earnings', value: '$50K+', icon: ArrowTrendingUpIcon }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-dealshark-blue via-blue-700 to-dealshark-blue py-16 lg:py-24 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-dealshark-yellow rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-dealshark-yellow rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side - Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                GET <span className="text-dealshark-yellow drop-shadow-lg">20%</span> OFF
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">ALL SHOPS AND BRANDS</span>
                <br />
                <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium">ON OUR PLATFORM</span>
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl">
                Discover amazing deals, earn commissions, and save money with your favorite brands all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/deals"
                  className="bg-dealshark-yellow text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Deals
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-dealshark-blue transition-all duration-300"
                >
                  Join Free
                </Link>
              </div>
            </div>
            
            {/* Right Side - Shark Mascot */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                {/* Main Shark */}
                <div className="text-8xl lg:text-9xl xl:text-[12rem] drop-shadow-2xl">🦈</div>
                {/* Car */}
                <div className="absolute -bottom-8 -right-12 text-6xl lg:text-7xl xl:text-8xl">🚗</div>
                {/* Money bags */}
                <div className="absolute top-8 -left-8 text-3xl lg:text-4xl animate-bounce">💰</div>
                <div className="absolute top-20 -right-16 text-3xl lg:text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>💰</div>
                {/* Sparkles */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-16 left-4 text-2xl animate-pulse" style={{animationDelay: '1s'}}>✨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Side - Shark Character */}
            <div className="flex-shrink-0">
              <div className="text-6xl lg:text-7xl transform hover:scale-110 transition-transform duration-300">🦈</div>
            </div>
            
            {/* Center - Search Bar */}
            <div className="flex-1 w-full max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brands on DealShark"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pr-14 text-lg rounded-xl border-2 border-gray-200 focus:outline-none focus:border-dealshark-blue focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-md"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-dealshark-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6" />
                  </button>
                </div>
              </form>
            </div>
            
            {/* Right Side - Description */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <p className="text-gray-600 text-sm lg:text-base font-medium">
                All promotions and coupons on one convenient platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dealshark-blue rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-dealshark-blue mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by Top Brands</h3>
            <p className="text-gray-600">Shop with confidence from these verified partners</p>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-12">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-dealshark-blue transition-colors duration-300">Walmart</div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-dealshark-blue transition-colors duration-300">eBay</div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-dealshark-blue transition-colors duration-300">Amazon</div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-dealshark-blue transition-colors duration-300">Target</div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 hover:text-dealshark-blue transition-colors duration-300">Best Buy</div>
            <div className="text-dealshark-blue text-2xl hover:text-dealshark-blue-dark transition-colors duration-300 cursor-pointer">
              <ArrowRightIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Today's Top Offers Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl mr-4">🦈</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Today's Top Offers
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Grab these hot deals from your favorite brands and start earning commissions today.
            </p>
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded-full mb-4"></div>
                    <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="w-24 h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer" onClick={() => handleDealClick(deal.id)}>
                  {/* Card Header */}
                  <div className="relative p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center">
                        {deal.business?.business_logo_url ? (
                          <img
                            src={deal.business.business_logo_url}
                            alt={deal.business.business_name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-white text-2xl">
                            {getDealIcon(deal.business?.industry)}
                          </span>
                        )}
                      </div>
                      {deal.is_featured && (
                        <div className="bg-dealshark-yellow text-white text-xs px-3 py-1 rounded-full flex items-center font-semibold">
                          <StarIcon className="h-3 w-3 mr-1 fill-current" />
                          FEATURED
                        </div>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="w-fit bg-dealshark-yellow text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                      {deal.business?.industry || 'General'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 pb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                      {deal.business?.business_name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {deal.deal_name}
                    </p>
                    
                    {/* Reward Badge */}
                    <div className="mb-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getRewardColor(deal)}`}>
                        {deal.reward_type === 'commission' ? (
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <GiftIcon className="h-3 w-3 mr-1" />
                        )}
                        {getRewardDisplay(deal)}
                      </div>
                    </div>
                    
                    {/* Subscribers */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{deal.subscribers_count || 0} users subscribed</span>
                    </div>

                    {/* Action Button */}
                    <div className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-md ${
                      deal.subscription_info?.is_subscribed 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-dealshark-blue hover:bg-blue-700 text-white'
                    }`}>
                      {deal.subscription_info?.is_subscribed ? 'View Deal' : 'Subscribe Now'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🦈</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
              <p className="text-gray-600">Check back later for exciting new deals!</p>
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-12">
            <Link
              to="/deals"
              className="inline-flex items-center bg-dealshark-blue text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Deals
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dealshark-blue to-blue-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-dealshark-yellow rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users already earning commissions through our referral platform. 
            It's free to join and you can start earning immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="bg-dealshark-yellow text-gray-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/business-onboarding"
                  className="border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white hover:text-dealshark-blue transition-all duration-300 shadow-xl"
                >
                  List Your Business
                </Link>
              </>
            ) : (
              <Link
                to={userType === 'customer' ? '/my-subscriptions' : '/my-subscribers'}
                className="bg-dealshark-yellow text-gray-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;