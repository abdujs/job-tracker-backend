import prisma from "../config/database";
import { Request, Response } from "express";


/**
 * Create a new job entry for the authenticated user.
 *
 * @route POST /jobs
 * @param req - Express request object containing job details in the body.
 * @param res - Express response object used to send the created job or error response.
 * @returns {Object} The created job object on success, or an error message on failure.
 *
 * @remarks
 * - Requires authentication (JWT).
 * - Links the job to the authenticated user via userId.
 */
export const createJob = async (req: Request, res: Response) => {
    try {
        const { title, description, company, status } = req.body;
        const userId = (req as any).user.id;
        const newJob = await prisma.job.create({
            data: { title, description, company, status, userId }
        });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create job', details: error });
   } 
}

/**
 * Retrieve all jobs belonging to the authenticated user.
 *
 * @route GET /jobs
 * @param req - Express request object (userId extracted from auth middleware).
 * @param res - Express response object used to send the list of jobs or error response.
 * @returns {Array} List of jobs for the user, or an error message on failure.
 *
 * @remarks
 * - Requires authentication (JWT).
 * - Only returns jobs owned by the authenticated user.
 */
export const getJobs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const jobs = await prisma.job.findMany({ where: { userId } });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch jobs', details: error });
    }
}


// Get a single job by ID (only if it belongs to the user)
/**
 * Retrieve a single job by ID, only if it belongs to the authenticated user.
 *
 * @route GET /jobs/:id
 * @param req - Express request object containing job ID in params.
 * @param res - Express response object used to send the job or error response.
 * @returns {Object} The job object if found, or an error message if not found or unauthorized.
 *
 * @remarks
 * - Requires authentication (JWT).
 * - Returns 404 if the job does not exist or does not belong to the user.
 */
export const getJobById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const job = await prisma.job.findFirst({ where: { id, userId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job', details: error });
    }
};

// Update a job (only if it belongs to the user)
/**
 * Update an existing job, only if it belongs to the authenticated user.
 *
 * @route PUT /jobs/:id
 * @param req - Express request object containing job ID in params and updated data in body.
 * @param res - Express response object used to send the updated job or error response.
 * @returns {Object} The updated job object if successful, or an error message if not found or unauthorized.
 *
 * @remarks
 * - Requires authentication (JWT).
 * - Returns 404 if the job does not exist or does not belong to the user.
 */
export const updateJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, company, status } = req.body;
        const userId = (req as any).user.id;
        const job = await prisma.job.findFirst({ where: { id, userId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        const updatedJob = await prisma.job.update({
            where: { id },
            data: { title, description, company, status }
        });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job', details: error });
    }
};



/**
 * Delete a job by ID, only if it belongs to the authenticated user.
 *
 * @route DELETE /jobs/:id
 * @param req - Express request object containing job ID in params.
 * @param res - Express response object used to send a success message or error response.
 * @returns {Object} Success message if deleted, or an error message if not found or unauthorized.
 *
 * @remarks
 * - Requires authentication (JWT).
 * - Returns 404 if the job does not exist or does not belong to the user.
 */
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const job = await prisma.job.findFirst({ where: { id, userId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        await prisma.job.delete({ where: { id } });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job', details: error });
    }
};