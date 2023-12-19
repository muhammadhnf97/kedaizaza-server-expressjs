const express = require('express');
const app = express();
const port = 3100;

const session = require('express-session')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const response = require('./lib/response');
const cors = require('cors')
require('dotenv').config()

const environment = process.env.NODE_ENV || 'development';
console.log(`Proyek berjalan dalam mode: ${environment}`);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: environment === 'production',
    maxAge: 3600000 * 17
  },
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(upload.array())

app.use(cors({
  origin: 'http://localhost:3100',
  credentials: true
}))

const validateToken = (req, res, next) => {
  const authToken = req.header('Authorization');
  console.log(req.session)
  // if (authToken !== req.session.token) {
  if (authToken !== 'temp-token') {
    return response(401, null, 'Unauthorized', res);
  };
  next();
};

const registerRoute = require('./routes/auth/register');
app.use('/auth/register', registerRoute);

const loginRoute = require('./routes/auth/login');
app.use('/auth/login', loginRoute)

const logoutRoute = require('./routes/auth/logout');
app.use('/auth/logout', logoutRoute)

const itemsRoute = require('./routes/items');
app.use('/items', validateToken, itemsRoute);

const employeesRoute = require('./routes/employees');
app.use('/employees', validateToken, employeesRoute);

const supplierRoute = require('./routes/supplier');
app.use('/supplier', validateToken, supplierRoute);

const satuanRoute = require('./routes/satuan');
app.use('/satuan', validateToken, satuanRoute);

const customerRoute = require('./routes/customer');
app.use('/customers', validateToken, customerRoute);

const categoriesRoute = require('./routes/categories');
app.use('/categories', validateToken, categoriesRoute);

const purchasesRoute = require('./routes/purchases');
app.use('/purchases', validateToken, purchasesRoute);

const purchaseDetailsRoute = require('./routes/purchases/details');
app.use('/purchases/details', validateToken, purchaseDetailsRoute);

const salesRoute = require('./routes/sales');
app.use('/sales', validateToken, salesRoute);

const saleDetailsRoute = require('./routes/sales/details');
app.use('/sales/details', validateToken, saleDetailsRoute);

const debtsRoute = require('./routes/debts');
app.use('/debts', validateToken, debtsRoute);

const searchRoute = require('./routes/search');
app.use('/search', validateToken, searchRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});