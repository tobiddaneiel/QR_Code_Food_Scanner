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
      setEditingId(null);
    } catch (error) {
      console.error("Error updating expiration date:", error);
    }
  };

  const handleCancelChange = async(food_id) => {
    const foodItem = currentUserItems.find(item => item.id === food_id);
    setNewDate(foodItem["Expiration Date"]);
    setNewNumber(foodItem["Number of items"]);
    setEditingId(null);
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
            {EditingId? (
              <th>
                  New Date
              </th>) : 
              (null)
            }
            {EditingId? (
              <th>
                  New Number of Items
              </th>) : 
              (null)
            }
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
                style={{ backgroundColor: isExpired ? "#f30404" : "transparent" }}
              >
                {/* Food item name */}
                <td>{food.Name}</td>

                {/* Expiration date */}
                <td>{food["Expiration Date"]}</td>

                {/* Number of items */}
                <td>{food["Number of items"]}</td>

                {/* Food ID (for debugging purposes) */}
                <td>{food.id}</td>

                {EditingId == food.id ? (  
                <td>
                    <button onClick={() => handleSaveChange(food.id)}>
                      Save Change
                    </button>
                    <button onClick={() => handleCancelChange(food.id)}>
                      Cancel
                    </button>
                </td>
                ) : (
                <td>
                <button onClick={() => {setEditingId(food.id); 
                setNewDate(food["Expiration Date"]); 
                setNewNumber(food["Number of items"]);
                }}>
                Edit
                </button>
                </td>
                )}
                
                {EditingId == food.id ? (
                <td>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                </td>
                ) : null
                }
                {EditingId == food.id ? (
                <td>
                <input
                  type="number"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                />
                </td>
                ) : null
                }
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Logout + Redirect */}
      <button onClick={handleLogout}>Logout</button>
      <button id="profile-button" onClick={() => navigate("/profile")}>View Profile</button>
    </div>
  );
}

export default FoodInventory;