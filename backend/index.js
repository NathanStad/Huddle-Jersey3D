const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jerseys",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => file.originalname.split('.')[0], // nom sans extension
  },
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());

// ➕ Créer un jersey avec upload vers Cloudinary
app.post("/jerseys", upload.single("file"), async (req, res) => {
  try {
    const { color } = req.body;
    const file = req.file;

    if (!file || !file.path) {
      return res.status(400).json({ error: "Fichier requis" });
    }

    const jersey = await prisma.jersey.create({
      data: {
        color,
        drawingFile: file.path, // lien complet Cloudinary
      },
    });

    res.status(201).json(jersey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➕ Créer un client
app.post("/clients", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      street,
      postalCode,
      city,
      country,
      supportCoach,
      jerseyId,
    } = req.body;

    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      street,
      postalCode,
      city,
      country,
      supportCoach,
    };

    if (jerseyId) {
      data.jersey = {
        connect: { id: jerseyId },
      };
    }

    const client = await prisma.client.create({ data });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📥 Récupérer les clients
app.get("/clients", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { jersey: true },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Récupérer les maillots
app.get("/jerseys", async (req, res) => {
  try {
    const jerseys = await prisma.jersey.findMany({
      include: { client: true },
    });
    res.json(jerseys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Supprimer un client
app.delete("/clients/:id", async (req, res) => {
  const clientId = parseInt(req.params.id);

  try {
    await prisma.client.delete({
      where: { id: clientId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Impossible de supprimer le client" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
});
