import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
console.log(process.env.OPEN_API_KEY);
const configuration = new Configuration({
apiKey: process.env.OPEN_API_KEY,

});

const openai = new OpenAIApi(configuration);

const app = express();

const corsOptions = {
  origin: 'https://ad-codex-r8dsqrebd-adritatori.vercel.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Hello from CodeX',
    })

});

app.post('/', async (req, res)=>{
  try{
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model:"text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens:3000,
      top_p:1,
      frequency_penalty:0.5 ,
      presence_penalty:0,
   
  });

  res.status(200).send({
    bot: response.data.choices[0].text
  })
  } catch (error){
        console.log(error);
        res.status(500).send({error})

  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))