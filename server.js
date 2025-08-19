// //|| 'mongodb://localhost:27017/image-quiz',

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://image-quiz-app-main.vercel.app",
      "https://image-quiz-app-main-4143nguco-hosam-abdullahs-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// MongoDB connection with error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Schemas & Models
const imageSchema = new mongoose.Schema({
  imagePath: String,
  isCorrect: Boolean,
  createdAt: { type: Date, default: Date.now },
});
const Image = mongoose.model("Image", imageSchema);

const quizProgressSchema = new mongoose.Schema({
  shownImageIds: [String],
});
const QuizProgress = mongoose.model("QuizProgress", quizProgressSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password!
});

const User = mongoose.model("User", userSchema);

// Routes
// app.post("/api/upload", upload.single("image"), async (req, res) => {
//   try {
//     const { isCorrect } = req.body;
//     const newImage = new Image({
//       imagePath: req.file.path,
//       isCorrect: isCorrect === "true",
//     });
//     await newImage.save();
//     res.json({ success: true, image: newImage });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const newImage = new Image({
      imagePath: imageUrl,
      isCorrect: isCorrect === "true",
    });

    await newImage.save();
    res.json({ success: true, image: newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/quiz-pair", async (req, res) => {
  try {
    const allImages = await Image.find().sort({ createdAt: 1 });
    const correctImages = allImages.filter((img) => img.isCorrect);
    const incorrectImages = allImages.filter((img) => !img.isCorrect);
    const totalPairs = Math.min(correctImages.length, incorrectImages.length);

    let quizProgress = await QuizProgress.findOne();
    if (!quizProgress) quizProgress = new QuizProgress({ shownImageIds: [] });

    if (quizProgress.shownImageIds.length >= totalPairs * 2) {
      quizProgress.shownImageIds = [];
    }

    const availableImages = allImages.filter(
      (img) => !quizProgress.shownImageIds.includes(img._id.toString())
    );
    const availableCorrect = availableImages.filter((img) => img.isCorrect);
    const availableIncorrect = availableImages.filter((img) => !img.isCorrect);

    if (availableCorrect.length === 0 || availableIncorrect.length === 0) {
      if (totalPairs > 0) {
        quizProgress.shownImageIds = [];
        await quizProgress.save();
        return res.json({ reset: true });
      }
      return res.status(400).json({
        error:
          "Not enough images. Please upload at least one correct and one incorrect image.",
      });
    }

    const correctImage = availableCorrect[0];
    const incorrectImage = availableIncorrect[0];

    quizProgress.shownImageIds.push(correctImage._id.toString());
    quizProgress.shownImageIds.push(incorrectImage._id.toString());
    await quizProgress.save();

    const remainingPairs = totalPairs - quizProgress.shownImageIds.length / 2;

    res.json({
      images: [correctImage, incorrectImage],
      correctImageId: correctImage._id,
      totalPairs,
      remainingPairs,
      currentPair: quizProgress.shownImageIds.length / 2,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ success: true });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  // Create JWT token
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to protect admin routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Example: Protect admin image routes
app.get("/api/admin/images", authMiddleware, async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/images/:id", authMiddleware, async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { isCorrect: isCorrect === "true" || isCorrect === true },
      { new: true }
    );
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/images/:id", authMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    const filePath = image.imagePath.replace(
      `${req.protocol}://${req.get("host")}/`,
      ""
    );
    fs.unlink(filePath, async (err) => {
      if (err) console.error("Error deleting image file:", err);
      await Image.findByIdAndDelete(req.params.id);
      await QuizProgress.deleteMany({});
      res.json({ message: "Image deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API is running..."));
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Initial admin user setup
async function createAdminUser() {
  const adminExists = await User.findOne({ username: "admin" });
  if (adminExists) return;

  const hashedPassword = await bcrypt.hash("Admin@quiz99", 10);
  const adminUser = new User({
    username: "admin",
    password: hashedPassword,
  });
  await adminUser.save();
  console.log("✅ Admin user created");
}

// Uncomment to run once
// createAdminUser();
