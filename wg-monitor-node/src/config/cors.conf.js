
const cors = require('cors');

function addCORS(app) {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}

module.exports = {
  addCORS
}