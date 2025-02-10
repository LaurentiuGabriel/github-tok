import { useQuery } from "@tanstack/react-query";
import { type Repository } from "@shared/schema";
import RepoCard from "@/components/repo-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { useState } from "react";

export default function Home() {
  const [repos, setRepos] = useState<Repository[]>([]);
  
  const { isLoading, error, refetch } = useQuery({
    queryKey: ["/api/repos", { count: 5 }],
    queryFn: async () => {
      const response = await fetch("/api/repos?count=5");
      if (!response.ok) throw new Error("Failed to fetch repos");
      const newRepos = await response.json();
      setRepos(prev => [...prev, ...newRepos]);
      return newRepos;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          GitHub Repo Discovery
        </h1>
        <h3 className="text-xl font-bold text-center mb-1 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Built by <a href="https://laurentiu-raducu.com/">Laurentiu Raducu</a></h3>
        
        <InfiniteScroll
          onLoadMore={() => refetch()}
          isLoading={isLoading}
          hasError={!!error}
        >
          <div className="space-y-4">
            {repos.map((repo, index) => (
              <RepoCard key={`${repo.id}-${index}`} repo={repo} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
