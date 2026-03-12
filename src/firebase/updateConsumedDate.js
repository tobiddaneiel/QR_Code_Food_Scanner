// Import the functions needed to reference and update a Firestore document
import { doc, updateDoc } from "firebase/firestore";

// Import your initialized Firestore database instance
import { db } from "./firebase";

// Function to update the consumed date for a food item
export const updateConsumedDate = async (id) => {
  // Create a reference to a specific document in the "food_inventory" collection
  // Parameters:
  // db → Firestore database instance
  // "food_inventory" → collection name
  // id → document ID
  const foodRef = doc(db, "food_inventory", id);

  // Update the document to add the "Consumed Date" field
  await updateDoc(  foodRef, {
    "Consumed Date": new Date()
  });
};
