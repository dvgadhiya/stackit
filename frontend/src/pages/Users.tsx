import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users as UsersIcon, Award, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  reputation: number;
  questionsCount: number;
  answersCount: number;
  joinedDate: string;
  badges: string[];
  topTags: string[];
  location?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Developer',
    username: 'john_dev',
    avatar: '',
    bio: 'Full-stack developer passionate about React and Node.js',
    reputation: 2847,
    questionsCount: 24,
    answersCount: 156,
    joinedDate: '2023-01-15',
    badges: ['Expert', 'Helpful', 'Teacher'],
    topTags: ['react', 'javascript', 'typescript'],
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    username: 'sarah_w',
    avatar: '',
    bio: 'Frontend specialist with expertise in modern web technologies',
    reputation: 3421,
    questionsCount: 18,
    answersCount: 203,
    joinedDate: '2022-11-08',
    badges: ['Expert', 'Mentor', 'Problem Solver'],
    topTags: ['vue', 'css', 'html'],
    location: 'New York, NY'
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: 'mike_c',
    avatar: '',
    bio: 'Backend engineer focused on scalable systems and databases',
    reputation: 1892,
    questionsCount: 31,
    answersCount: 89,
    joinedDate: '2023-03-22',
    badges: ['Rising Star', 'Database Expert'],
    topTags: ['node.js', 'mongodb', 'postgresql'],
    location: 'Seattle, WA'
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    username: 'emma_r',
    avatar: '',
    bio: 'DevOps engineer and cloud architecture enthusiast',
    reputation: 2156,
    questionsCount: 15,
    answersCount: 127,
    joinedDate: '2023-02-10',
    badges: ['Cloud Expert', 'Automation Master'],
    topTags: ['aws', 'docker', 'kubernetes'],
    location: 'Austin, TX'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    username: 'alex_t',
    avatar: '',
    bio: 'Mobile app developer with React Native and Flutter experience',
    reputation: 1634,
    questionsCount: 22,
    answersCount: 76,
    joinedDate: '2023-04-18',
    badges: ['Mobile Expert', 'Cross-platform'],
    topTags: ['react-native', 'flutter', 'dart'],
    location: 'Toronto, Canada'
  },
  {
    id: '6',
    name: 'Lisa Park',
    username: 'lisa_p',
    avatar: '',
    bio: 'UI/UX developer bridging design and development',
    reputation: 2934,
    questionsCount: 19,
    answersCount: 142,
    joinedDate: '2022-12-05',
    badges: ['Design Expert', 'User Experience'],
    topTags: ['css', 'design-systems', 'accessibility'],
    location: 'Los Angeles, CA'
  }
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()) ||
      user.topTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setUsers(filtered);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...users].sort((a, b) => {
      switch (value) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'oldest':
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        case 'answers':
          return b.answersCount - a.answersCount;
        case 'questions':
          return b.questionsCount - a.questionsCount;
        default: // reputation
          return b.reputation - a.reputation;
      }
    });
    setUsers(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Discover and connect with the StackIt community
            </p>
          </div>
          <Button asChild>
            <Link to="/ask">Ask Question</Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search users by name, username, bio, or tags..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reputation">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Reputation</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="newest">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Newest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="answers">Most Answers</SelectItem>
                    <SelectItem value="questions">Most Questions</SelectItem>
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
                <div className="text-2xl font-bold text-primary">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {users.reduce((sum, user) => sum + user.answersCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Answers</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {users.reduce((sum, user) => sum + user.questionsCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(users.reduce((sum, user) => sum + user.reputation, 0) / users.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Reputation</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <Link to={`/users/${user.username}`} className="block">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-accent text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-muted-foreground">@{user.username}</p>
                        {user.location && (
                          <p className="text-sm text-muted-foreground">📍 {user.location}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {user.bio}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{user.reputation}</div>
                        <div className="text-xs text-muted-foreground">Reputation</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{user.questionsCount}</div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{user.answersCount}</div>
                        <div className="text-xs text-muted-foreground">Answers</div>
                      </div>
                    </div>

                    {/* Top Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {user.topTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Badges */}
                    {user.badges.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {user.badges.length} badge{user.badges.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {users.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" disabled={loading}>
              {loading ? 'Loading...' : 'Load More Users'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;