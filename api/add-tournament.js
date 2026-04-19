export default function handler(req, res) {
  if (req.method === 'POST') {

    // 🔥 FIXED
    const { name, entryFee } = req.body || {};

    return res.status(200).json({
      success: true,
      message: 'Tournament added',
      data: { name, entryFee }
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
