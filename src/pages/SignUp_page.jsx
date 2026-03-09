import { useState } from "react";// Import the useState hook from React for managing component state
import { useNavigate } from "react-router-dom";// Import the useNavigate hook from react-router-dom for programmatic navigation
import { signup } from "../firebase/authService";// Import the signup function that handles Firebase authentication

function SignUp() {
  const [email, setEmail] = useState("");// State to store the user's email input
  const [password, setPassword] = useState("");// State to store the user's password input
  const [error, setError] = useState(null);// State to store any login error message
  const navigate = useNavigate();// Initialize the navigate function from react-router-dom to programmatically navigate between routes

  // Function that runs when the "Sign Up" button is clicked
  const handleSignUp = async () => {
    try {
      await signup(email, password);// Call the Firebase signup function with the entered email and password
      navigate("/inventory"); // Navigate to the inventory page after successful signup
    } catch (err) {
      switch (err.code) {        
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Sign up failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup form page">
      {/* Email input field */}
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)} // Update email state on input change
      />
      <br />

      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)} // Update password state on input change
      />
      <br />

      {/* Button to trigger user sign-up */}
      <button onClick={handleSignUp}>Sign Up</button>

      {/* Conditionally display an error message if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to return to the home page */}
      {/* NOTE: navigate is used here but not imported */}
      <button id="return-home-button" onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
}

// Export the component so it can be used in other parts of the app
export default SignUp;
