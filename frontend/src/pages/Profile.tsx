import { useState } from "react";
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

const mockUser = {
  id: '1',
  name: 'John Developer',
  username: 'john_dev',
  bio: 'Full-stack developer passionate about React, Node.js, and modern web technologies. Always learning and sharing knowledge with the community.',
  joinedDate: '2023-01-15',
  location: 'San Francisco, CA',
  website: 'https://johndev.com',
  avatar: '',
  stats: {
    questions: 24,
    answers: 156,
    reputation: 2847,
    views: 45200,
    upvotes: 312,
    downvotes: 8
  } as UserStats,
  badges: [
    { name: 'Helpful', description: 'Provided many helpful answers', color: 'bg-blue-500' },
    { name: 'Expert', description: 'Highly knowledgeable in multiple areas', color: 'bg-purple-500' },
    { name: 'Teacher', description: 'Great at explaining complex concepts', color: 'bg-green-500' }
  ],
  topTags: [
    { name: 'react', count: 45 },
    { name: 'javascript', count: 38 },
    { name: 'typescript', count: 29 },
    { name: 'node.js', count: 22 },
    { name: 'css', count: 18 }
  ]
};

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to optimize React component re-renders?',
    content: 'I have a complex React application with many components...',
    tags: ['react', 'performance', 'optimization'],
    votes: 12,
    answers: 5,
    views: 2341,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Best practices for TypeScript interfaces vs types?',
    content: 'What are the key differences and when should I use each?',
    tags: ['typescript', 'interfaces', 'types'],
    votes: 8,
    answers: 3,
    views: 1876,
    createdAt: '2024-01-10'
  }
];

const mockAnswers: Answer[] = [
  {
    id: '1',
    questionTitle: 'How to handle async operations in Redux?',
    questionId: '123',
    content: 'You can use Redux Toolkit with createAsyncThunk for handling async operations...',
    votes: 25,
    accepted: true,
    createdAt: '2024-01-14'
  },
  {
    id: '2',
    questionTitle: 'What is the difference between useMemo and useCallback?',
    questionId: '456',
    content: 'useMemo is for memoizing values, while useCallback is for memoizing functions...',
    votes: 18,
    accepted: false,
    createdAt: '2024-01-12'
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{mockUser.name}</h1>
                    <p className="text-lg text-muted-foreground">@{mockUser.username}</p>
                  </div>
                  <Button asChild>
                    <Link to="/settings">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {mockUser.bio}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(mockUser.joinedDate).toLocaleDateString()}</span>
                  </div>
                  {mockUser.location && (
                    <div className="flex items-center space-x-1">
                      <span>📍 {mockUser.location}</span>
                    </div>
                  )}
                  {mockUser.website && (
                    <a href={mockUser.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{mockUser.stats.reputation}</div>
                    <div className="text-sm text-muted-foreground">Reputation</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUser.stats.questions}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUser.stats.answers}</div>
                    <div className="text-sm text-muted-foreground">Answers</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockUser.stats.views.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{mockUser.stats.upvotes}</div>
                    <div className="text-sm text-muted-foreground">Upvotes</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{mockUser.stats.downvotes}</div>
                    <div className="text-sm text-muted-foreground">Downvotes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <ThumbsUp className="w-4 h-4 text-success" />
                        <span className="text-sm">Received 5 upvotes on your answer about React hooks</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm">Asked a new question about TypeScript generics</span>
                        <span className="text-xs text-muted-foreground">1 day ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Earned the "Helpful" badge</span>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-4">
                {mockQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="pt-4">
                      <Link to={`/questions/${question.id}`} className="block hover:opacity-80">
                        <h3 className="font-semibold mb-2 text-primary hover:underline">
                          {question.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {question.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.votes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.answers}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="answers" className="space-y-4">
                {mockAnswers.map((answer) => (
                  <Card key={answer.id}>
                    <CardContent className="pt-4">
                      <Link to={`/questions/${answer.questionId}`} className="block hover:opacity-80">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-primary hover:underline">
                            {answer.questionTitle}
                          </h3>
                          {answer.accepted && (
                            <Badge className="bg-success text-success-foreground">
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {answer.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{answer.votes}</span>
                          </div>
                          <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUser.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${badge.color}`} />
                      <div>
                        <div className="font-semibold text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockUser.topTags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge variant="outline">{tag.name}</Badge>
                      <span className="text-sm text-muted-foreground">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;