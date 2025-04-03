const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // accès aux fichiers

// Config multer (dossier et nom du fichier)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // dossier local
  },
  filename: function (req, file, cb) {
    const uniqueName = file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ➕ Créer un jersey avec upload de fichier
app.post("/jerseys", upload.single("file"), async (req, res) => {
  try {
    const { color } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Fichier requis" });
    }

    const jersey = await prisma.jersey.create({
      data: {
        color,
        drawingFile: file.filename, // On stocke le nom du fichier
      },
    });

    res.status(201).json(jersey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// ➕ Créer un client et lier à un jersey existant (si fourni)
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
      jerseyId, // optionnel
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

// 📥 Récupérer tous les clients (avec leur jersey s'il existe)
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

// ➕ Autres routes (clients, get jerseys, etc.)
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

// ❌ Supprimer un client par son ID
app.delete('/clients/:id', async (req, res) => {
  const clientId = parseInt(req.params.id)

  try {
    await prisma.client.delete({
      where: { id: clientId },
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression :", error)
    res.status(500).json({ error: "Impossible de supprimer le client" })
  }
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
});
