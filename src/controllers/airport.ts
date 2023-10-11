import { Request, Response } from 'express';
import prisma from '../../prisma/client';

// Get all airports with pagination
export const getAirports = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const [airports, totalItems] = await Promise.all([
      prisma.airport.findMany({
        skip,
        take: pageSize,
      }),
      prisma.airport.count(),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      data: airports,
      meta: {
        totalItems,
        currentPage: page,
        totalPages,
        pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve airports' });
  }
};

// Get a single airport by ID
export const getAirportById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const airport = await prisma.airport.findUnique({
      where: { id },
    });
    if (airport) {
      res.json(airport);
    } else {
      res.status(404).json({ error: 'Airport not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve airport' });
  }
};

// Create a new airport
export const createAirport = async (req: Request, res: Response) => {
  const { name, code, location, country } = req.body;
  try {
    const airport = await prisma.airport.create({
      data: { name, code, location, country },
    });
    console.log(airport)
    res.status(201).json(airport);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create airport' });
  }
};

// Update an existing airport
export const updateAirport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, code, location, country } = req.body;
  try {
    const airport = await prisma.airport.update({
      where: { id },
      data: { name, code, location, country },
    });
    res.json(airport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update airport' });
  }
};

// Delete an airport
export const deleteAirport = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.airport.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete airport' });
  }
};
