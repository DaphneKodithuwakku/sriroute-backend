const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert('./functions/serviceAccountKey.json'),
});

const db = admin.firestore();

async function seedLocations() {
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

  const ref = db.ref('locations');
  await ref.set(locations);
  console.log('Locations seeded successfully');
}

seedLocations().catch(console.error);