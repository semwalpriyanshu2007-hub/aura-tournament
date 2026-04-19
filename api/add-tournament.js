export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, price } = req.body || {};

    return res.status(200).json({
      success: true,
      message: 'Tournament added',
      data: { name, price }
    });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
