const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const app = express();
const PORT = process.env.PORT || 5000
const State = require('./models/state')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require("path");

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`connected to mongodb ${mongoose.connection.name}`)
})

// MIDDLEWARE 
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.render("home.ejs");
});


// ROUTES // 
// I.N.D.U.C.E.S 

// ROOT/HOME
app.get('/', async (req, res) => {
    res.render('home.ejs')
})

// INDEX
app.get('/states', async (req, res) => {
    const allStates = await State.find()
    console.log(allStates)
    res.render('states/index.ejs', {
        allStates: allStates
    })
})


//NEW
app.get('/states/new', (req, res) => {
    res.render('states/new.ejs')
})

// DELETE
app.delete("/states/:stateId", async (req, res) => {
    await State.findByIdAndDelete(req.params.stateId);
    res.redirect("/states");
  });

// UPDATE
app.put('/states/:stateId', async (req, res) => {
    if (req.body.visited === 'on') {
        req.body.visited = true;
    } else {
        req.body.visited = false;
    }
    // Update the state in the database
    await State.findByIdAndUpdate(req.params.stateId, req.body);
  
    // Redirect to the state's show page to see the updates
    res.redirect(`/states/${req.params.stateId}`);
  });

// CREATE 
app.post('/states', async (req, res) => {
    if (req.body.visited === 'on') {
        req.body.visited = true;
    } else {
        req.body.visited = false;
    }
    await State.create(req.body)
    console.log(req.body)
    res.redirect('/states')
})

// EDIT
app.get("/states/:stateId/edit", async (req, res) => {
    const newState = await State.findById(req.params.stateId);
    res.render("states/edit.ejs", {
      state: newState,
    });
  });


// SHOW
app.get('/states/:stateId', async (req, res) => {
    const newState = await State.findById(req.params.stateId)
    res.render('states/show.ejs', {
        newState: newState
    })
})

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})

// GET /
app.get("/", async (req, res) => {
    res.render('index.ejs');
  });

app.get('/states/new', (req, res) => {
    res.render('states/new.ejs')
})
  