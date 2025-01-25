import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      await client.connect();
      const database = client.db('blood-donation-app');
      const profiles = database.collection('profiles');

      // Fetch profile data from the database
      const profileData = await profiles.findOne({ userId: userId });

      if (!profileData) {
        console.error(`Profile data not found for userId: ${userId}`);
        return res.status(404).json({ error: `Profile data not found for userId: ${userId}` });
      }

      res.status(200).json(profileData);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      res.status(500).json({ error: 'Failed to fetch profile data' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
