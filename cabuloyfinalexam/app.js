const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

app.post('/add', async (req, res) => {
  const { name, age, course } = req.body;
  await Student.create({ name, age, course });
  res.redirect('/');
});

app.get('/view/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('view', { student });
});

app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit', { student });
});

app.get('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
  const { name, age, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, course });
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});