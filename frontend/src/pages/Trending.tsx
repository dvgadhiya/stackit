import { useState } from "react";
import { TrendingUp, Clock, Filter } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock trending questions
const mockTrendingQuestions = [
  {
    id: "1",
    title: "How to implement useEffect cleanup in React?",
    content: "I'm working on a React component that fetches data, but I'm getting memory leaks when the component unmounts.",
    author: { name: "DevCoder", reputation: 1543 },
    tags: ["react", "javascript", "hooks"],
    votes: 25,
    answers: 8,
    views: 892,
    createdAt: "2024-01-15T10:30:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "2",
    title: "Best practices for TypeScript in large codebases",
    content: "Our team is migrating a large JavaScript project to TypeScript. What are the recommended patterns and practices?",
    author: { name: "ArchitectPro", reputation: 3421 },
    tags: ["typescript", "architecture", "best-practices"],
    votes: 34,
    answers: 12,
    views: 1256,
    createdAt: "2024-01-14T15:20:00Z",
    hasAcceptedAnswer: true
  },
  {
    id: "3",
    title: "Node.js performance optimization techniques",
    content: "My Node.js API is experiencing slow response times. What are the most effective optimization strategies?",
    author: { name: "BackendGuru", reputation: 2876 },
    tags: ["node.js", "performance", "optimization"],
    votes: 28,
    answers: 6,
    views: 743,
    createdAt: "2024-01-14T12:45:00Z"
  }
];

const Trending = () => {
  const [questions, setQuestions] = useState(mockTrendingQuestions);
  const [timeFilter, setTimeFilter] = useState("week");
  const [loading, setLoading] = useState(false);

  const loadMoreQuestions = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newQuestions = [
        {
          id: "4",
          title: "Modern CSS Grid vs Flexbox: When to use what?",
          content: "I'm confused about when to use CSS Grid versus Flexbox for layouts. Can someone explain the differences and use cases?",
          author: { name: "CSSMaster", reputation: 1654 },
          tags: ["css", "grid", "flexbox", "layout"],
          votes: 19,
          answers: 4,
          views: 567,
          createdAt: "2024-01-13T09:30:00Z"
        }
      ];
      setQuestions(prev => [...prev, ...newQuestions]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span>Trending Questions</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Hot topics and popular discussions in the community
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Trending Algorithm Info */}
          <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Trending Algorithm</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Questions are ranked based on recent activity, votes, views, and community engagement.
                    Fresh content with high interaction gets priority.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="relative">
                {/* Trending Badge */}
                <div className="absolute -left-2 top-6 z-10">
                  <div className="bg-gradient-to-r from-primary to-accent text-white text-xs px-2 py-1 rounded-r-md font-semibold">
                    #{index + 1}
                  </div>
                </div>
                <QuestionCard question={question} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={loadMoreQuestions} 
              disabled={loading}
              variant="outline"
              size="lg"
            >
              {loading ? "Loading..." : "Load More Trending"}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Trending Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hot Questions</span>
                  <span className="font-semibold">143</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rising Topics</span>
                  <span className="font-semibold">27</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-semibold">1,832</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hot Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Hot Topics Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["React 18 Features", "TypeScript 5.0", "Node.js Security", "CSS Container Queries", "Next.js 14"].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors">
                    <span className="text-sm">{topic}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Digest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Weekly Digest</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Get the week's top questions and discussions delivered to your inbox.
              </p>
              <Button size="sm" className="w-full">
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trending;