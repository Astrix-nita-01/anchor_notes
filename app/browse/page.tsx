'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, BookOpen, GraduationCap, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('anchorNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const departments = Array.from(new Set(notes.map(note => note.department))).sort();
  const semesters = Array.from(new Set(notes.map(note => note.semester))).sort();

  const filteredAndSortedNotes = notes
    .filter(note => {
      const matchesSearch = !searchQuery || 
        note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || note.department === selectedDepartment;
      const matchesSemester = selectedSemester === 'all' || note.semester === selectedSemester;
      
      return matchesSearch && matchesDepartment && matchesSemester;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'downloads':
          return b.downloads - a.downloads;
        case 'recent':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSemester('all');
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Notes</h2>
          <p className="text-gray-600">Discover study materials from students across universities</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedNotes.length} of {notes.length} notes
              </p>
              {(searchQuery || selectedDepartment !== 'all' || selectedSemester !== 'all') && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {filteredAndSortedNotes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or clear the filters to see all notes.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {note.department}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(note.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                    {note.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {note.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <div className="flex-1">
                        <div>{note.collegeName}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-blue-600 font-medium">{note.subject}</span>
                          <span>{note.semester} Sem</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="font-medium text-green-600">+{note.upvotes}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="font-medium text-red-500">-{note.downvotes}</span>
                        </div>
                        <span>💬 {note.comments}</span>
                      </div>
                      <span className="text-blue-600 font-medium">↓ {note.downloads}</span>
                    </div>
                    
                    <Link href={`/note/${note.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}