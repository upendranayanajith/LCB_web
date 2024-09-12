import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({ title, content, icon, bgColor, textColor, hoverColor, buttonText, buttonColor, buttonTextColor, onClick }) => {
  return (
    <div className={`shadow-md rounded p-4 m-2 sm:m-4 md:m-6 lg:m-8 xl:m-10 hover:shadow-2xl transition-all duration-200 ${bgColor} flex flex-col justify-between`}>
      <div>
        <FontAwesomeIcon icon={icon} className={`m-4 text-5xl flex justify-center items-center ${textColor} hover:${hoverColor} transition-colors duration-300`} />
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 ${textColor}`}>{title}</h2>
        <p className={`text-sm sm:text-base md:text-lg ${textColor}`}>{content}</p>
      </div>
      {buttonText && (
        <div className="flex justify-center mt-4">
          <button className={`py-2 px-4 rounded ${buttonColor} ${buttonTextColor} hover:opacity-75 transition-opacity duration-200`}
           onClick={onClick}
          >
         
            {buttonText}
            
          </button>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  icon: PropTypes.object.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  bgColor: 'bg-purple-200',
  textColor: 'text-cyan-950',
  hoverColor: 'hover:text-purple-400',
  buttonText: '',
  buttonColor: 'bg-blue-500',
  buttonTextColor: 'text-white',
};

export default Card;