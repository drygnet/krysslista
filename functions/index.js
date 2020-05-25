const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
let db = admin.firestore();

const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/:id', async (req, res) => res.send(await getItems(req.params.id)));
app.get('/', async (req, res) => res.send(await getLists()));


// Expose Express API as a single Cloud Function:
exports.lists = functions.https.onRequest(app);


const getLists = async () => {
  const col = db.collection('lists')
  const snapshot = await col.get();
  const docs = snapshot.docs.map(doc => {
    return {id: doc.id, ...doc.data()}
  })
  return JSON.stringify(docs);
}

const getItems = async (id) => {
  const col = db.collection('lists').doc(id).collection('items')
  const snapshot = await col.get();
  const docs = snapshot.docs.map(doc => {
    return {id: doc.id, ...doc.data()}
  })
  return JSON.stringify(docs);
}
