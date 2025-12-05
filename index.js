const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// ROUTE 1: Homepage - show all Books
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=Title,Author,Summary`;

  try {
    const resp = await axios.get(url, { headers });
    const data = resp.data.results;
    res.render('homepage', { title: 'Books Homepage', data });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.send('Error loading books');
  }
});

// ROUTE 2: show create form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add New Book' });
});

// ROUTE 3: handle form submission
app.post('/update-cobj', async (req, res) => {
  const { title, author, summary } = req.body;

  const newRecord = {
    properties: {
      Title: title,
      Author: author,
      Summary: summary
    }
  };

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  try {
    await axios.post(url, newRecord, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.send('Error creating book');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
