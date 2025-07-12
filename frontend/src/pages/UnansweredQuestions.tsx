import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionCard from "@/components/QuestionCard";

import axios from "axios";

interface UnansweredQuestion {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    reputation?: number;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  bounty?: number;
  createdAt: string;
}


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


const UnansweredQuestions = () => {
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnanswered = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/questions/unanswered`, { withCredentials: true });
        setQuestions(res.data.questions || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load unanswered questions");
      } finally {
        setLoading(false);
      }
    };
    fetchUnanswered();
  }, []);

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...questions].sort((a, b) => {
      switch (value) {
        case 'votes':
          return b.votes - a.votes;
        case 'views':
          return b.views - a.views;
        case 'bounty':
          return (b.bounty || 0) - (a.bounty || 0);
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setQuestions(sorted);
  };

  const filteredQuestions = questions.filter(question => {
    if (filterBy === 'bounty') {
      return question.bounty && question.bounty > 0;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Unanswered Questions</h1>
              <p className="text-muted-foreground">
                Help the community by answering these {filteredQuestions.length} questions
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/ask">Ask Question</Link>
          </Button>
        </div>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="bounty">With Bounty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Newest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Oldest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="votes">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Most Votes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="bounty">Highest Bounty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{filteredQuestions.length}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {filteredQuestions.filter(q => q.bounty).length}
                </div>
                <div className="text-sm text-muted-foreground">With Bounty</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {filteredQuestions.reduce((sum, q) => sum + (q.bounty || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Bounty</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(filteredQuestions.reduce((sum, q) => sum + q.views, 0) / filteredQuestions.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Views</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Loading unanswered questions...</h3>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Error loading questions</h3>
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No unanswered questions</h3>
                  <p className="text-muted-foreground mb-4">
                    Great! It looks like all questions have been answered.
                  </p>
                  <Button asChild>
                    <Link to="/ask">Ask a Question</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question) => {
              const qid = question.id || question._id;
              return (
                <QuestionCard key={qid} question={{
                  ...question,
                  author: {
                    ...question.author,
                    reputation: question.author.reputation || 0
                  }
                }} showBounty={true} />
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredQuestions.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => {
              // In a real app, this would load more questions
              console.log('Load more questions');
            }}>
              Load More Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnansweredQuestions;