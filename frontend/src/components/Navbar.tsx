import { useState } from "react";
import { useAuth } from "@/context/auth";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, ChevronDown, MessageSquare, Tag, Users, TrendingUp, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth"; // <-- make sure this path matches your project

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StackIt
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/trending" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </Link>
              <Link to="/tags" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </Link>
              <Link to="/users" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search questions, tags, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Ask Question Button */}
            <Button asChild className="hidden sm:flex">
              <Link to="/ask" className="flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Ask Question</span>
              </Link>
            </Button>

            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2">
                      <h3 className="font-semibold text-sm mb-2">Notifications</h3>
                      <div className="space-y-2">
                        <Link to="/notifications" className="block p-2 hover:bg-muted rounded-sm cursor-pointer">
                          <p className="text-sm">New answer on your question about React hooks</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </Link>
                        <Link to="/notifications" className="block p-2 hover:bg-muted rounded-sm cursor-pointer">
                          <p className="text-sm">Someone upvoted your answer</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </Link>
                        <Link to="/notifications" className="block p-2 hover:bg-muted rounded-sm cursor-pointer">
                          <p className="text-sm">New comment on your question</p>
                          <p className="text-xs text-muted-foreground">3 hours ago</p>
                        </Link>
                      </div>
                      <DropdownMenuSeparator className="my-2" />
                      <Link to="/notifications" className="block text-sm text-primary hover:underline">
                        View all notifications
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm max-w-[100px] truncate">{user.username}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/questions">My Questions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/unanswered">Unanswered Questions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;