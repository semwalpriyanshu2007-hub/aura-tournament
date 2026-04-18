import express from 'express';
import admin from 'firebase-admin';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  logStream.write(`[LOG] ${new Date().toISOString()}: ${args.join(' ')}\n`);
  originalLog(...args);
};

console.error = (...args) => {
  logStream.write(`[ERR] ${new Date().toISOString()}: ${args.join(' ')}\n`);
  originalError(...args);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Initialize Firebase Admin
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  console.log('Attempting to load service account from:', serviceAccountPath);

  try {
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully from file.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully from environment variable.');
    } else {
      console.warn('Firebase configuration missing: serviceAccountKey.json not found AND FIREBASE_SERVICE_ACCOUNT env var not set.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error.stack);
  }

  // Set up Firestore connection (if admin was initialized)
  let db;
  try {
    if (admin.apps.length > 0) {
      db = admin.firestore();
      console.log('Firestore initialized successfully');
    } else {
      console.warn('Firebase Admin apps length is 0, Firestore not initialized');
    }
  } catch (error) {
    console.error('Error setting up Firestore:', error.stack);
  }

  // API ROUTES (MUST BE BEFORE VITE MIDDLEWARE)
  
  // Test route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', firebase: !!db });
  });

  // Temporary endpoint to add a test tournament
  app.get('/api/test-add', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Firestore is not initialized' });
      }

      const docRef = await db.collection('tournaments').add({
        name: "Test Cup",
        price: 50,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ 
        success: true, 
        message: 'Test tournament added successfully', 
        id: docRef.id 
      });
    } catch (error) {
      console.error('Error adding test tournament:', error.message);
      res.status(500).json({ error: 'Failed to add test tournament' });
    }
  });

  // Example API route for AI integration placeholder
  app.post('/api/ai-process', async (req, res) => {
    const { data } = req.body;
    res.json({ message: 'AI processing endpoint ready', data });
  });

  // Add tournament to Firestore
  app.post('/api/add-tournament', async (req, res) => {
    try {
      const { 
        name, 
        price, 
        type = 'solo', 
        prizePool = 1000, 
        maxSlots = 48, 
        date = new Date().toISOString().split('T')[0], 
        startTime = '18:00' 
      } = req.body;

      if (!db) {
        return res.status(500).json({ error: 'Firestore is not initialized' });
      }

      if (!name || isNaN(price)) {
        return res.status(400).json({ error: 'Invalid name or price' });
      }

      const docRef = await db.collection('tournaments').add({
        name,
        price: parseFloat(price),
        type,
        prizePool: parseFloat(prizePool),
        maxSlots: parseInt(maxSlots),
        date,
        startTime,
        joinedSlots: 0,
        status: 'upcoming',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(201).json({ 
        success: true, 
        message: 'Tournament added successfully', 
        id: docRef.id 
      });
    } catch (error) {
      console.error('Error adding tournament:', error.message);
      res.status(500).json({ error: 'Failed to add tournament' });
    }
  });

  // List all tournaments from Firestore
  app.get('/api/tournaments', async (req, res) => {
    try {
      if (!db) {
        console.warn('Firestore not initialized. Returning mock tournaments.');
        return res.json({
          success: true,
          fromMock: true,
          count: 3,
          tournaments: [
            {
              id: 'tr1',
              name: 'Elite Squad Pro (Demo)',
              type: 'squad',
              entryFee: 100,
              prizePool: 5000,
              maxSlots: 12,
              joinedSlots: 10,
              status: 'upcoming',
              date: '2024-03-25',
              startTime: '18:00',
              participantCount: 10
            },
            {
              id: 'tr2',
              name: 'Solo Survivalist (Demo)',
              type: 'solo',
              entryFee: 20,
              prizePool: 1000,
              maxSlots: 48,
              joinedSlots: 15,
              status: 'upcoming',
              date: '2024-03-26',
              startTime: '20:00',
              participantCount: 15
            },
            {
              id: 'tr3',
              name: 'Duo Dominators (Demo)',
              type: 'duo',
              entryFee: 50,
              prizePool: 2500,
              maxSlots: 24,
              joinedSlots: 24,
              status: 'upcoming',
              date: '2024-03-27',
              startTime: '19:00',
              participantCount: 24
            }
          ]
        });
      }

      const snapshot = await db.collection('tournaments').orderBy('createdAt', 'desc').get();
      
      const tournaments = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Dynamic count from participants collection
        const participantSnapshot = await db.collection('participants')
          .where('tournamentId', '==', doc.id)
          .count()
          .get();

        // Fetch winner if exists
        const winnerSnapshot = await db.collection('winners')
          .where('tournamentId', '==', doc.id)
          .limit(1)
          .get();
        
        const winnerData = !winnerSnapshot.empty ? winnerSnapshot.docs[0].data() : null;
          
        return {
          id: doc.id,
          ...data,
          participantCount: participantSnapshot.data().count,
          winner: winnerData ? winnerData.userName : null
        };
      }));

      res.json({
        success: true,
        count: tournaments.length,
        tournaments
      });
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  });

  // List participants for a tournament
  app.get('/api/tournament/:id/participants', async (req, res) => {
    try {
      const { id } = req.params;
      if (!db) {
        console.warn('Firestore not initialized. Returning mock participants.');
        return res.json({
          success: true,
          fromMock: true,
          count: 5,
          participants: [
            { id: 'p1', userName: 'ShadowSlayer', joinedAt: new Date().toISOString() },
            { id: 'p2', userName: 'ProGamerX', joinedAt: new Date().toISOString() },
            { id: 'p3', userName: 'NeonHunter', joinedAt: new Date().toISOString() },
            { id: 'p4', userName: 'GlitchMaster', joinedAt: new Date().toISOString() },
            { id: 'p5', userName: 'AuraSniper', joinedAt: new Date().toISOString() }
          ]
        });
      }

      const snapshot = await db.collection('participants')
        .where('tournamentId', '==', id)
        .orderBy('joinedAt', 'desc')
        .get();

      const participants = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json({
        success: true,
        count: participants.length,
        participants
      });
    } catch (error) {
      console.error('Error fetching participants:', error.message);
      res.status(500).json({ error: 'Failed to fetch participants' });
    }
  });

  // Join a tournament
  app.post('/api/join-tournament', async (req, res) => {
    try {
      const { tournamentId, userName } = req.body;

      if (!db) {
        console.warn('Firestore not initialized. Simulating join success.');
        return res.status(201).json({
          success: true,
          fromMock: true,
          message: 'Joined tournament successfully (Demo Mode)',
          participantId: 'mock-p-' + Date.now()
        });
      }

      if (!tournamentId || !userName) {
        return res.status(400).json({ error: 'Tournament ID and User Name are required' });
      }

      // Check if tournament exists
      const tournamentDoc = await db.collection('tournaments').doc(tournamentId).get();
      if (!tournamentDoc.exists) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Check if user already joined
      const existingParticipant = await db.collection('participants')
        .where('tournamentId', '==', tournamentId)
        .where('userName', '==', userName)
        .limit(1)
        .get();
        
      if (!existingParticipant.empty) {
        return res.status(400).json({ error: 'Already joined this tournament' });
      }

      // Save participant
      const docRef = await db.collection('participants').add({
        tournamentId,
        userName,
        joinedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Increment joinedSlots in tournament document
      await db.collection('tournaments').doc(tournamentId).update({
        joinedSlots: admin.firestore.FieldValue.increment(1)
      });

      res.status(201).json({
        success: true,
        message: 'Joined tournament successfully',
        participantId: docRef.id
      });
    } catch (error) {
      console.error('Error joining tournament:', error.message);
      res.status(500).json({ error: 'Failed to join tournament' });
    }
  });

  // Update a tournament
  app.put('/api/tournament/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      if (!db) {
        return res.status(500).json({ error: 'Firestore is not initialized' });
      }

      if (!id) {
        return res.status(400).json({ error: 'Tournament ID is required' });
      }

      // Validate inputs
      if (!name || typeof price !== 'number') {
        return res.status(400).json({ error: 'Name and price (number) are required' });
      }

      const tournamentRef = db.collection('tournaments').doc(id);
      const doc = await tournamentRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Update basic fields
      await tournamentRef.update({
        name,
        price,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        message: 'Tournament updated successfully',
        id
      });
    } catch (error) {
      console.error('Error updating tournament:', error.message);
      res.status(500).json({ error: 'Failed to update tournament' });
    }
  });

  // Select a winner for a tournament
  app.post('/api/select-winner', async (req, res) => {
    try {
      const { tournamentId, userName } = req.body;

      if (!db) {
        return res.status(500).json({ error: 'Firestore is not initialized' });
      }

      if (!tournamentId || !userName) {
        return res.status(400).json({ error: 'Tournament ID and User Name are required' });
      }

      // Check if tournament exists
      const tournamentDoc = await db.collection('tournaments').doc(tournamentId).get();
      if (!tournamentDoc.exists) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Save winner
      const winnerRef = await db.collection('winners').add({
        tournamentId,
        userName,
        selectedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(201).json({
        success: true,
        message: 'Winner selected successfully',
        winnerId: winnerRef.id
      });
    } catch (error) {
      console.error('Error selecting winner:', error.message);
      res.status(500).json({ error: 'Failed to select winner' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: process.cwd()
    });
    
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    // Serve index.html for any non-API routes
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // 1. Read index.html
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react
        template = await vite.transformIndexHtml(url, template);

        // 3. Send the rendered HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace so it maps back
        // to your actual source code.
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();
export default appPromise;
