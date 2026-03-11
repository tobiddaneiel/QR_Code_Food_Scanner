import { useNavigate } from "react-router-dom";

import { updateFoodItem } from "../firebase/updateFoodItem.js";

// Custom authentication hook used to get the currently logged-in user
import { useAuth } from "../context/AuthContext.jsx";

// Import Firestore functions (some are not currently used in this component)
//import {collection, addDoc, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";


function UserAdminPage() {
    // Fetch all food inventory items from the "food_inventory" collection,
    // ordered by the "Expiration Date" field
    const foodItems = useFirestoreCollection(
    "food_inventory",
    "Expiration Date"
    );
    // Get the currently authenticated user
    const { user } = useAuth();

    const navigate = useNavigate();

    const currentUserItems = foodItems.filter(f => f.User === user.uid);
    
      const [EditingId, setEditingId] = useState(null);
      const [newDate, setNewDate] = useState("");
      const [newNumber, setNewNumber] = useState("");
      const [sortingCriterion, setSortingCriterion] = useState("");
      const [sortingOrder, setSortingOrder] = useState("asc");
    
      const sortedItems = [...currentUserItems].sort((a, b) => {
        let comparison = 0;
        if (sortingCriterion === "Expiration Date") {
          comparison = new Date(a["Expiration Date"]) - new Date(b["Expiration Date"]);
        } else if (sortingCriterion === "Number of items") {
          comparison = a["Number of items"] - b["Number of items"];
        } else if (sortingCriterion === "Name") {
          comparison = a["Name"].localeCompare(b["Name"]);
        }
    
        return sortingOrder === "asc" ? comparison : -comparison;
      });
    

    return (
    <div>
        <h1>User Admin Page</h1>
        {/* Add your user admin functionalities here */}
    </div>
    );
}

export default UserAdminPage;