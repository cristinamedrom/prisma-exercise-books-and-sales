const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const sales = await prisma.venta.findMany();
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    const saleId = parseInt(req.params.id);
    try {
        const sale = await prisma.venta.findUnique({
            where: { ID_Venta: saleId },
        });
        res.json(sale);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/book/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const salesByBook = await prisma.venta.findMany({
            where: { ISBN: isbn },
        });
        res.json(salesByBook);
    } catch (error) {
        console.error('Error fetching sales by book:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/date/:date', async (req, res) => {
    const saleDate = new Date(req.params.date);
    try {
        const salesByDate = await prisma.venta.findMany({
            where: { Fecha_Venta: saleDate },
        });
        res.json(salesByDate);
    } catch (error) {
        console.error('Error fetching sales by date:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/top', async (req, res) => {
    try {
        const topBook = await prisma.venta.groupBy({
            by: ['ISBN'],
            _sum: { Cantidad: true },
            orderBy: { _sum: { Cantidad: 'desc' } },
            take: 1,
        });
        const topBookISBN = topBook[0].ISBN;

        const bookWithSales = await prisma.libro.findUnique({
            where: { ISBN: topBookISBN },
            include: { Ventas: true },
        });
        res.json(bookWithSales);
    } catch (error) {
        console.error('Error fetching top book with sales:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
