import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";
import { jobSchema } from '../validation/jobSchema.js';
import { validateZod } from '../middleware/validateZod.js';

const router = Router();

// Apply auth middleware to all job routes
router.use(authMiddleware);

router.post('/jobs', validateZod(jobSchema), createJob);
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', validateZod(jobSchema), updateJob);
router.delete('/jobs/:id', deleteJob);

export default router;