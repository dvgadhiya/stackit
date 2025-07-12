import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, HelpCircle, BookOpen, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const suggestedTags = [
    "react", "javascript", "typescript", "node.js", "python",
    "css", "html", "api", "database", "authentication"
  ];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag.toLowerCase()) && tags.length < 5) {
      setTags([...tags, tag.toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a descriptive title for your question.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide details about your question.",
        variant: "destructive"
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to categorize your question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:3000/api/question", {
        title,
        description,
        tags,
      }, {
        headers: {
          "Content-Type": "application/json",
          // If you have auth:
          // "Authorization": `Bearer ${userToken}`,
        }
      });

      toast({
        title: "Question posted!",
        description: "Your question has been successfully posted to the community.",
      });

      navigate("/");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post question.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
            <p className="text-muted-foreground">
              Get help from our community of developers and experts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Question Title *
              </Label>
              <p className="text-sm text-muted-foreground">
                Be specific and imagine you're asking a question to another person.
              </p>
              <Input
                id="title"
                placeholder="e.g. How do I implement authentication in React?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Problem Description *
              </Label>
              <p className="text-sm text-muted-foreground">
                Include all the information someone would need to answer your question.
              </p>
              <Textarea
                id="description"
                placeholder="Describe your problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="text-base resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Tags * (up to 5)
              </Label>
              <p className="text-sm text-muted-foreground">
                Add tags to describe what your question is about.
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(currentTag);
                    }
                  }}
                  disabled={tags.length >= 5}
                />
                <Button
                  type="button"
                  onClick={() => addTag(currentTag)}
                  disabled={!currentTag || tags.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggested Tags */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter(tag => !tags.includes(tag))
                    .slice(0, 6)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        disabled={tags.length >= 5}
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Posting..." : "Post Question"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>Writing a Good Question</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Title Tips</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Be specific and clear</li>
                  <li>• Include key technologies</li>
                  <li>• Avoid generic phrases</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Description Tips</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• What are you trying to achieve?</li>
                  <li>• What have you tried so far?</li>
                  <li>• Include relevant code snippets</li>
                  <li>• Mention error messages</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Tag Guidelines</span>
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Use existing popular tags</li>
                  <li>• Include the main technology</li>
                  <li>• Add specific framework/library</li>
                  <li>• Maximum 5 tags</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Be respectful and constructive</li>
                <li>• Search for existing solutions first</li>
                <li>• Provide context and examples</li>
                <li>• Accept helpful answers</li>
                <li>• Give back to the community</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
