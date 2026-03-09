import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      position: "fixed",   // Stick to the top
      top: 0,              // Top of the viewport
      left: 0,             // Start at the left edge
      width: "100%",       // Full width
      padding: "10px",
      background: "#0e0a0aff",
      zIndex: 1000         // Make sure it appears above other elements
    }}>
      <Link to="/inventory" style={{ marginRight: "15px" }}>Food Inventory</Link>
    </nav>
  );
}

export default Navbar;
