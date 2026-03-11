// Import the functions needed to reference and update a Firestore document
import { doc, deleteDoc } from "firebase/firestore";

// Import your initialized Firestore database instance
import { db } from "../firebase/firebase";

// Function to delete a food item
export const deleteFoodItem = async (id) => {
  // Create a reference to a specific document in the "food_inventory" collection
  // Parameters:
  // db → Firestore database instance
  // "food_inventory" → collection name
  // id → document ID
  const foodRef = doc(db, "food_inventory", id);

  // Delete the document
  await deleteDoc(foodRef);
};
