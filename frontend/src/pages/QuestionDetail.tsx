import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, Eye, Clock, User, Check, Star, Flag, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data - replace with API calls
const mockQuestion = {
  id: "1",
  title: "How to implement useEffect cleanup in React?",
  content: `I'm working on a React component that fetches data from an API, but I'm getting memory leaks when the component unmounts. Here's my current code:

\`\`\`javascript
function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data && data.name}</div>;
}
\`\`\`

How do I properly clean up the effect to prevent memory leaks?`,
  author: {
    name: "DevCoder",
    reputation: 1543,
    avatar: ""
  },
  tags: ["react", "javascript", "hooks", "useeffect"],
  votes: 12,
  views: 156,
  createdAt: "2024-01-15T10:30:00Z",
  answers: [
    {
      id: "1",
      content: `You need to clean up your effect to prevent memory leaks. Here's the correct way:

\`\`\`javascript
function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    fetchData().then(result => {
      if (isMounted) {
        setData(result);
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return <div>{data && data.name}</div>;
}
\`\`\`

The cleanup function sets \`isMounted\` to false, preventing state updates after unmount.`,
      author: {
        name: "ReactExpert",
        reputation: 3421
      },
      votes: 8,
      createdAt: "2024-01-15T11:15:00Z",
      isAccepted: true,
      comments: [
        {
          id: "1",
          content: "Great explanation! This solved my memory leak issue.",
          author: { name: "DevCoder", reputation: 1543 },
          createdAt: "2024-01-15T12:00:00Z"
        }
      ]
    },
    {
      id: "2", 
      content: `You can also use AbortController for fetch requests:

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });
    
  return () => controller.abort();
}, []);
\`\`\``,
      author: {
        name: "JSGuru", 
        reputation: 2156
      },
      votes: 5,
      createdAt: "2024-01-15T13:30:00Z",
      comments: []
    }
  ]
};

const QuestionDetail = () => {
  const { id } = useParams();
  const [question] = useState(mockQuestion);
  const [newAnswer, setNewAnswer] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const { toast } = useToast();

  const timeAgo = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const handleVote = (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    toast({
      title: `${type === 'up' ? 'Upvoted' : 'Downvoted'}`,
      description: `You ${type === 'up' ? 'upvoted' : 'downvoted'} this ${targetType}.`
    });
  };

  const handleAcceptAnswer = (answerId: string) => {
    toast({
      title: "Answer accepted",
      description: "This answer has been marked as the solution."
    });
  };

  const submitAnswer = () => {
    if (!newAnswer.trim()) return;
    
    toast({
      title: "Answer posted!",
      description: "Your answer has been added to the question."
    });
    setNewAnswer("");
  };

  const submitComment = (parentType: 'question' | 'answer', parentId: string) => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment added!",
      description: "Your comment has been posted."
    });
    setNewComment("");
    setCommentingOn(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Question */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Voting Section */}
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 h-10 w-10"
                onClick={() => handleVote('up', 'question')}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
              <span className="text-xl font-bold text-vote-up">{question.votes}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 h-10 w-10"
                onClick={() => handleVote('down', 'question')}
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 h-10 w-10">
                <Star className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
              
              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-wrap text-foreground">{question.content}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Link key={tag} to={`/tags/${tag}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{question.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>asked {timeAgo(question.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{question.author.name}</div>
                    <div className="text-primary font-semibold">{question.author.reputation}</div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-6 pt-4 border-t">
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentingOn(commentingOn === 'question' ? null : 'question')}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add comment
                  </Button>
                  
                  {commentingOn === 'question' && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => submitComment('question', question.id)}>
                          Post Comment
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCommentingOn(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">{question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}</h2>
      </div>

      {/* Answers */}
      <div className="space-y-6 mb-8">
        {question.answers.map((answer) => (
          <Card key={answer.id} className={cn("border-l-4", answer.isAccepted && "border-l-success")}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Voting Section */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-10 w-10"
                    onClick={() => handleVote('up', 'answer', answer.id)}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                  <span className={cn(
                    "text-xl font-bold",
                    answer.votes > 0 ? "text-vote-up" : "text-muted-foreground"
                  )}>
                    {answer.votes}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-10 w-10"
                    onClick={() => handleVote('down', 'answer', answer.id)}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </Button>
                  {answer.isAccepted ? (
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 h-10 w-10"
                      onClick={() => handleAcceptAnswer(answer.id)}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="prose max-w-none mb-4">
                    <div className="whitespace-pre-wrap text-foreground">{answer.content}</div>
                  </div>

                  {/* Answer Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>answered {timeAgo(answer.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{answer.author.name}</div>
                        <div className="text-primary font-semibold">{answer.author.reputation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {answer.comments.length > 0 && (
                    <div className="space-y-2 mb-4 pl-4 border-l-2 border-muted">
                      {answer.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="text-foreground">{comment.content}</span>
                          <span className="text-muted-foreground ml-2">
                            — {comment.author.name} {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentingOn(commentingOn === answer.id ? null : answer.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add comment
                  </Button>
                  
                  {commentingOn === answer.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => submitComment('answer', answer.id)}>
                          Post Comment
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCommentingOn(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Answer Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your answer here..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="flex space-x-4">
              <Button onClick={submitAnswer} disabled={!newAnswer.trim()}>
                Post Answer
              </Button>
              <Button variant="outline">
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionDetail;