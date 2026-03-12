import { logout } from "../firebase/authService";
import { useNavigate } from "react-router-dom";

import { deleteFoodItem } from "../firebase/deleteFoodItem.js";
import { updateConsumedDate } from "../firebase/updateConsumedDate.js";
// Import React hooks (useState and useEffect are imported but not currently used)
import { useState, useEffect } from "react";

// Custom hook used to fetch a Firestore collection and keep it in sync
import { useFirestoreCollection } from "../hooks/useFirestoreCollection.jsx";

// Custom authentication hook used to get the currently logged-in user
import { useAuth } from "../context/AuthContext.jsx";

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

    //const [newDate, setNewDate] = useState("");
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

    const handleSortingChange = (criterion) => {
        if (sortingCriterion === criterion) {
        setSortingOrder(sortingOrder === "asc" ? "desc" : "asc");
        } else {
        setSortingCriterion(criterion);
        setSortingOrder("asc");
        }
    };

    const handleDeleteEntry = async (food_id) => {
        try {
          await deleteFoodItem(food_id);
          setEditingId(null);
        } catch (error) {
          console.error("Error deleting food item:", error);
        }
    };

    const handleUpdateConsumedDate = async (food_id) => {
        try {
          await updateConsumedDate(food_id);
          setEditingId(null);
        } catch (error) {
          console.error("Error updating consumed date:", error);
        }
    };


    return (
        <div className="admin page">
            {/* Page heading */}
            <h1>Admin Panel</h1>
            {/* Table displaying data */}
            <table>
                <thead>
                <tr>
                    <th><button onClick={() => handleSortingChange("Name")}>Name</button></th>
                    <th><button onClick={() => handleSortingChange("Expiration Date")}>Expiration Date</button></th>
                    <th><button onClick={() => handleSortingChange("Number of items")}>Number of Items</button></th>
                    <th>Consumed Date</th>
                    <th>Created Date</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {/* Loop through food items and display each one as a table row */}
                {sortedItems.map((food) => {

                    const expiryDate = new Date(food["Expiration Date"] + "T00:00:00");
                    const today = new Date().setHours(0,0,0,0);

                    const isExpired = expiryDate < today;

                    return (
                    <tr
                        key={food.id}
                        style={{ backgroundColor: isExpired ? "#f30404" : "transparent" }}>
                        {/* Food item name */}
                        <td>{food.Name}</td>

                        {/* Expiration date */}
                        <td>{food["Expiration Date"]}</td>

                        {/* Number of items */}
                        <td>{food["Number of items"]}</td>

                        {/* Food ID (for debugging purposes) */}
                        <td>{food["Consumed Date"]?((food["Consumed Date"]).toDate().toLocaleDateString()):null}</td>
                        <td>{(food["created_at"]).toDate().toLocaleDateString()}</td>
                        <td>
                            <button onClick={() => handleUpdateConsumedDate(food.id)}>
                                Consumed
                            </button>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteEntry(food.id)}>
                            Delete Entry
                            </button>
                        </td>
                    </tr>
                    );

                })}
                </tbody>
            </table>
            <button id="profile-button" onClick={() => navigate("/profile")}>Back to Profile</button>
    </div>
    );
}

export default UserAdminPage;