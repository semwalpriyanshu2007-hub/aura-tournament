import axios from 'axios';

async function callAddTournament() {
  try {
    const response = await axios.post('/api/add-tournament', {
      name: "Aura Cup 2",
      price: 150
    });
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

callAddTournament();
