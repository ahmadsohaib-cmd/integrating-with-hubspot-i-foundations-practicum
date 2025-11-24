const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env variables

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE; // Should be "p2_projects1"

// Headers for HubSpot API calls
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// TODO: ROUTE 1 - Homepage to list all custom objects
app.get('/', async (req, res) => {
    // FIX: API requests MUST use the lowercase internal property names (name, author, summary)
    const url = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,author,summary`;
    
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        
        // Pass the data to the homepage template
        res.render('homepage', { title: 'Homepage | HubSpot Practicum', data });
        
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        // If error, render homepage with empty data to prevent crash
        res.render('homepage', { title: 'Homepage | HubSpot Practicum', data: [] });
    }
});

// TODO: ROUTE 2 - Form to create a new custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | HubSpot Practicum' });
});

// TODO: ROUTE 3 - Handle form POST to create a new custom object
app.post('/update-cobj', async (req, res) => {
    const { name, author, summary } = req.body;
    
    const newObject = {
        properties: {
            // FIX: Payload property keys MUST be the lowercase internal names
            "name": name,
            "author": author,
            "summary": summary
        }
    };
    
    const url = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    
    try {
        await axios.post(url, newObject, { headers });
        // Redirect to homepage to see the new record
        res.redirect('/');
        
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating record');
    }
});

// * Localhost server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
