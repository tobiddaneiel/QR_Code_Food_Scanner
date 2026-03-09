// Import the functions needed to reference and update a Firestore document
import { doc, updateDoc } from "firebase/firestore";

// Import your initialized Firestore database instance
import { db } from "../firebase/firebase";

// Function to update the expiration date of a food item
export const updateFoodItem = async (id, item1, item2, update1, update2) => {
  
  // Create a reference to a specific document in the "food_inventory" collection
  // Parameters:
  // db → Firestore database instance
  // "food_inventory" → collection name
  // id → document ID
  const foodRef = doc(db, "food_inventory", id);

  // Update only the specified field of that document
  // This does NOT overwrite the entire document
  await updateDoc(foodRef, {
    [item1]: update1,
    [item2]: update2
  });
  
};
