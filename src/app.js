const express = require('express');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const port = process.env.PORT || 3000;
const app = express();

// Define paths for Express config - Absolute paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));


app.use((req, res, next) => {	
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  });
  next();  
});


hbs.registerHelper('getCurrentYear', () => {	// 2 arguments (name of function, and function)
  return new Date().getFullYear()
});	

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {		// 2 arguments (request, response)
  res.render('index', {
    pageTitle: 'Weather App',
    welcomeMessage: 'Welcome to my home page'
  });
});	

app.get('/about', (req, res) => {
  res.render('about', {	// renders a view; dynamically; injects data
    pageTitle: 'About Me'
  });
});

app.get('/home', (req, res) => {		// 2 arguments (request, response)
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    message: 'Welcome to my home page.'
  });
});		

app.get('/help', (req, res) => {
  res.render('help', {
    pageTitle: 'Help',
    message: 'This is the help page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  //console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('error', {
    pageTitle: 'Error Page',
    message: 'Help article not found.'
  });
});

app.get('*', (req, res) => {
  res.render('error', {
    pageTitle: 'Error Page',
    message: 'Page not found.'
  });
});

app.listen(port, () => { 	// Bind app to port		2nd argument optional
  console.log(`Server is up on port ${port}`);
});	