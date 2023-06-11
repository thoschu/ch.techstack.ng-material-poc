const fs= require('fs'),
  express= require('express'),
  http = require('http');
  socketIO = require('socket.io'),
  cors= require('cors'),
  multer= require('multer'),
  winston = require('winston'),
  expressWinston= require('express-winston'),
  { Configuration, OpenAIApi } = require('openai'),
  dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.Console()
//   ],
//   format: winston.format.combine(
//     winston.format.colorize(),
//     winston.format.json()
//   ),
//   level: 'verbose',
//   meta: true,
//   msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//   expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//   colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//   // ignoreRoute: (req, res) => { return false; } // optional: allows to skip some log messages based on request and/or response
// }));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origins: ['http://localhost:4200', 'https://localhost:4200'],
    methods: ["GET", "POST"],
    allowedHeaders: [],
    credentials: true
  }
});

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
    prompt: "Human: Hello, who are you?",
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  res.set({
    'Content-Type': 'text/json',
    'ETag': '12345'
  });
  res.send(JSON.stringify(response.data, null, 4));
});

// WebRTC-Signaling-Logik
io.on('connection', socket => {
  // Ein neuer Benutzer ist verbunden
  console.log(`Ein Benutzer mit der Id: ${socket.id} hat sich verbunden.`);

  // Raum beitreten
  socket.on('join', ({room, user}) => {
    socket.join(room);
    console.log(`Benutzer: ${user} ist Raum ${room} beigetreten..`);
  });

  // Verarbeitung von 'offer' vom Client
  socket.on('offer', ({ room, offer }) => {
    console.log('Angebot erhalten:', offer);
    socket.to(room).emit('offer', offer); // Angebot an andere Clients senden
  });

  // Verarbeitung von 'answer' vom Client
  socket.on('answer', ({ room, answer }) => {
    console.log('Antwort erhalten:', answer);
    socket.to(room).emit('answer', answer); // Antwort an andere Clients senden
  });

  // Verarbeitung von 'ice-candidate' vom Client
  socket.on('iceCandidate', ({ room, candidate }) => {
    console.log('ICE-Kandidat erhalten:', candidate);
    socket.to(room).emit('iceCandidate', candidate); // ICE-Kandidat an andere Clients senden
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});


server.listen(3030, () => {
  const port = 3030;
  console.info(`Server is running on http://localhost:${port}`);
});
