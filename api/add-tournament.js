export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { name, price } = req.body || {};

      return res.status(200).json({
        success: true,
        message: 'Tournament added',
        data: { name, price }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}
