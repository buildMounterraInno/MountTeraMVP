import { MessageCircle, X } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '9424559252';
    const message = encodeURIComponent('Hi! I\'ve forgot my password! My Email ID is:.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="font-tpc text-2xl font-bold text-gray-800 mb-4">
              Forgot Password?
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              No worries! Click the button below to reach us on WhatsApp and we'll help you reset your password quickly.
            </p>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              Contact us on WhatsApp
            </button>

            {/* Back Button */}
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;