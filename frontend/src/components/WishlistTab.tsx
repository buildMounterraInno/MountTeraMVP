import React from 'react';
import { Heart, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { WishlistItem } from '../lib/supabase';

const WishlistTab: React.FC = () => {
  const { wishlistItems, loading, error, removeItemFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleItemClick = (item: WishlistItem) => {
    navigate(`/booking/${item.item_type}/${item.item_id}`);
  };

  const handleRemove = async (e: React.MouseEvent, item: WishlistItem) => {
    e.stopPropagation(); // Prevent item click
    try {
      await removeItemFromWishlist(item.item_id, item.item_type);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Heart size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Wishlist</h3>
        <p className="text-gray-600 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Heart size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600 text-center mb-6">
          Start exploring events and experiences to build your wishlist!
        </p>
        <button
          onClick={() => navigate('/search')}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">
          My Wishlist ({wishlistItems.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => handleItemClick(item)}
          >
            {/* Remove Button */}
            <button
              onClick={(e) => handleRemove(e, item)}
              className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <X size={16} className="text-gray-600 hover:text-red-600" />
            </button>

            {/* Image */}
            <div className="h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
              {item.item_image_url ? (
                <img
                  src={item.item_image_url}
                  alt={item.item_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={32} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.item_type === 'event'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1)}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                {item.item_name}
              </h4>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{item.item_location}</span>
                </div>
                {item.item_price && (
                  <div className="text-lg font-bold text-gray-800">
                    ₹{item.item_price.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Added on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTab;