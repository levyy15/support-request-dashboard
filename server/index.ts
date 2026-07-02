import express from "express";
import cors from "cors";
import { prisma } from "./prisma";

const app = express();
const PORT = 4000;

const allowedStatuses = ["Open", "In Progress", "Resolved", "Closed"];

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/requests", async (req, res) => {
  try {
    if (req.query.fail === "true") {
      return res.status(500).json({ message: "Simulated API failure." });
    }

    const requests = await prisma.supportRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to load support requests." });
  }
});

app.get("/api/requests/:id", async (req, res) => {
  try {
    const request = await prisma.supportRequest.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Support request not found." });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to load support request." });
  }
});

app.patch("/api/requests/:id/status", async (req, res) => {
  try {
    const { status, role } = req.body;

    if (role !== "Editor") {
      return res.status(403).json({
        message: "Viewer mode is read-only. Switch to Editor to update status.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedRequest = await prisma.supportRequest.update({
      where: {
        id: req.params.id,
      },
      data: {
        status,
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request status." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
