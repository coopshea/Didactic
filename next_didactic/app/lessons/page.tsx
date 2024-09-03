'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Lesson {
  id: number;
  title: string;
  content?: string;
}

interface LessonPlan {
  introduction: string;
  keyConcepts: string[];
  detailedExplanation: string;
  examplesAndApplications: string[];
  practiceExercises: string[];
  summaryAndNextSteps: string;
}

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [generatedLessonPlan, setGeneratedLessonPlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    fetchLessons();
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return;
    }
    setUser(user);
  }

  async function fetchLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('id, title, content')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lessons:', error);
    } else {
      setLessons(data || []);
    }
  }

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .insert([{ title: newLessonTitle, content: newLessonContent, user_id: user.id }])
      .select();

    if (lessonError) {
      console.error('Error adding lesson:', lessonError);
      return;
    }

    const newLesson = lessonData[0];

    for (const file of files) {
      const filePath = `${user.id}/${newLesson.id}/${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lesson-materials')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
      } else {
        await supabase
          .from('lesson_files')
          .insert([{
            lesson_id: newLesson.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type
          }]);
      }
    }

    setNewLessonTitle('');
    setNewLessonContent('');
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    await fetchLessons();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  function handleRemoveFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  async function handleGenerateLesson(e: React.FormEvent) {
    e.preventDefault();
    setIsGeneratingLesson(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const topic = formData.get('topic') as string;
    const background = formData.get('background') as string;
    const depth = formData.get('depth') as string;
    const preparation = formData.get('preparation') as string;
    const resources = formData.get('resources') as string;

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, background, depth, preparation, resources, 
          userId: user?.id,
          files: files.map(file => ({ name: file.name, type: file.type }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      setGeneratedLessonPlan(data.lessonPlan);
      setNewLessonTitle(topic);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
    } finally {
      setIsGeneratingLesson(false);
    }
  }

  if (!user) {
    return <div className="p-8">Please log in to view and create lessons.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Lessons</h1>
      
      {/* Lesson Generation Form */}
      <form onSubmit={handleGenerateLesson} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="topic"
          placeholder="Enter topic"
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <textarea
          name="background"
          placeholder="What is your background in this topic?"
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <select name="depth" className="border p-2 mb-4 w-full rounded" required>
          <option value="">Select depth</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input
          type="text"
          name="preparation"
          placeholder="Are you preparing for anything specific?"
          className="border p-2 mb-4 w-full rounded"
        />
        <textarea
          name="resources"
          placeholder="Any initial resources?"
          className="border p-2 mb-4 w-full rounded"
        />
        <div className="mb-4">
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Choose Files
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
            ref={fileInputRef}
          />
        </div>
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isGeneratingLesson}
        >
          {isGeneratingLesson ? 'Generating...' : 'Generate Lesson Plan'}
        </button>
      </form>

      {/* Display generated lesson plan */}
      {generatedLessonPlan && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Generated Lesson Plan</h2>
          <pre className="whitespace-pre-wrap">{generatedLessonPlan}</pre>
          <button
            onClick={handleAddLesson}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save as Lesson
          </button>
        </div>
      )}

      {/* Existing lesson list */}
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="bg-white p-4 rounded shadow">
            <Link href={`/lessons/${lesson.id}`} className="text-blue-500 hover:underline">
              <h2 className="text-xl font-semibold">{lesson.title}</h2>
            </Link>
            <p className="mt-2 text-gray-600">
              {(() => {
                try {
                  const content = JSON.parse(lesson.content || '{}');
                  return content.introduction ? 
                    `${content.introduction.substring(0, 100)}...` : 
                    'No introduction available';
                } catch (error) {
                  console.error('Error parsing lesson content:', error);
                  return 'Content not available';
                }
              })()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}