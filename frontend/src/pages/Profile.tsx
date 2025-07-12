import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Calendar, Award, TrendingUp, Eye, ThumbsUp, MessageCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserStats {
  questions: number;
  answers: number;
  reputation: number;
  views: number;
  upvotes: number;
  downvotes: number;
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
}

interface Answer {
  id: string;
  questionTitle: string;
  questionId: string;
  content: string;
  votes: number;
  accepted: boolean;
  createdAt: string;
}



const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const [qRes, aRes] = await Promise.all([
          axios.get(`${apiUrl}/questions/my`, { withCredentials: true }),
          axios.get(`${apiUrl}/answers/my`, { withCredentials: true })
        ]);
        setQuestions(qRes.data || []);
        setAnswers(aRes.data || []);
      } catch (err) {
        setQuestions([]);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Not signed in.</div>;
  }

  // Calculate stats
  const stats = {
    questions: questions.length,
    answers: answers.length,
    upvotes: questions.reduce((sum, q) => sum + (q.votes || 0), 0),
    downvotes: 0 // Not tracked in current model
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" alt={user.username} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <p className="text-lg text-muted-foreground">{user.email}</p>
                  </div>
                  <Button asChild>
                    <Link to="/settings">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
                
                {/* Removed bio, joined date, city/location, and website icon as requested */}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {/* Removed Reputation card */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.questions}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.answers}</div>
                    <div className="text-sm text-muted-foreground">Answers</div>
                  </div>
                </CardContent>
              </Card>
              {/* Removed Views card */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{stats.upvotes}</div>
                    <div className="text-sm text-muted-foreground">Upvotes</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{stats.downvotes}</div>
                    <div className="text-sm text-muted-foreground">Downvotes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No questions to display.</div>
                ) : (
                  questions.map((question) => (
                    <Card key={question.id}>
                      <CardContent className="pt-4">
                        <Link to={`/questions/${question.id}`} className="block hover:opacity-80">
                          <h3 className="font-semibold mb-2 text-primary hover:underline">
                            {question.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {question.content || ''}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {question.tags && question.tags.map((tag, idx) => (
                              <Badge key={typeof tag === 'string' ? tag : (tag as any)._id || idx} variant="secondary">
                                {typeof tag === 'string' ? tag : (tag as any).name}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{question.votes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{question.answers || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{question.views || 0}</span>
                            </div>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="answers" className="space-y-4">
                {answers.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No answers to display.</div>
                ) : (
                  answers.map((answer) => (
                    <Card key={answer.id}>
                      <CardContent className="pt-4">
                        <Link to={`/questions/${answer.questionId}`} className="block hover:opacity-80">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-primary hover:underline">
                              {answer.questionTitle}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {answer.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar removed: Badges and Top Tags */}
        </div>
      </div>
    </div>
  );
};

export default Profile;