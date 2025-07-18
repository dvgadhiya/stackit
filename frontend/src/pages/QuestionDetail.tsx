import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, Eye, Clock, User, Check, Star, Flag, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import axios from "axios";



const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [postingAnswer, setPostingAnswer] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/questions/${id}`);
        setQuestion(res.data.question);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load question.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuestion();
  }, [id]);

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


  // Voting, Accept, Answer, Comment handlers (API integration)
  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    try {
      if (targetType === 'question') {
        await axios.post(`${API_BASE}/question/${id}/vote`, { type });
      } else if (targetType === 'answer' && targetId) {
        await axios.post(`${API_BASE}/answers/${targetId}/vote`, { type });
      }
      toast({
        title: `${type === 'up' ? 'Upvoted' : 'Downvoted'}`,
        description: `You ${type === 'up' ? 'upvoted' : 'downvoted'} this ${targetType}.`
      });
      // Refresh question
      const res = await axios.get(`${API_BASE}/questions/${id}`);
      setQuestion(res.data.question);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to vote." });
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await axios.post(`${API_BASE}/answers/${answerId}/accept`);
      toast({ title: "Answer accepted", description: "This answer has been marked as the solution." });
      // Refresh question
      const res = await axios.get(`${API_BASE}/questions/${id}`);
      setQuestion(res.data.question);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to accept answer." });
    }
  };

  const submitAnswer = async () => {
    if (!newAnswer.trim()) return;
    setPostingAnswer(true);
    try {
      await axios.post(`${API_BASE}/answers`, { questionId: id, content: newAnswer });
      toast({ title: "Answer posted!", description: "Your answer has been added to the question." });
      setNewAnswer("");
      // Refresh question
      const res = await axios.get(`${API_BASE}/questions/${id}`);
      setQuestion(res.data.question);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to post answer." });
    } finally {
      setPostingAnswer(false);
    }
  };

  const submitComment = async (parentType: 'question' | 'answer', parentId: string) => {
    if (!newComment.trim()) return;
    try {
      if (parentType === 'question') {
        await axios.post(`${API_BASE}/questions/${id}/comments`, { content: newComment });
      } else if (parentType === 'answer') {
        await axios.post(`${API_BASE}/answers/${parentId}/comments`, { content: newComment });
      }
      toast({ title: "Comment added!", description: "Your comment has been posted." });
      setNewComment("");
      setCommentingOn(null);
      // Refresh question
      const res = await axios.get(`${API_BASE}/question/${id}`);
      setQuestion(res.data.question);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to post comment." });
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-center text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-center text-destructive">{error}</div>;
  }
  if (!question) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-center text-destructive">Question not found.</div>;
  }

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
                {question.tags?.map((tag: string) => (
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
                    <div className="font-medium">{question.author?.name || question.author?.username || "User"}</div>
                    <div className="text-primary font-semibold">{question.author?.reputation ?? 0}</div>
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
                  {/* Show comments if present */}
                  {question.comments?.length > 0 && (
                    <div className="space-y-2 mb-2 pl-4 border-l-2 border-muted">
                      {question.comments.map((comment: any) => (
                        <div key={comment._id || comment.id} className="text-sm">
                          <span className="text-foreground">{comment.content}</span>
                          <span className="text-muted-foreground ml-2">
                            — {comment.author?.name || comment.author?.username || "User"} {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {commentingOn === 'question' && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => submitComment('question', question._id || question.id)}>
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
        <h2 className="text-xl font-bold">{question.answers?.length || 0} Answer{question.answers?.length !== 1 ? 's' : ''}</h2>
      </div>

      {/* Answers */}
      <div className="space-y-6 mb-8">
        {question.answers?.map((answer: any) => (
          <Card key={answer._id || answer.id} className={cn("border-l-4", answer.isAccepted && "border-l-success")}>...
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
                  {answer.comments?.length > 0 && (
                    <div className="space-y-2 mb-4 pl-4 border-l-2 border-muted">
                      {answer.comments.map((comment: any) => (
                        <div key={comment._id || comment.id} className="text-sm">
                          <span className="text-foreground">{comment.content}</span>
                          <span className="text-muted-foreground ml-2">
                            — {comment.author?.name || comment.author?.username || "User"} {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentingOn(commentingOn === (answer._id || answer.id) ? null : (answer._id || answer.id))}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add comment
                  </Button>
                  
                  {commentingOn === (answer._id || answer.id) && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => submitComment('answer', answer._id || answer.id)}>
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
              disabled={postingAnswer}
            />
            <div className="flex space-x-4">
              <Button onClick={submitAnswer} disabled={!newAnswer.trim() || postingAnswer}>
                {postingAnswer ? "Posting..." : "Post Answer"}
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