import { Request, Response } from 'express';
import prisma from '../../prisma/client';

// Create a new mission
export const createMission = async (req: Request, res: Response) => {
  try {
    const { name, description, launchDate, status, aircraftId } = req.body;
    const mission = await prisma.mission.create({
      data: {
        name,
        description,
        launchDate,
        status,
        aircraftId,
      },
    });
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create mission' });
  }
};

// Get all missions with pagination
export const getMissions = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const missions = await prisma.mission.findMany({
      skip: skip,
      take: pageSize,
    });

    const totalMissions = await prisma.mission.count();
    const totalPages = Math.ceil(totalMissions / pageSize);

    res.status(200).json({
      data: missions,
      meta: {
        totalItems: totalMissions,
        currentPage: page,
        totalPages: totalPages,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve missions' });
  }
};

// Get a single mission by ID
export const getMissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await prisma.mission.findUnique({
      where: { id },
    });
    if (mission) {
      res.status(200).json(mission);
    } else {
      res.status(404).json({ error: 'Mission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve mission' });
  }
};

// Update a mission by ID
export const updateMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, launchDate, status, aircraftId } = req.body;
    const mission = await prisma.mission.update({
      where: { id },
      data: {
        name,
        description,
        launchDate,
        status,
        aircraftId,
      },
    });
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mission' });
  }
};

// Delete a mission by ID
export const deleteMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.mission.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mission' });
  }
};
