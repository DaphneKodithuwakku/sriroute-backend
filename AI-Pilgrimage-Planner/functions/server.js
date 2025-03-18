const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

const locations = [
    {
      name: 'Jaya Sri Maha Bodhi',
      religion: 'Buddhism',
      region: 'Anuradhapura',
      description: 'A sacred fig tree believed to be a sapling from the Bodhi tree.',
      costEstimate: 500,
      travelTime: 2,
      imageUrl: 'path/to/jaya-sri-maha-bodhi.jpg',
      coordinates: { lat: 8.3452, lng: 80.3963 }
    },
    {
      name: 'Jami Ul-Alfar Mosque', 
      religion: 'Islam',
      region: 'Colombo',
      description: 'A historic mosque known for its red and white color scheme.',
      costEstimate: 300,
      travelTime: 1,
      imageUrl: 'path/to/jami-ul-alfar.jpg',
      coordinates: { lat: 6.9389, lng: 79.8498 }
    },
    {
      name: 'Nallur Kandaswamy Kovil',
      religion: 'Hinduism',
      region: 'Jaffna',
      description: 'A significant Hindu temple dedicated to Lord Murugan.',
      costEstimate: 400,
      travelTime: 2,
      imageUrl: 'path/to/nallur-kovil.jpg',
      coordinates: { lat: 9.6616, lng: 80.0213 }
    },
    {
      name: 'St. Anthony’s Shrine',
      religion: 'Christianity',
      region: 'Colombo',
      description: 'A popular Catholic church and pilgrimage site.',
      costEstimate: 200,
      travelTime: 1,
      imageUrl: 'path/to/st-anthonys.jpg',
      coordinates: { lat: 6.9271, lng: 79.8612 }
    }
];

async function generatePlan(religion, budget, days, region) {
  if (!['Buddhism', 'Islam', 'Hinduism', 'Christianity'].includes(religion)) {
    throw new Error('Invalid religion specified');
  }
  if (!budget || !days || !region) {
    throw new Error('Missing required fields');
  }

  // Initialize totals before filtering
  let totalCost = 0;
  let totalDuration = 0;
  let plan = [];

  // Filter locations and accumulate totals in a single loop
  for (const loc of locations) {
    if (loc.religion === religion && loc.region === region) {
      // Check if adding this location exceeds budget or time
      if (totalCost + loc.costEstimate <= budget && totalDuration + loc.travelTime <= days * 24) {
        plan.push(loc);
        totalCost += loc.costEstimate;
        totalDuration += loc.travelTime;
      }
    }
  }

  return plan.length === 0 ? {
    planId: uuidv4(),
    locations: [],
    totalCost: 0,
    duration: 0,
    message: 'No viable trip plan found.'
  } : {
    planId: uuidv4(),
    locations: plan,
    totalCost,
    duration: totalDuration
  };
}

app.post('/generate-plan', async (req, res) => {
  try {
    const { religion, budget, days, region } = req.body;
    const plan = await generatePlan(religion, budget, days, region);
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));