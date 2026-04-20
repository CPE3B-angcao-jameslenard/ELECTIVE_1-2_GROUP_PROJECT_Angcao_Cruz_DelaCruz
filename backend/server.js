import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('DISHcovery AI Backend is successfully running!');
});

app.get('/api/desserts', (req, res) => {
    const sampleDesserts = [
        { id: 1, name: "Matcha Mille Crepe", origin: "Japan" },
        { id: 2, name: "Tiramisu", origin: "Italy" },
        { id: 3, name: "Chocolate Cake", origin: "USA" }
    ];
    res.json(sampleDesserts);
});

app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !ingredients.trim()) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const prompt = `
You are a dessert recipe generator.

Create a complete dessert recipe using these ingredients: "${ingredients}"

Return ONLY valid JSON in this exact format:
{
  "recipe": {
    "recipeName": "string",
    "prepTime": "string",
    "difficulty": "string",
    "ingredients": ["string", "string"],
    "instructions": ["string", "string", "string", "string", "string"]
  }
}

Rules:
- Make the recipe realistic.
- Make the instructions visible and detailed.
- Return 5 to 8 steps in the instructions array.
- Do not include markdown, explanations, or extra text.
`;

    const mockRecipe = {
      recipe: {
        recipeName: `${ingredients} Delight`,
        prepTime: "25 mins",
        difficulty: "Medium",
        ingredients: ingredients.split(',').map(item => item.trim()),
        instructions: [
          "Prepare all ingredients and tools.",
          "Combine the ingredients in a mixing bowl.",
          "Mix until smooth and well combined.",
          "Transfer to a baking or serving dish.",
          "Cook, chill, or bake as needed.",
          "Serve and enjoy."
        ]
      }
    };

    res.json(mockRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
