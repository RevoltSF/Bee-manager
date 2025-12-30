const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const config = require("@root/config").AI;

const fs = require('fs');
const genAI = new GoogleGenerativeAI(config.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatHistory = []; 

async function run(message, prompt) {
  const name = message.member.nickname || message.author.username;
  const guild = message.guild.name;
  const channel = message.channel.name;
  const fullPrompt = prompt;

  try {
    // Load chat history from file if it exists
    try {
      chatHistory = JSON.parse(fs.readFileSync('chat_history.json', 'utf-8')) || []
    } catch (err) {
      // Ignore error if file doesn't exist
    }

    const chat = model.startChat({ history: chatHistory, safetySettings: [
      {
       
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
      
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
      
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      ] });

    const result = await chat.sendMessage(fullPrompt);

    // Save the chat history after each message
    chatHistory = await chat.getHistory()
    
    fs.writeFileSync('chat_history.json', JSON.stringify(chatHistory));

    return result.response.text();
  } catch (error) {
    console.error("Error using API:", error);
    return "I'm sorry, there was an error processing your request.";
  }
}

module.exports = run;
