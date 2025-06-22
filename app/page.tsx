'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, TrendingUp, Clock, Users, BookOpen, GraduationCap, Star, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const sampleNotes: Note[] = [
  {
    id: '1',
    name: 'Data Structures Complete Guide',
    collegeName: 'MIT',
    semester: '3rd',
    subject: 'Data Structures',
    department: 'Computer Science',
    description: 'Comprehensive notes covering all major data structures including arrays, linked lists, trees, and graphs with practical examples.',
    uploadDate: '2024-01-15',
    upvotes: 234,
    downvotes: 12,
    comments: 45,
    downloads: 1520
  },
  {
    id: '2',
    name: 'Calculus Integration Techniques',
    collegeName: 'Stanford University',
    semester: '2nd',
    subject: 'Mathematics',
    department: 'Mathematics',
    description: 'Detailed explanation of various integration techniques with step-by-step solutions and practice problems.',
    uploadDate: '2024-01-12',
    upvotes: 189,
    downvotes: 8,
    comments: 32,
    downloads: 892
  },
  {
    id: '3',
    name: 'Organic Chemistry Mechanisms',
    collegeName: 'Harvard University',
    semester: '4th',
    subject: 'Organic Chemistry',
    department: 'Chemistry',
    description: 'Complete guide to organic reaction mechanisms with visual diagrams and reaction pathways.',
    uploadDate: '2024-01-10',
    upvotes: 156,
    downvotes: 5,
    comments: 28,
    downloads: 654
  }
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('anchorNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(sampleNotes);
      localStorage.setItem('anchorNotes', JSON.stringify(sampleNotes));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredNotes = notes.slice(0, 3);
  const recentNotes = notes.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8 border border-blue-200">
            <Sparkles className="h-4 w-4 mr-2" />
            Join thousands of students sharing knowledge
          </div>

          {/* Main heading */}
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Share Knowledge,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Notes Together
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover, share, and download high-quality study notes from students across top universities. 
            Build your academic success with our collaborative learning platform.
          </p>
          
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-2">
                <div className="flex items-center">
                  <Search className="absolute left-6 text-gray-400 h-6 w-6 z-10" />
                  <Input
                    type="text"
                    placeholder="Search notes by subject, department, or title..."
                    className="pl-14 pr-6 py-6 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Search
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/browse">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Browse All Notes
                <BookOpen className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200">
                Share Your Notes
                <Star className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Trusted by 15K+ students
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              450+ universities
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              95% success rate
            </div>
          </div>
        </div>
      </section>

      {/* Featured Notes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">Featured Notes</h3>
              <p className="text-xl text-gray-600">Most popular and highly-rated study materials</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl">
                View All <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredNotes.map((note) => (
              <Card key={note.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(note.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors leading-tight">
                    {note.name}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {note.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                        {note.collegeName}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                        {note.semester} Sem
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-blue-200 text-blue-700">{note.subject}</Badge>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">{note.department}</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-green-500" />
                          {note.upvotes}
                        </span>
                        <span>{note.comments} comments</span>
                      </div>
                      <span className="font-medium">{note.downloads} downloads</span>
                    </div>
                    <Link href={`/note/${note.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Notes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">Recent Uploads</h3>
              <p className="text-xl text-gray-600">Latest notes from our community</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl">
                Browse All
              </Button>
            </Link>
          </div>

          {searchQuery && (
            <div className="mb-8">
              <p className="text-gray-600 mb-4 text-lg">
                Showing {filteredNotes.length} results for {<span className="font-semibold text-blue-600">{searchQuery}</span>}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? filteredNotes : recentNotes).map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {note.department}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(note.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                    {note.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2 text-gray-600">
                    {note.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                        {note.collegeName}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{note.subject}</span>
                        <span>{note.semester} Semester</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <span className="text-green-600">↑</span> {note.upvotes}
                        </span>
                        <span>💬 {note.comments}</span>
                      </div>
                      <span className="font-medium">↓ {note.downloads}</span>
                    </div>
                    <Link href={`/note/${note.id}`}>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                        View Note
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <h4 className="text-2xl font-bold">Anchor Notes</h4>
          </div>
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
            Empowering students through collaborative learning and knowledge sharing. 
            Join our community and unlock your academic potential.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}