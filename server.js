const express = require('express');

const app = express();

// create our API (take json  data from our requests to our endpoints/routes/url in our backend)
// instead using third api like github api, pagarme, ibge

app.get('/', (req, res) => {
  res.json({ msg: 'Salve felipao' });
  // json can be a js object
  //   res.sendFile
});

// Define our routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;
// This looks to an environment variable called PORT first to use this in production

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
