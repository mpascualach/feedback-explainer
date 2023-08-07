const express = require("express"); /* useful for buiding APIs - routing, HTTP request handling, etc. */
const cors = require("cors"); /* Cross-Origin Resource Sharing - facilitates comms between client-side JS code and other servers */
const bodyParser = require("body-parser"); /*  */
require("dotenv").config();

const {
  Configuration,
  OpenAIApi,
} = require("openai"); /* needed to interact with openAI API */

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
  });
  res.send(completion.data.choices[0].text);
});

// start server here
const port = 8080;
app.listen(port, () => [console.log(`Server listening on port ${port}`)]);
