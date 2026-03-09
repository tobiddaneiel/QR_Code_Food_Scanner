import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db }  from "../firebase/firebase";

// Custom hook to listen to a Firestore collection
export function useFirestoreCollection(collectionName, orderField = null) {
  const [data, setData] = useState([]);

  useEffect(() => {

    console.log("orderField value:", orderField);

    // Build query
    let q = collection(db, collectionName);
    if (orderField) {
      q = query(q, orderBy(orderField, "asc"));
    }

    // Attach listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(list);
    });

    

    // Cleanup on unmount
    return () => unsubscribe();
  }, [collectionName, orderField]);
  

  return data;
}
