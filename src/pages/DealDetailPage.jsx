import { useParams } from 'react-router-dom';

const DealDetailPage = () => {
  const { dealId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Deal Details - ID: {dealId}
            </h1>
            <p className="text-gray-600">
              Detailed deal view coming soon with subscription functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;
