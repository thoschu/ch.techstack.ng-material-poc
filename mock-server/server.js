const fs= require('fs'),
  express= require('express'),
  cors= require('cors'),
  multer= require('multer'),
  winston = require('winston'),
  expressWinston= require('express-winston'),
  { Configuration, OpenAIApi } = require('openai'),
  dotenv = require('dotenv');

dotenv.config();

const app = express().use(cors(), expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  level: 'verbose',
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // ignoreRoute: (req, res) => { return false; } // optional: allows to skip some log messages based on request and/or response
}));

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    fs.mkdir('./mock-server/videos/',(err)=> {
      console.error(err);

      cb(null, './mock-server/videos/');
    });
  },
  filename:  (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No videos file uploaded.');
    } else {
      res.status(200).send('Video uploaded successfully.');
    }
  } catch (error) {
    return res.status(500).send("Error!");
  }
});

app.get('/', async (req, res) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: 'org-WaBrLoSA1kjTGKk2MiV6nIpD'
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 7,
  });

  const response2 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Human: Hello, who are you?",
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  console.log(response2.data);
  res.send(JSON.stringify(response.data, null, 4));
})

app.listen(3030, () => {
  console.info('Server is running on http://localhost:3030');
});
