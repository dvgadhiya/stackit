import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, ThumbsUp, MessageCircle, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";

interface Notification {
  id?: string;
  _id?: string;
  type: 'answer' | 'comment' | 'upvote' | 'mention' | 'badge';
  title: string;
  description: string;
  time: string;
  read: boolean;
  questionId?: string;
  userId?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'answer':
      return <MessageSquare className="w-5 h-5 text-primary" />;
    case 'upvote':
      return <ThumbsUp className="w-5 h-5 text-success" />;
    case 'comment':
      return <MessageCircle className="w-5 h-5 text-accent" />;
    case 'mention':
      return <User className="w-5 h-5 text-muted-foreground" />;
    case 'badge':
      return <Award className="w-5 h-5 text-yellow-500" />;
    default:
      return <MessageSquare className="w-5 h-5" />;
  }
};


const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/notifications`, { withCredentials: true });
        setNotifications(res.data.notifications || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);


  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => {
        const notifId = notif.id || notif._id;
        return notifId === id ? { ...notif, read: true } : notif;
      })
    );
    axios.patch(`${API_URL}/notifications/${id}/read`, {}, { withCredentials: true }).catch(() => {});
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    // Optionally, send PATCH to backend to mark all as read
    axios.patch(`${API_URL}/notifications/mark-all-read`, {}, { withCredentials: true }).catch(() => {});
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
          </div>
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Loading notifications...</h3>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Error</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === 'unread' ? "You're all caught up!" : "No notifications yet."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const notifId = notification.id || notification._id;
              return (
                <Card
                  key={notifId}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    if (notifId) markAsRead(notifId);
                    if (notification.questionId) {
                      window.location.href = `/questions/${notification.questionId}`;
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;