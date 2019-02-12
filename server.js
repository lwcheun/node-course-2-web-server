const express = require('express');
const hbs = require('hbs');		//handlebars
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
// Templating engine: dynamically render pages -- handlebars
app.set('view engine', 'hbs');


// Middleware [app.use]

// next exists so you can tell express when your middleware function is done; async
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

// app.use((req, res, next) => {	
//   res.render('maintenance.hbs'); 
// });

app.use(express.static(__dirname + '/public'));	// Absolute path

hbs.registerHelper('getCurrentYear', () => {	// 2 arguments (name of function, and function)
  return new Date().getFullYear()
});	

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {		// 2 arguments (request, response)
  //res.send('<h1>Hello Express!</h1>');
//   res.send({
//     name: 'Leon',
//     likes: [
//       'Hiking',
//       'Outdoors'
//     ]
//   })
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my home page'
  });
});		

// localhost:3000/about
app.get('/about', (req, res) => {
  res.render('about.hbs', {	// renders a view; dynamically; injects data
    pageTitle: 'About Page'
  });
});

// localhost:3000/bad
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(3000, () => { 	// Bind app to port		2nd argument optional
  console.log('Server is up on port 3000');
});	