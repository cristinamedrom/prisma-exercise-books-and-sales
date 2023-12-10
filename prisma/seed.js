const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function seed() {
    try {
        const dataPath = path.join(__dirname, '..', 'data');
        const librosPath = path.join(dataPath, 'libros.csv');
        const ventasPath = path.join(dataPath, 'ventas.csv');
        


        console.log('Ruta de libros:', librosPath);
        console.log('Ruta de ventas:', ventasPath);

        const librosData = await fs.readFile(librosPath, 'utf-8');
        const ventasData = await fs.readFile(ventasPath, 'utf-8');

        const libros = librosData
            .split('\n')
            .slice(1)
            .map((line) => line.split(','))
            .map(([ISBN, Titulo, Autor, Precio]) => ({
                ISBN,
                Titulo,
                Autor,
                Precio: parseFloat(Precio),
            }));

        const ventas = ventasData
            .split('\n')
            .slice(1)
            .map((line) => line.split(','))
            .map(([ID_Venta, ISBN, Fecha_Venta, Cantidad]) => ({
                ID_Venta: parseInt(ID_Venta),
                ISBN,
                Fecha_Venta,
                Cantidad: parseInt(Cantidad),
            }));

        await prisma.libro.createMany({ data: libros });
        await prisma.venta.createMany({ data: ventas });

        console.log('Datos importados correctamente.');
    } catch (error) {
        console.error('Error al importar datos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
