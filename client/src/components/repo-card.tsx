import { type Repository } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, GitFork, Code } from "lucide-react";
import { motion } from "framer-motion";

interface RepoCardProps {
  repo: Repository;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={repo.owner.avatar_url} alt={repo.owner.login} />
            <AvatarFallback>{repo.owner.login[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{repo.name}</h2>
            <p className="text-sm text-muted-foreground">{repo.owner.login}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {repo.description || "No description provided"}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between bg-muted/50 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="text-sm">{repo.stars.toLocaleString()}</span>
            </div>
            {repo.language && (
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span className="text-sm">{repo.language}</span>
              </div>
            )}
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View Repository
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
