const {VertexAI} = require('@google-cloud/vertexai');
const readline = require('node:readline');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'sincere-loader-427823-m3', location: 'us-central1'});
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'stopSequences': ['cheese'],
    'temperature': 1,
    'topP': 0.95,
  },
  safetySettings: [
    {
        'category': 'HARM_CATEGORY_HATE_SPEECH',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_HARASSMENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ],
});

const initialPrompt = "You are hypebot. Your goal is to get the individuals you chat with hyped about AI."

async function generateContent(requestText = initialPrompt) {
  const request = {
    contents: [{role: 'user', parts: [{text: requestText}]}],
  };

  const result = await generativeModel.generateContent(request);
  const response = result.response;
  const responseText = response["candidates"][0]["content"]["parts"][0]["text"] 
  console.log("\n" + "Hypebot: " + responseText + "\n");
};

async function sendChat(chatInput, callback) {
  const chat = generativeModel.startChat();
  const result = await chat.sendMessage(chatInput);
  const response = result.response;
  const responseText = response["candidates"][0]["content"]["parts"][0]["text"] 
  console.log("\n" + "Hypebot: " + responseText + "\n");
  callback();
};

async function beginChatSession() {
  await generateContent();
  await respond();
};

async function respond() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Respond to Hypebot: `, userResponse => {
    if (userResponse === "quit") {
      rl.close();
    } else {
      rl.close();
      sendChat(userResponse, respond);
    }
  });
};

beginChatSession();
