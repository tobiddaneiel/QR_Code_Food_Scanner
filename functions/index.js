const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();
const db = admin.firestore();

exports.api = functions.https.onRequest(async (req, res) => {
  try {
    const { action, collection, documentId, data} =  req.method === "GET" ? req.query : req.body;

    if (!collection) {
      return res.status(400).send("Collection required");
    }

    // CREATE DOCUMENT
    if (action === "create") {
      const docRef = await db.collection(collection).add(data);
      return res.status(200).json({ id: docRef.id });
    }

    // UPDATE DOCUMENT
    if (action === "update") {
      if (!documentId) return res.status(400).send("documentId required");
      await db.collection(collection).doc(documentId).update(data);
      return res.status(200).send("Updated successfully");
    }

    // GET COLLECTION OR FILTERED DOCUMENTS
    if (action === "get") {
      // Grab query parameters for filtering
      const field = req.query.field;
      const value = req.query.value;

      let snapshot;

      if (field && value) {
        // Filter collection where field equals value
        snapshot = await db.collection(collection)
          .where(field, '==', value)
          .get();
      } else if (documentId) {
        // Optional: allow documentId too
        const doc = await db.collection(collection).doc(documentId).get();
        return res.status(200).json({ id: doc.id, ...doc.data() });
      } else {
        // No filter or documentId → return full collection
        snapshot = await db.collection(collection).get();
      }

      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json(docs);
    }

    return res.status(400).send("Invalid action");

  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});