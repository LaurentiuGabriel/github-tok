import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// GitHub repository schema
export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  githubId: integer("github_id").notNull().unique(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  description: text("description"),
  stars: integer("stars").notNull(),
  language: text("language"),
  url: text("url").notNull(),
  owner: jsonb("owner").notNull(),
});

export const insertRepoSchema = createInsertSchema(repositories).omit({ id: true });

export type InsertRepo = z.infer<typeof insertRepoSchema>;
export type Repository = typeof repositories.$inferSelect;

// GitHub API response types
export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
};
