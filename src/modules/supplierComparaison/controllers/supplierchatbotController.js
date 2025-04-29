const { handleChatbotRequest } = require('../services/suppchatbotService');

exports.processMessage = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim() === '') {
      return res.status(400).json({ message: 'Message vide.' });
    }

    const response = await handleChatbotRequest(input);
    res.json({ message: response });
  } catch (error) {
    console.error('[Chatbot Controller] Erreur :', error);
    res.status(500).json({ message: 'Erreur interne serveur' });
  }
};
