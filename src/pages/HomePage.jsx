import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated, userType } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      console.log('Searching for:', searchQuery);
    }
  };

  // Mock data for today's top offers
  const todaysOffers = [
    {
      id: 1,
      businessName: 'Fresh Bites Cafe',
      dealTitle: 'Free Coffee with Breakfast',
      bonusPercentage: 5.00,
      subscribers: 0,
      image: '☕',
      category: 'Food & Dining'
    },
    {
      id: 2,
      businessName: 'TechStore Pro',
      dealTitle: 'Electronics Sale',
      bonusPercentage: 10.00,
      subscribers: 0,
      image: '📱',
      category: 'Electronics'
    },
    {
      id: 3,
      businessName: 'Fashion Hub',
      dealTitle: 'Summer Collection',
      bonusPercentage: 15.00,
      subscribers: 0,
      image: '👗',
      category: 'Fashion'
    },
    {
      id: 4,
      businessName: 'Beauty Store',
      dealTitle: 'Skincare Bundle',
      bonusPercentage: 15.00,
      subscribers: 1,
      image: '💄',
      category: 'Beauty'
    },
    {
      id: 5,
      businessName: 'Fitness Center',
      dealTitle: 'Gym Membership',
      bonusPercentage: 25.00,
      subscribers: 0,
      image: '💪',
      category: 'Fitness'
    },
    {
      id: 6,
      businessName: 'Travel Agency',
      dealTitle: 'Holiday Packages',
      bonusPercentage: 8.00,
      subscribers: 0,
      image: '✈️',
      category: 'Travel'
    },
    {
      id: 7,
      businessName: 'Home Decor',
      dealTitle: 'Interior Design',
      bonusPercentage: 15.00,
      subscribers: 0,
      image: '🏠',
      category: 'Home'
    },
    {
      id: 8,
      businessName: 'Book Store',
      dealTitle: 'Best Sellers',
      bonusPercentage: 22.00,
      subscribers: 1,
      image: '📚',
      category: 'Books'
    }
  ];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {todaysOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Card Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{offer.image}</div>
                    <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center font-semibold">
                      <span className="mr-1">🔥</span>
                      HOT
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-6 bg-dealshark-yellow text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                    {offer.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                    {offer.businessName}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {offer.dealTitle}
                  </p>
                  
                  {/* Bonus Percentage */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-dealshark-blue">
                      {offer.bonusPercentage.toFixed(1)}% Bonus
                    </span>
                  </div>
                  
                  {/* Subscribers */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    <span>{offer.subscribers} users subscribed</span>
                  </div>

                  {/* Subscribe Button */}
                  <button className="w-full bg-dealshark-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
          </div>

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