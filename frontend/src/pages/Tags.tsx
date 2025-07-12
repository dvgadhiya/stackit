import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Tag as TagIcon, TrendingUp, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTags = [
  {
    name: "react",
    description: "A JavaScript library for building user interfaces",
    questionsCount: 1543,
    followersCount: 892,
    trending: true
  },
  {
    name: "javascript", 
    description: "High-level, interpreted programming language",
    questionsCount: 2156,
    followersCount: 1234,
    trending: true
  },
  {
    name: "typescript",
    description: "Typed superset of JavaScript that compiles to plain JavaScript",
    questionsCount: 987,
    followersCount: 567,
    trending: false
  },
  {
    name: "node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    questionsCount: 743,
    followersCount: 423,
    trending: false
  },
  {
    name: "python",
    description: "High-level, general-purpose programming language",
    questionsCount: 1234,
    followersCount: 789,
    trending: true
  },
  {
    name: "css",
    description: "Style sheet language used for describing presentation",
    questionsCount: 654,
    followersCount: 345,
    trending: false
  }
];

const Tags = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");

  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    switch (activeTab) {
      case "popular":
        return b.questionsCount - a.questionsCount;
      case "trending": 
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case "newest":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tags</h1>
        <p className="text-muted-foreground mb-6">
          Browse questions by technology, framework, or topic. Follow tags to get personalized recommendations.
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="popular" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Popular</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TagIcon className="w-4 h-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="newest" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Newest</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTags.map((tag) => (
              <Card key={tag.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Link to={`/tags/${tag.name}`}>
                      <Badge 
                        variant="secondary" 
                        className="text-base px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                    {tag.trending && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tag.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <TagIcon className="w-3 h-3" />
                      <span>{tag.questionsCount.toLocaleString()} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{tag.followersCount.toLocaleString()} followers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {sortedTags.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tags found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or browse all available tags.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tags;