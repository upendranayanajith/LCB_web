import PropTypes from 'prop-types';

const Card = ({ 
  title, 
  content, 
  bgColor, 
  textColor, 
  buttonText, 
  buttonColor, 
  buttonTextColor, 
  onClick, 
  backgroundImage,
  cardImage // New prop for the image between title and content
}) => {
  return (
    <div 
      className={`relative shadow-md rounded p-4 m-2 sm:m-4 md:m-6 lg:m-8 xl:m-10 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden h-full`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className={`absolute inset-0 ${bgColor} opacity-75`}></div>
      
      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full">
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center ${textColor}`}>{title}</h2>
        
        {cardImage && (
          <div className="mb-4 flex justify-center">
            <img src={cardImage} alt={title} className="max-w-full h-auto rounded" />
          </div>
        )}
        
        <p className={`text-sm sm:text-base md:text-lg font-semibold ${textColor} flex-grow`}>{content}</p>
        
        {buttonText && (
          <div className="flex justify-center mt-4">
            <button 
              className={`py-2 px-4 rounded ${buttonColor} ${buttonTextColor} hover:opacity-75 transition-opacity duration-200`}
              onClick={onClick}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  onClick: PropTypes.func,
  backgroundImage: PropTypes.string,
  cardImage: PropTypes.string, // New prop for the image
};

Card.defaultProps = {
  bgColor: 'bg-purple-200',
  textColor: 'text-white',
  buttonText: '',
  buttonColor: 'bg-blue-500',
  buttonTextColor: 'text-white',
  backgroundImage: '',
  cardImage: '', // Default to no image
};

export default Card;