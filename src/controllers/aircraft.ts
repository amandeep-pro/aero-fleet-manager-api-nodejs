import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all aircrafts
export const getAircrafts = async (req: Request, res: Response) => {
  try {
    const aircrafts = await prisma.aircraft.findMany();
    res.json(aircrafts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve aircrafts' });
  }
};

// Get a single aircraft by ID
export const getAircraftById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const aircraft = await prisma.aircraft.findUnique({
      where: { id },
    });
    if (aircraft) {
      res.json(aircraft);
    } else {
      res.status(404).json({ error: 'Aircraft not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve aircraft' });
  }
};

// Create a new aircraft
export const createAircraft = async (req: Request, res: Response) => {
  const { model, registration, manufacturer, capacity, status } = req.body;
  try {
    const aircraft = await prisma.aircraft.create({
      data: { model, registration, manufacturer, capacity, status },
    });
    res.status(201).json(aircraft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create aircraft' });
  }
};

// Update an existing aircraft
export const updateAircraft = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { model, registration, manufacturer, capacity, status } = req.body;
  try {
    const aircraft = await prisma.aircraft.update({
      where: { id },
      data: { model, registration, manufacturer, capacity, status },
    });
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update aircraft' });
  }
};

// Delete an aircraft
export const deleteAircraft = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.aircraft.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete aircraft' });
  }
};
