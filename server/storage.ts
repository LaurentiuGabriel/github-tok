import { repositories, type Repository, type InsertRepo } from "@shared/schema";
import type { GitHubRepo } from "@shared/schema";
import axios from "axios";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface IStorage {
  getRandomRepos(count: number): Promise<Repository[]>;
  cacheRepo(repo: GitHubRepo): Promise<Repository>;
}

export class MemStorage implements IStorage {
  private repos: Map<number, Repository & { cachedAt: number }>;

  constructor() {
    this.repos = new Map();
  }

  private isStale(cachedAt: number): boolean {
    return Date.now() - cachedAt > CACHE_DURATION;
  }

  async getRandomRepos(count: number): Promise<Repository[]> {
    const validRepos = Array.from(this.repos.values())
      .filter(repo => !this.isStale(repo.cachedAt));
    
    if (validRepos.length < count) {
      // Not enough repos in cache, fetch from GitHub
      const newRepos = await this.fetchFromGitHub(count * 2); // Fetch extra to have variety
      for (const repo of newRepos) {
        await this.cacheRepo(repo);
      }
      return this.getRandomRepos(count); // Retry with newly cached repos
    }

    // Randomly select repos
    return validRepos
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(({ cachedAt, ...repo }) => repo);
  }

  async cacheRepo(githubRepo: GitHubRepo): Promise<Repository> {
    const repo: Repository & { cachedAt: number } = {
      id: this.repos.size + 1,
      githubId: githubRepo.id,
      name: githubRepo.name,
      fullName: githubRepo.full_name,
      description: githubRepo.description || "",
      stars: githubRepo.stargazers_count,
      language: githubRepo.language || "",
      url: githubRepo.html_url,
      owner: githubRepo.owner,
      cachedAt: Date.now()
    };

    this.repos.set(repo.id, repo);
    return repo;
  }

  private async fetchFromGitHub(count: number): Promise<GitHubRepo[]> {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=${count}&page=${Math.floor(Math.random() * 10)}`
      );
      return response.data.items;
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return [];
    }
  }
}

export const storage = new MemStorage();
