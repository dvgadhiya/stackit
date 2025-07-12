import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, Eye, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

interface Question {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  author: {
    name?: string;
    username?: string;
    avatar?: string;
    reputation?: number;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
  hasAcceptedAnswer?: boolean;
}

interface QuestionCardProps {
  question: Question & { bounty?: number };
  showVoting?: boolean;
  showBounty?: boolean;
}

const QuestionCard = ({ question, showVoting = true, showBounty = false }: QuestionCardProps) => {
  const [votes, setVotes] = useState(question.votes);
  const [voting, setVoting] = useState(false);

  const timeAgo = (date: string) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - questionDate.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const handleVote = async (type: "up" | "down") => {
    if (voting) return;
    setVoting(true);
    try {
      const res = await axios.post(`http://localhost:3000/api/question/${question.id || question._id}/vote`, {
        type
      }, { withCredentials: true });
      setVotes(res.data.votes ?? (type === "up" ? votes + 1 : votes - 1));
    } catch (err) {
      // Optionally show error toast
    } finally {
      setVoting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Voting Section */}
          {showVoting && (
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8"
                onClick={() => handleVote("up")}
                disabled={voting}
                aria-label="Upvote"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <span className={cn(
                "text-lg font-semibold",
                votes > 0 ? "text-vote-up" : votes < 0 ? "text-vote-down" : "text-muted-foreground"
              )}>
                {votes}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8"
                onClick={() => handleVote("down")}
                disabled={voting}
                aria-label="Downvote"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Stats Section */}
          <div className="flex flex-col items-center space-y-3 min-w-[80px] text-center">
            <div className="text-sm">
              <div className={cn(
                "text-lg font-semibold",
                question.hasAcceptedAnswer ? "text-success" : "text-muted-foreground"
              )}>
                {question.answers}
              </div>
              <div className="text-xs text-muted-foreground">answers</div>
            </div>
            <div className="text-sm">
              <div className="text-lg font-semibold text-muted-foreground">{question.views}</div>
              <div className="text-xs text-muted-foreground">views</div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link 
              to={`/questions/${question.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {question.title}
                </h3>
                {showBounty && question.bounty && question.bounty > 0 && (
                  <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                    +{question.bounty} bounty
                  </Badge>
                )}
              </div>
            </Link>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {question.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag: any) => {
                const tagName = typeof tag === "string" ? tag : tag?.name;
                return (
                  <Link key={tagName} to={`/tags/${tagName}`}>
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {tagName}
                    </Badge>
                  </Link>
                );
              })}
            </div>

            {/* Author and Time */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>asked {timeAgo(question.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{question.author?.name || question.author?.username || "Unknown"}</span>
                <span className="text-primary font-semibold">{question.author?.reputation ?? ""}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;