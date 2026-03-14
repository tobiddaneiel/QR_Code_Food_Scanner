// Import the useState hook from React to manage component state
import { useState } from "react";

// Import useNavigate from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";

// Import the resetPassword function that handles Firebase password reset
import { resetPassword } from "../firebase/authService";

function ResetPassword() {
    // State to store the user's email input
    const [email, setEmail] = useState("");
    // State to store any error message
    const [error, setError] = useState(null);           
    // Hook used to navigate between routes
    const navigate = useNavigate();

    // Function that runs when the "Reset Password" button is clicked
    const handleResetPassword = async () => {
        try {
            // Attempt to send a password reset email using Firebase authentication
            await resetPassword(email);     
            // If the email is sent successfully, redirect the user to the login page
            navigate("/login");
        } catch (err) {
            // If sending the email fails, display an error message
            switch (err.code) {     
                case "auth/user-not-found":
                    setError("No account found with this email.");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email format.");
                    break;  
                default:
                    setError("Failed to send reset email. Please try again.");
            }
        }
    };

    return (
        <div className="reset-password form page">
            {/* Email input field */}
            <h2>Enter your email to receive a password reset link:</h2>
            <input
                type="email"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)} // Update email state on input change
            />
            <br />
            {error && <p className="error">{error}</p>}
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
}

export default ResetPassword;