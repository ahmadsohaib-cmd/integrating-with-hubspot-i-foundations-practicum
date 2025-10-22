// index.js
const express = require('express');
const axios = require('axios');
// Require dotenv to load environment variables from .env file
require('dotenv').config(); 

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// The token is now loaded from the .env file via dotenv
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN; // Retrieves token securely

// --- PLACEHOLDER API DEFINITIONS ---
const CUSTOM_OBJECT_ID = 'pets'; // Singular API name of your custom object
const PROPERTIES_TO_RETRIEVE = 'name,species,favorite_toy'; // Custom properties to display
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects';
// ------------------------------------


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const listUrl = `${HUBSPOT_API_URL}/${CUSTOM_OBJECT_ID}?properties=${PROPERTIES_TO_RETRIEVE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(listUrl, { headers });
        const records = response.data.results;
        
        // Renders the 'homepage.pug' template
        res.render('homepage', { 
            title: 'Custom Objects | Integrating With HubSpot I Practicum', 
            records 
        });

    } catch (e) {
        console.error(e.response ? e.response.data : e);
        // Render with an empty array on error for a graceful failure
        res.render('homepage', { title: 'Custom Objects | Integrating With HubSpot I Practicum', records: [] });
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    try {
        // Renders the 'updates.pug' template
        res.render('updates', {
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Error rendering update form.");
    }
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    // Collect the form data from the body
    const { name, species, favorite_toy } = req.body; 

    // Construct the payload for the HubSpot API call
    const createPayload = {
        properties: {
            // These must match the custom properties API names
            "name": name, 
            "species": species,
            "favorite_toy": favorite_toy 
        }
    };

    const createUrl = `${HUBSPOT_API_URL}/${CUSTOM_OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createUrl, createPayload, { headers });
        // Redirect to the homepage after successful creation
        res.redirect('/'); 
    } catch (e) {
        console.error(e.response ? e.response.data : e);
        res.status(500).send("Error creating custom object record.");
    }
});


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    // ... (Original sample code for contacts) ...
});

* * App.post sample
app.post('/update', async (req, res) => {
    // ... (Original sample code for update) ...
});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
