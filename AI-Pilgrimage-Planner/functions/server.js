const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());


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