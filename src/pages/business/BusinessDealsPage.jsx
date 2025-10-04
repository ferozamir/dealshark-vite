import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import { Link } from 'react-router-dom';

const BusinessDealsPage = () => {
  const { user, userType } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userType === 'business') {
      fetchMyDeals();
    }
  }, [userType]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Deals</h1>
            <p className="text-gray-600 mt-1">Manage your deals and track performance</p>
          </div>
          <Link
            to="/create-deal"
            className="bg-dealshark-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create New Deal
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals yet</h3>
              <p className="text-gray-600 mb-6">Create your first deal to start attracting customers and growing your business.</p>
              <Link
                to="/create-deal"
                className="inline-flex items-center px-6 py-3 bg-dealshark-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Deal
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {deal.deal_name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deal.reward_type === 'commission' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deal.reward_type === 'commission' ? 'Commission' : 'No Reward'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {deal.deal_description}
                  </p>

                  <div className="space-y-2 text-sm">
                    {deal.reward_type === 'commission' && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer Incentive:</span>
                        <span className="font-medium text-green-600">
                          £{deal.customer_incentive}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subscribers:</span>
                      <span className="font-medium">{deal.subscription_count || 0}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">
                        {new Date(deal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                  <Link
                    to={`/deal/${deal.id}`}
                    className="text-dealshark-blue hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDealsPage;
