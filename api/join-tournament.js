import { db } from '../firebase';
import { doc, runTransaction } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tournamentId, userName } = req.body;

  if (!tournamentId || !userName) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const tournamentRef = doc(db, 'tournaments', tournamentId);

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(tournamentRef);

      if (!docSnap.exists()) throw 'Tournament not found';

      const data = docSnap.data();

      // 🚫 FULL CHECK
      if ((data.joinedSlots || 0) >= (data.maxSlots || 0)) {
        throw 'Tournament full';
      }

      // 🚫 DUPLICATE CHECK
      if (data.players && data.players.includes(userName)) {
        throw 'Already joined';
      }

      // ✅ SAFE UPDATE
      transaction.update(tournamentRef, {
        joinedSlots: (data.joinedSlots || 0) + 1,
        players: [...(data.players || []), userName]
      });
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(400).json({ error: err });
  }
}
