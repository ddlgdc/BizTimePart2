/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError")

const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');

app.use(express.json());

app.use('/companies', companiesRoutes);
app.use('/invoices', invoicesRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});

module.exports = app;