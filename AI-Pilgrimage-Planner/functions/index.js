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

async function generatePlan(religion, budget, days, region) {
  try {
    if (!['Buddhism', 'Islam', 'Hinduism', 'Christianity'].includes(religion)) {
      throw new Error('Invalid religion specified');
    }
    if (!budget || !days || !region) {
      throw new Error('Missing required fields');
    }

    const locationsSnapshot = await db.collection('locations')
      .where('religion', '==', religion)
      .where('region', '==', region)
      .get();

      let plan = [];
      let totalCost = 0;
      let totalDuration = 0;

      for (let doc of locationsSnapshot.docs) {
        const location = doc.data();
        if (totalCost + location.costEstimate <= budget && totalDuration + location.travelTime <= days * 24) {
          plan.push({
            name: location.name,
            religion: location.religion,
            cost: location.costEstimate,
            duration: location.travelTime,
            description: location.description || '',
            imageUrl: location.imageUrl || ''
          });
          totalCost += location.costEstimate;
          totalDuration += location.travelTime;
        }
      } 

      if (plan.length === 0) {
        return {
          planId: uuidv4(),
          locations: [],
          totalCost: 5000,
          duration: 0,
          message: 'No viable trip plan found within the given constraints.'
        };
      }
  
      return {
        planId: uuidv4(),
        locations: plan,
        totalCost,
        duration: totalDuration
      };
    } catch (error) {
      throw new Error(`Error generating plan: ${error.message}`);
    }
  }

  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { religion, budget, days, region } = req.body;
      const plan = await generatePlan(religion, budget, days, region);
      await db.collection('tripPlans').doc(plan.planId).set(plan);
      res.status(200).json(plan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
