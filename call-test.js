import axios from 'axios';

async function checkServer() {
  try {
    console.log('--- Checking Root ---');
    const rootRes = await axios.get('http://localhost:3000/');
    console.log('Root Status:', rootRes.status);
    console.log('Root Content Sample:', rootRes.data.substring(0, 500));

    console.log('\n--- Checking API Health ---');
    const healthRes = await axios.get('http://localhost:3000/api/health');
    console.log('Health Status:', healthRes.status);
    console.log('Health Data:', healthRes.data);

    console.log('\n--- Checking Tournaments API ---');
    const tourneyRes = await axios.get('http://localhost:3000/api/tournaments');
    console.log('Tournaments Status:', tourneyRes.status);
    console.log('Tournaments Data Count:', tourneyRes.data.tournaments?.length);
    if (tourneyRes.data.tournaments && tourneyRes.data.tournaments.length > 0) {
      console.log('First Tournament Name:', tourneyRes.data.tournaments[0].name);
      console.log('First Tournament Participant Count:', tourneyRes.data.tournaments[0].participantCount);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

checkServer();
