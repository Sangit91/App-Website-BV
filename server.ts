import app from "./server/app";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { errorHandler, notFoundHandler } from "./server/middleware/error.middleware";

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

// Dọn file rác còn sót trong uploads/temp (upload bị crash giữa chừng) khi khởi động.
async function cleanupOrphanTempFiles(): Promise<void> {
  try {
    const tempDir = path.join(process.cwd(), "uploads", "temp");
    const files = await fs.readdir(tempDir).catch(() => []);
    for (const file of files) {
      await fs.unlink(path.join(tempDir, file)).catch(() => {});
    }
    if (files.length > 0) {
      console.log(`[startup] Cleaned ${files.length} orphan temp upload file(s)`);
    }
  } catch (error) {
    console.error("[startup] Failed to clean orphan temp files:", error);
  }
}

const startServer = async () => {
  await cleanupOrphanTempFiles();

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

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
      try {
        const { prisma } = await import("./server/db/prisma");
        await prisma.$disconnect();
      } catch (error) {
        console.error("Error during shutdown:", error);
      }
      process.exit(0);
    });
    // Force exit nếu không đóng kịp trong 10s.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
