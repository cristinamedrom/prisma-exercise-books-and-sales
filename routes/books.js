const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
    try {
        const libros = await prisma.libro.findMany();
        res.json(libros);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).send('Error interno del servidor');
    } finally {
        await prisma.$disconnect();
    }
});

router.get('/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await prisma.libro.findUnique({
            where: { ISBN: isbn },
        });
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await prisma.libro.findMany({
            where: { Autor: author },
        });
        res.json(booksByAuthor);
    } catch (error) {
        console.error('Error fetching books by author:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/price/:price', async (req, res) => {
    const price = parseFloat(req.params.price);
    try {
        const expensiveBooks = await prisma.libro.findMany({
            where: { Precio: { gt: price } },
        });
        res.json(expensiveBooks);
    } catch (error) {
        console.error('Error fetching expensive books:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/with-sales', async (req, res) => {
    try {
        const booksWithSales = await prisma.libro.findMany({
            include: { Ventas: true },
        });
        res.json(booksWithSales);
    } catch (error) {
        console.error('Error fetching books with sales:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
