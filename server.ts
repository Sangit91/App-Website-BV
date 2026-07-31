import app from "./server/app";
import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./server/middleware/error.middleware";

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.use(notFoundHandler);
    app.use(errorHandler);
  } else {
    const path = await import("path");
    const distPath = path.join(process.cwd(), "dist");
    // Frontend bundle served from dist/ — backend bundle lives in dist-server/ (outside static root).
    app.use(express.static(distPath, {
      index: "index.html",
      dotfiles: "ignore",
      extensions: ["html"],
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.use(notFoundHandler);
    app.use(errorHandler);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});