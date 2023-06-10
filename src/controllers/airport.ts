import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all airports
export const getAirports = async (req: Request, res: Response) => {
  try {
    const airports = await prisma.airport.findMany();
    res.json(airports);
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
    res.status(201).json(airport);
  } catch (error) {
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
