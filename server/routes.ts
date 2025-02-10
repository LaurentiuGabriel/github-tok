import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Get random repositories
  app.get("/api/repos", async (req, res) => {
    try {
      const count = Math.min(parseInt(req.query.count as string) || 5, 10);
      const repos = await storage.getRandomRepos(count);
      res.json(repos);
    } catch (error) {
      console.error("Error fetching repos:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
