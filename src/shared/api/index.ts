/**
 * API Module
 * Main entry point for all API services, types, and utilities
 * 
 * Note: Interceptors should be imported directly:
 * - Client: from "@/shared/api/interceptors/auth-interceptor.client"
 * - Server: from "@/shared/api/interceptors/auth-interceptor.server"
 */

export * from "./client";
export * from "./services";
export * from "./types";
// Interceptors are not exported here to avoid bundling issues
// Import them directly from their respective files
