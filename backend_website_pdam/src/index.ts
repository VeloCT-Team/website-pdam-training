import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import pendaftaranRoutes from './routes/pendaftaran.routes';
import pengaduanRoutes from './routes/pengaduan.routes';
import cekTagihanRoutes from './routes/cekTagihan.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/cek-tagihan', cekTagihanRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'PDAM API Server is running',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check at http://localhost:${PORT}/\n`);
});

export default app;
