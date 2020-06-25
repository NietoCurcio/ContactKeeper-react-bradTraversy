const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect database
connectDB();
// create our API (take json  data from our requests to our endpoints/routes/url in our backend)
// instead using third api like github api, pagarme, ibge

// Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.json({ msg: 'Salve felipao' });
  // json can be a js object
  //   res.sendFile
});

// Define our routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// direct the server to load index.html inside the build folder
// Serve static assets in production - serve react in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder, which is our static assets that react build for us
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
  // anything that's not our routes above
}

const PORT = process.env.PORT || 5000;
// This looks to an environment variable called PORT first to use this in production

// config with default.json is for global variables, like env.local

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
