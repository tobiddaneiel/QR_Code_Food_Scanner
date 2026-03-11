import { logout } from "../firebase/authService";
import { useNavigate } from "react-router-dom";

import { updateFoodItem } from "../firebase/updateFoodItem.js";
// Import React hooks (useState and useEffect are imported but not currently used)
import { useState, useEffect } from "react";

// Custom hook used to fetch a Firestore collection and keep it in sync
import { useFirestoreCollection } from "../hooks/useFirestoreCollection.jsx";

// Custom authentication hook used to get the currently logged-in user
import { useAuth } from "../context/AuthContext.jsx";

// Import Firestore functions (some are not currently used in this component)
//import {collection, addDoc, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function FoodInventory() {
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

  const [isEditingId, setIsEditingId] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [sortingCriterion, setSortingCriterion] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");

  const sortedItems = [...currentUserItems].sort((a, b) => {
    let comparison = 0;
    if (sortingCriterion === "Expiration Date") {
      comparison = new Date(a["Expiration Date"].toDate()) - new Date(b["Expiration Date"].toDate());
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

  const handleSaveChange = async(food_id) => {
    try {      
      await updateFoodItem(food_id, "Expiration Date","Number of items", newDate, newNumber);
      setIsEditingId(false);
      setNewDate(currentUserItems["Expiration Date"]);
      setNewNumber(currentUserItems["Number of items"]);
      setIsEditingId(false);
    } catch (error) {
      console.error("Error updating expiration date:", error);
    }
  };

  const handleCancelChange = () => {
    setNewDate(currentUserItems["Expiration Date"]);
    setNewNumber(currentUserItems["Number of items"]);
    setIsEditingId(false);
  }

  const handleLogout = async () => {
    // Sign the user out of Firebase
    await logout();

    // Redirect the user to the home page
    navigate("/");
  };                
  return (
    <div className="food-inventory page">
      {/* Page heading */}
      <h1>Welcome</h1>

      {/* Display the logged-in user's email (if available) */}
      <h3>{user && user.email}</h3>

      {/* Table displaying food inventory data */}
      <table>
        <thead>
          <tr>
            <th><button onClick={() => handleSortingChange("Name")}>Name</button></th>
            <th><button onClick={() => handleSortingChange("Expiration Date")}>Expiration Date</button></th>
            <th><button onClick={() => handleSortingChange("Number of items")}>Number of Items</button></th>
            <th>Food ID</th>
            <th></th>
            <th>{isEditingId? (
                  "New Date"
                ) : (
                null)}
            </th>
            <th>{isEditingId? (
                  "New Number of Items"
                ) : (
                null)}
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Loop through food items and display each one as a table row */}
          {sortedItems.map((food) => {

            const expiryDate = new Date(food["Expiration Date"]);
            const today = new Date();

            const isExpired = expiryDate < today;

            return (
              <tr
                key={food.id}
                style={{ backgroundColor: isExpired ? "#ffcccc" : "transparent" }}
              >
                {/* Food item name */}
                <td>{food.Name}</td>

                {/* Expiration date */}
                <td>{food["Expiration Date"]}</td>

                {/* Number of items */}
                <td>{food["Number of items"]}</td>

                {/* Food ID (for debugging purposes) */}
                <td>{food.id}</td>

                <td>
                  {isEditingId == food.id ? (
                    <>
                      <button onClick={() => handleSaveChange(food.id)}>
                        Save Change
                      </button>
                      <button onClick={handleCancelChange}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditingId(food.id)}>
                      Edit
                    </button>
                  )}
                </td>

                <td>
                  {isEditingId == food.id ? (
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  ) : null}
                </td>

                <td>
                  {isEditingId == food.id ? (
                    <input
                      type="number"
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                    />
                  ) : null}
                </td>
              </tr>
            );

          })}
        </tbody>
      </table>
      <tr></tr>
      {/* Logout + Redirect */}
      <button onClick={handleLogout}>Logout</button>
      <button id="profile-button" onClick={() => navigate("/profile")}>View Profile</button>
    </div>
  );
}

export default FoodInventory;