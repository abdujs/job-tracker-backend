import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import prisma from '../config/database.js';


/**
 * Creates a new user in the database.
 *
 * @param req - Express request object containing user details in the body (email, password, and optional name).
 * @param res - Express response object used to send the created user or error response.
 * @returns A JSON response with the created user object on success, or an error message on failure.
 *
 * @remarks
 * - Requires `email` and `password` fields in the request body.
 * - Password is hashed before storing in the database.
 * - Responds with HTTP 201 on success, 400 if required fields are missing, or 500 on server error.
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error });
  }
};

/**
 * Retrieve a list of all users from the database.
 * @route GET /users
 * @param req - Express request object
 * @param res - Express response object
 * @returns {Array} List of users or an error message
 */
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error });
  }
};

/**
 * Update an existing user's information.
 * @route PUT /users/:id
 * @param req - Express request object containing user ID in req.params and updated data in req.body
 * @param res - Express response object
 * @returns {Object} The updated user or an error message
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error });
  }
};


/**
 * Delete a user from the database.
 * @route DELETE /users/:id
 * @param req - Express request object containing user ID in req.params
 * @param res - Express response object
 * @returns {Object} Success message or an error message
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error });
  }
};

/**
 * Authenticates a user with the provided email and password.
 *
 * @param req - Express request object containing `email` and `password` in the body.
 * @param res - Express response object used to send the authentication result.
 * @returns Returns a JSON response with a JWT token if authentication is successful,
 * or an error message if credentials are invalid or an error occurs.
 *
 * @throws 401 - If the credentials are invalid.
 * @throws 500 - If an internal server error occurs during authentication.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login', details: error });
  }
};