const app = require('./app')
const { PORT = 3000 } = process.env

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
