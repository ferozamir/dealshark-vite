import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                <span className="text-dealshark-blue">Deal</span>
                <span className="text-dealshark-yellow relative">
                  Shark
                  {/* Shark fin effect */}
                  <span className="shark-fin"></span>
                </span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-dealshark-blue ring-opacity-20' : ''}`}>
                <input
                  type="text"
                  placeholder="Search brands and stores"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-dealshark-blue transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-dealshark-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="header-button bg-dealshark-blue text-white px-3 lg:px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="header-button bg-dealshark-yellow text-white px-3 lg:px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors text-sm lg:text-base"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Navigation Buttons */}
                <div className="hidden sm:flex items-center space-x-2">
                  {/* Business User Buttons */}
                  {user?.user_type === 'business' && (
                    <>
                      <Link
                        to="/create-deal"
                        className="header-button text-zinc-800 px-3 lg:px-4 py-2 rounded-full font-semibold hover:text-dealshark-yellow transition-colors text-sm lg:text-base"
                      >
                        Create Deal
                      </Link>
                      <Link
                        to="/business/deals"
                        className="header-button text-zinc-800 px-3 lg:px-4 py-2 rounded-full font-semibold hover:text-dealshark-yellow transition-colors text-sm lg:text-base"
                      >
                        My Business Deals
                      </Link>
                      <Link
                        to="/my-subscribers"
                        className="header-button text-zinc-800 px-3 lg:px-4 py-2 rounded-full font-semibold hover:text-dealshark-yellow transition-colors text-sm lg:text-base"
                      >
                        My Subscribers
                      </Link>
                    </>
                  )}
                  
                  {/* Customer User Buttons */}
                  {user?.user_type !== 'business' && (
                    <Link
                      to="/my-subscriptions"
                      className="header-button text-zinc-800 px-3 lg:px-4 py-2 rounded-full font-semibold hover:text-dealshark-yellow transition-colors text-sm lg:text-base"
                    >
                      My Subscriptions
                    </Link>
                  )}
                </div>

                {/* User Avatar with Hover Popup */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 bg-dealshark-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user?.firstName || user?.first_name || user?.email}
                    </span>
                  </button>
                  
                  {/* Hover Popup Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {/* Business User Mobile Menu */}
                      {user?.user_type === 'business' && (
                        <>
                          <Link
                            to="/create-deal"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Create Deal
                          </Link>
                          <Link
                            to="/business/deals"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            My Business Deals
                          </Link>
                          <Link
                            to="/my-subscribers"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            My Subscribers
                          </Link>
                        </>
                      )}
                      
                      {/* Customer User Mobile Menu */}
                      {user?.user_type !== 'business' && (
                        <Link
                          to="/my-subscriptions"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Subscriptions
                        </Link>
                      )}
                      
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Profile
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;