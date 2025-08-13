# Image Quiz Application

A dynamic quiz application for testing image recognition skills.

## Features

- Dynamic quiz with correct/incorrect image pairs
- Real-time feedback on answers
- Results visualization with charts
- Responsive design optimized for all screens
- Admin panel for managing images
- Multi-language support (English, Arabic, Urdu)

## Prerequisites

- Node.js >= 14.0.0
- MongoDB
- npm or yarn

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/image-quiz
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Update environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   ```

2. Build the client:
   ```bash
   npm run client:build
   ```

3. For Hostinger deployment:
   - Upload the entire project to your hosting space
   - Set up MongoDB Atlas for database
   - Update the MONGODB_URI in your environment variables
   - Configure Node.js environment
   - Set up domain and SSL
   - Start the application using:
     ```bash
     npm start
     ```

## Deployment to Render.com (Free Hosting)

Follow these steps to deploy your application to Render.com:

1. Create a [Render.com](https://render.com) account

2. Set up MongoDB:
   - Create a free MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier is sufficient)
   - Create a database user and get your connection string
   - Replace the password in the connection string with your actual password

3. Deploy to Render:
   - Fork this repository to your GitHub account
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Choose a name for your service
   - Select "Node" as the Environment
   - The build and start commands are already configured in render.yaml
   - Add the following environment variable:
     - Key: `MONGODB_URI`
     - Value: Your MongoDB Atlas connection string

4. Your app will be deployed to a URL like: `https://your-app-name.onrender.com`

Note: The free tier of Render.com has some limitations:
- The service will spin down after 15 minutes of inactivity
- Limited bandwidth and compute hours
- Storage is ephemeral (uploaded files will be lost when the service restarts)

For production use, consider:
1. Using a paid tier
2. Setting up proper cloud storage for uploads (e.g., AWS S3)
3. Using a paid MongoDB Atlas tier for better performance

## Important Notes

1. Make sure the `uploads` directory exists and has write permissions
2. Configure proper security headers in production
3. Set up proper MongoDB authentication
4. Enable CORS only for your domain
5. Set up proper error logging
6. Configure automatic backups for the database

## Maintenance

- Regularly backup the MongoDB database
- Monitor server logs for errors
- Update npm packages periodically
- Check disk usage in the uploads directory

## Support

For any issues or questions, please contact the development team.
