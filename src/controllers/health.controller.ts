import type { Request, Response } from "express";
import { sequelize } from "../config/db.ts";
import { tenantConnections } from "../config/tenantManager.ts";

export const getHealth = async (req: Request, res: Response) => {
  try {
    const buildInfo = {
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };

    const tenantStats = Object.keys(tenantConnections).map((orgId) => {
      const tenantDb = tenantConnections[orgId];
      return {
        orgId,
        connected: tenantDb ? true : false,
      };
    });

    res.json({
      status: "ok",
      buildInfo,
      tenants: tenantStats,
      sharedDbConnected: true, 
    });
  } catch (err) {
    console.error("health check error:", err);
    res.status(500).json({ status: "error" });
  }
};
