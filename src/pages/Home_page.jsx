// Import the Link component from React Router for client-side navigation
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home page">
      {/* Main heading displayed on the home page */}
      <h1>QR FOOD SCANNER</h1>

      {/* Short welcome message for users */}
      <p>Welcome to the QR Food Scanner Home Page!</p>

      {/* Link to the Login page */}
      <Link to="/login">
        <button>Go to Login Page</button>
      </Link>

      {/* Link to the Sign Up page */}
      <Link to="/signup">
        <button>Go to Sign Up Page</button>
      </Link>
    </div>
  );
}

// Export the Home component so it can be used in routing
export default Home;
