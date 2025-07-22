import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import crewRouter from './routes/crewRouter.js';
import movieRouter from './routes/movieRouter.js';
import userRouter from './routes/userRouter.js';
import movieFormRouter from './routes/movieForm.js';
import { initializeStorage } from './config/supabaseConfig.js';
import clipRouter from './routes/clipsRoutes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/movies', movieRouter);
app.use('/api/crew', crewRouter);
app.use('/api/users', userRouter);
app.use('/api/movie-form', movieFormRouter);
app.use('/api/clips', clipRouter);

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//         message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//     });
// });

// 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Route not found'
//     });
// });

// Initialize storage and start server
const startServer = async () => {
    try {
        // Initialize Supabase storage
        await initializeStorage();
        console.log('✅ Storage initialized successfully');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();