// Import the useState hook from React to manage component state
import { useState } from "react";

// Import useNavigate from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";

// Import the login function that handles Firebase authentication
import { login } from "../firebase/authService";

function Login() {
  // State to store the user's email input
  const [email, setEmail] = useState("");

  // State to store the user's password input
  const [password, setPassword] = useState("");

  // State to store any login error message
  const [error, setError] = useState(null);

  // Hook used to navigate between routes
  const navigate = useNavigate();

  // Function that runs when the "Login" button is clicked
  const handleLogin = async () => {
    try {
      // Attempt to log in using Firebase authentication
      await login(email, password);

      // If login is successful, redirect the user to the inventory page
      navigate("/inventory");
    } catch (err) {
      // If login fails, display an error message
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login form page">
      {/* Email input field */}
      <h2>Enter your email and password:</h2>      
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

      {/* Button to trigger the login process */}
      <button onClick={handleLogin}>Login</button>

      {/* Conditionally display an error message if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to return the user to the home page */}
      <button
        id="return-home-button"
        onClick={() => navigate("/")}
      >
        Return to Home
      </button>
    </div>
  );
}

// Export the component so it can be used elsewhere in the application
export default Login;
