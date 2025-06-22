'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  GraduationCap, 
  Calendar,
  User,
  Send
} from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  name: string;
  collegeName: string;
  semester: string;
  subject: string;
  department: string;
  description: string;
  uploadDate: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  downloads: number;
}

interface Comment {
  id: string;
  noteId: string;
  author: string;
  content: string;
  date: string;
  upvotes: number;
}

interface NoteDetailsClientProps {
  noteId: string;
}

export function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // Load note details
    const savedNotes = localStorage.getItem('anchorNotes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const foundNote = notes.find((n: Note) => n.id === noteId);
      setNote(foundNote || null);
    }

    // Load comments
    const savedComments = localStorage.getItem('noteComments');
    if (savedComments) {
      const allComments = JSON.parse(savedComments);
      const noteComments = allComments.filter((c: Comment) => c.noteId === noteId);
      setComments(noteComments);
    }

    // Load user vote
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      const votes = JSON.parse(savedVotes);
      setUserVote(votes[noteId] || null);
    }
  }, [noteId]);

  const handleVote = (type: 'up' | 'down') => {
    if (!note) return;

    const savedNotes = JSON.parse(localStorage.getItem('anchorNotes') || '[]');
    const savedVotes = JSON.parse(localStorage.getItem('userVotes') || '{}');

    let newUpvotes = note.upvotes;
    let newDownvotes = note.downvotes;

    // Remove previous vote if exists
    if (userVote === 'up') newUpvotes--;
    if (userVote === 'down') newDownvotes--;

    // Add new vote if different from current
    if (userVote !== type) {
      if (type === 'up') newUpvotes++;
      if (type === 'down') newDownvotes++;
      savedVotes[noteId] = type;
      setUserVote(type);
    } else {
      // Remove vote if clicking same button
      delete savedVotes[noteId];
      setUserVote(null);
    }

    // Update note
    const updatedNote = { ...note, upvotes: newUpvotes, downvotes: newDownvotes };
    setNote(updatedNote);

    // Save to localStorage
    const updatedNotes = savedNotes.map((n: Note) => 
      n.id === noteId ? updatedNote : n
    );
    localStorage.setItem('anchorNotes', JSON.stringify(updatedNotes));
    localStorage.setItem('userVotes', JSON.stringify(savedVotes));
  };

  const handleDownload = () => {
    if (!note) return;

    // Increment download count
    const savedNotes = JSON.parse(localStorage.getItem('anchorNotes') || '[]');
    const updatedNote = { ...note, downloads: note.downloads + 1 };
    setNote(updatedNote);

    const updatedNotes = savedNotes.map((n: Note) => 
      n.id === noteId ? updatedNote : n
    );
    localStorage.setItem('anchorNotes', JSON.stringify(updatedNotes));

    // Simulate download
    alert('Download started! In a real app, this would download the actual file.');
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !note) return;

    setIsSubmittingComment(true);

    const comment: Comment = {
      id: Date.now().toString(),
      noteId: noteId,
      author: authorName,
      content: newComment,
      date: new Date().toISOString(),
      upvotes: 0
    };

    // Add comment
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);

    // Update note comment count
    const savedNotes = JSON.parse(localStorage.getItem('anchorNotes') || '[]');
    const updatedNote = { ...note, comments: note.comments + 1 };
    setNote(updatedNote);

    const updatedNotes = savedNotes.map((n: Note) => 
      n.id === noteId ? updatedNote : n
    );

    // Save to localStorage
    const allComments = JSON.parse(localStorage.getItem('noteComments') || '[]');
    allComments.push(comment);
    localStorage.setItem('noteComments', JSON.stringify(allComments));
    localStorage.setItem('anchorNotes', JSON.stringify(updatedNotes));

    // Reset form
    setNewComment('');
    setIsSubmittingComment(false);
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Note not found</h2>
          <p className="text-gray-500 mb-4">The requested note could not be found.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Note Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{note.department}</Badge>
                  <Badge variant="outline">{note.semester} Semester</Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{note.name}</CardTitle>
                <CardDescription className="text-base">
                  {note.description}
                </CardDescription>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>{note.collegeName}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{note.subject}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Uploaded {new Date(note.uploadDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                <span>{note.downloads} downloads</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={userVote === 'up' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleVote('up')}
                  className={userVote === 'up' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {note.upvotes}
                </Button>
                <Button
                  variant={userVote === 'down' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleVote('down')}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  {note.downvotes}
                </Button>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {note.comments} comments
                </div>
              </div>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download Notes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmittingComment || !newComment.trim() || !authorName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmittingComment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </form>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}