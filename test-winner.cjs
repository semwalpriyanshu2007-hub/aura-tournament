const axios = require('axios');

async function testSelectWinner() {
  try {
    console.log('--- Fetching Tournaments ---');
    const tourneyRes = await axios.get('http://localhost:3000/api/tournaments');
    const tournaments = tourneyRes.data.tournaments;

    if (!tournaments || tournaments.length === 0) {
      console.log('No tournaments found. Please create one first.');
      return;
    }

    const tournamentId = tournaments[0].id;
    const userName = 'EliteWarrior_' + Math.floor(Math.random() * 1000);

    console.log(`--- Selecting Winner for Tournament: ${tournamentId} ---`);
    const winnerRes = await axios.post('http://localhost:3000/api/select-winner', {
      tournamentId,
      userName
    });

    console.log('Select Winner Result:', winnerRes.data);
    
    if (winnerRes.data.success) {
      console.log('PASSED: Winner selected successfully');
    } else {
      console.log('FAILED: Select winner response was not success');
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

testSelectWinner();
