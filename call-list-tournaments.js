import axios from 'axios';

async function listTournaments() {
  try {
    const response = await axios.get('http://localhost:3000/api/tournaments');
    console.log('Response status:', response.status);
    console.log('Tournaments count:', response.data.count);
    console.log('Tournaments:', JSON.stringify(response.data.tournaments, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

listTournaments();
