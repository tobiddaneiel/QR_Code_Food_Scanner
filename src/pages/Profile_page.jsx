import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile_page() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile page">
      <h1>Profile Page</h1>
      <p>This is where user profile information will be displayed.</p>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <button id="inventory-button" onClick={() => navigate("/inventory")}>Go back to Inventory</button>
      <button id="admin-button" onClick={() => navigate("/admin")}>Go to Admin Panel</button>
    </div>
  );
}

export default Profile_page;