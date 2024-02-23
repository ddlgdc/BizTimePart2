const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: result.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const companyResult = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
  
      if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      const company = companyResult.rows[0];
      const invoicesResult = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
      const invoices = invoicesResult.rows.map(row => row.id);
  
      return res.json({
        company: {
          ...company,
          invoices: invoices
        }
      });
    } catch (err) {
      return next(err);
    }
  });

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        const newCompany = result.rows[0];

        return res.status(201).json({ company: newCompany });
    }
    catch (err) {
        return next(err);
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const checkCompany = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (checkCompany.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const result = await db.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *', [name, description, code]);
        const updatedCompany = result.rows[0];

        return res.json({ company: updatedCompany });
    }
    catch (err) {
        return next(err);
    }
});

router.delete('/:code', async (req, res, next ) => {
    try {
        const { code } = req.params;
        const checkCompany = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (checkCompany.rows.length === 0){
            return res.status(404).json({ error: 'Company not found'});
        }

        await db.query('DELETE FROM companies WHERE code = $1', [code]);

        return res.json({ status: 'deleted' });
    }
    catch (err) {
        return next(err);
    }
});


module.exports = router;