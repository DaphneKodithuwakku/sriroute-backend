const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: 'https://ai-planner-f7964.firebaseio.com'
});

const db = admin.firestore();
app.use(express.json());