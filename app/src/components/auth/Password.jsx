import '../../css/auth.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import PropTypes from 'prop-types';

function GeneratePasswordField({ name, placeholder }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <div className="password-container">
      {/* dynamically changes input type to hide or show password
          based on state */}
      <input
        type={ passwordVisible ? "text" : "password" }
        name={ name }
        placeholder={ placeholder }
        className="password"
        required
      />

      {/* dynamically changes eye icon appearance (slash or no slash)
          based on state */}
      <span
        class="eye-icon"
        onClick={ togglePasswordVisibility }
      >
        { passwordVisible ? (
          <FaEye />
        ) : (
          <FaEyeSlash />
        ) }
      </span>
    </div>
  )
}

// Prop validation
GeneratePasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default GeneratePasswordField;