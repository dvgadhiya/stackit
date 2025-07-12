import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, Star, Tag, Plus } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:3000/api/question";

const popularTags = [
  { name: "react", count: 1543 },
  { name: "javascript", count: 2156 },
  { name: "typescript", count: 987 },
  { name: "node.js", count: 743 },
  { name: "python", count: 1234 },
  { name: "css", count: 654 },
  { name: "html", count: 543 },
  { name: "api", count: 432 }
];


const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("newest");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        setQuestions(res.data.questions || res.data || []);
      } catch (err) {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const loadMoreQuestions = async () => {
    // Optionally implement pagination here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Top Questions</h1>
            <Button asChild>
              <Link to="/ask" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Ask Question</span>
              </Link>
            </Button>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="newest" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Newest</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Unanswered</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="newest" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions found.</div>
              ) : (
                questions.map((question: any) => (
                  <QuestionCard key={question.id || question._id} question={question} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions found.</div>
              ) : (
                [...questions]
                  .sort((a: any, b: any) => (b.votes + b.views) - (a.votes + a.views))
                  .map((question: any) => (
                    <QuestionCard key={question.id || question._id} question={question} />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="unanswered" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions found.</div>
              ) : (
                questions
                  .filter((q: any) => q.answers === 0)
                  .map((question: any) => (
                    <QuestionCard key={question.id || question._id} question={question} />
                  ))
              )}
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={loadMoreQuestions} 
              disabled={loading}
              variant="outline"
              size="lg"
            >
              {loading ? "Loading..." : "Load More Questions"}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Popular Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.name}
                    to={`/tags/${tag.name}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                  >
                    <Badge variant="secondary">{tag.name}</Badge>
                    <span className="text-sm text-muted-foreground">{tag.count}</span>
                  </Link>
                ))}
                <Link 
                  to="/tags" 
                  className="block text-sm text-primary hover:underline mt-4"
                >
                  View all tags →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions</span>
                  <span className="font-semibold">12,543</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Answers</span>
                  <span className="font-semibold">23,167</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Users</span>
                  <span className="font-semibold">4,892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <span className="font-semibold">1,234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;