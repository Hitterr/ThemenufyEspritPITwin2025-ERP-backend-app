const axios = require('axios');
const Supplier = require('../../../models/supplier');
const Ingredient = require('../../../models/ingredient');
require('dotenv').config();

exports.handleChatbotRequest = async (input) => {
  try {
    const suppliers = await Supplier.find();
    const ingredients = await Ingredient.find();

    const ingredientMap = {};
    ingredients.forEach(i => {
      ingredientMap[i._id.toString()] = i.libelle || i.name;
    });

    const userInput = input.toLowerCase();
    let knowledge = '';

    // 🔁 Si la question demande "juste" la liste des ingrédients
    if (userInput.includes('liste') && (userInput.includes('juste') || userInput.includes('seulement'))) {
      const uniqueNames = new Set();

      for (const s of suppliers) {
        if (!Array.isArray(s.ingredients)) continue;
        for (const ing of s.ingredients) {
          const name = ingredientMap[ing.ingredientId?.toString()];
          if (name) uniqueNames.add(name);
        }
      }

      knowledge = 'Voici uniquement la liste des ingrédients disponibles :\n';
      [...uniqueNames].forEach(name => {
        knowledge += `- ${name}\n`;
      });
    } else {
      // 🔁 Réponse enrichie classique avec prix, fournisseur, délai
      knowledge = 'Voici la liste des ingrédients disponibles avec leurs fournisseurs :\n';

      for (const s of suppliers) {
        if (!Array.isArray(s.ingredients) || s.ingredients.length === 0) continue;

        for (const ing of s.ingredients) {
          const name = ingredientMap[ing.ingredientId?.toString()] || 'Ingrédient inconnu';
          const price = ing.price ?? 'inconnu';
          const delay = ing.deliveryTime ?? 'non précisé';
          knowledge += `• ${name} – Fournisseur ${s.name} – ${price} €/u – délai ${delay} jours\n`;
        }
      }

      if (knowledge.trim().endsWith(':')) {
        knowledge += ' Aucun ingrédient disponible.\n';
      }
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              `Tu es un assistant pour la gestion des ingrédients dans un restaurant. Voici la base de données à ta disposition :\n\n${knowledge}`,
          },
          {
            role: 'user',
            content: input,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('💥 OpenRouter Error:', error.response?.data || error.message);
    return '🤖 Je ne peux pas répondre pour l’instant. Réessaie bientôt.';
  }
};
