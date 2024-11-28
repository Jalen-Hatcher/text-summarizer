const express = require('express')
const app = express()
const path = require('path')
const { spawn } = require('child_process')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // save files to the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) // set unique filename (date created)
    }
});
  
const upload = multer({ storage })

app.use(express.json())

// install dependencies for summarizer.py
const installDependencies = () => {
    console.log('Installing Python dependencies...');
    const install = spawn('python3', ['-m', 'pip', 'install', '-r', 'requirements.txt']);

    // log intermediate pip errors
    install.stdout.on('data', (data) => {
      console.log(`Pip output: ${data}`);
    });
  
    install.stderr.on('data', (data) => {
      console.error(`Pip error: ${data}`);
    });
  
    install.on('close', (code) => {
      if (code === 0) {
        console.log('Python dependencies installed successfully.');
      } else {
        console.error(`Pip install exited with code ${code}`);
      }
    });
};

installDependencies();

// api endpoint to handle file submissions
app.post('/upload', upload.single('file'), (req, res) => {
   if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
   }

   console.log('File uploaded:', req.file);

  // path to the uploaded file
  const filePath = path.join(req.file.path);

  // run summarizer.py in new process with file path as argument
  const pythonProcess = spawn('python3', ['summarizer.py', filePath]);

  // collect output from summarizer.py
  let pythonOutput = '';
  pythonProcess.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  // handle errors from summarizer.py
  pythonProcess.stderr.on('data', (data) => {
    console.error('Python script error:', data.toString());
    return res.status(500).json({ error: 'Error processing file with Python script' });
  });

  // handle the end of script execution
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        // parse the script's JSON output
        const result = JSON.parse(pythonOutput);
        res.json(result); // send result back to the client
      } catch (err) {
        console.error('Error parsing Python script output:', err);
        res.status(500).json({ error: 'Error parsing Python script output' });
      }
    } else {
      res.status(500).json({ error: 'Python script exited with error' });
    }
  });
});

// serve index.html on GET request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

// Not found handler
app.use((request, response, next) => {
    next(`Not found: ${request.originalUrl}`);
  });
  
// Error handler
app.use((error, req, res, next) => {
    console.error(error);
    const { status = 500, message = "Something went wrong!" } = error;
    res.status(status).json({ error: message });
});

module.exports = app