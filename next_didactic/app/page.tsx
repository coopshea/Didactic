'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InteractiveCircle from '../components/InteractiveCircle';

// Configuration variables
const config = {
  svgSize: 100,
  circles: [
    { name: 'unknown', cx: 50, cy: 50, radius: 45, fillColor: '#E9D5FF', activeColor: '#C084FC', text: "What you don't know you don't know", link: '/marketplace' },
    { name: 'known-unknown', cx: 55, cy: 45, radius: 30, fillColor: '#BFDBFE', activeColor: '#60A5FA', text: "What you know you don't know", link: '/lessons' },
    { name: 'known', cx: 45, cy: 55, radius: 15, fillColor: '#BBF7D0', activeColor: '#4ADE80', text: "What you know", link: '/insights' },
  ],
  componentSize: 'w-96 h-96',
  hoverScale: 1.02,
  expandDuration: 1000, // ms
  fadeDuration: 500, // ms
};

export default function Home() {
  const [activeCircle, setActiveCircle] = useState<string | null>(null);
  const [expandingCircle, setExpandingCircle] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);

  // Handle mouse movement over the SVG area
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert mouse position to SVG coordinates
    const svgX = (x / rect.width) * config.svgSize;
    const svgY = (y / rect.height) * config.svgSize;
    
    // Check if the mouse is inside any circle
    for (let i = config.circles.length - 1; i >= 0; i--) {
      const circle = config.circles[i];
      const distance = Math.sqrt(Math.pow(svgX - circle.cx, 2) + Math.pow(svgY - circle.cy, 2));
      if (distance <= circle.radius) {
        setActiveCircle(circle.name);
        return;
      }
    }
    setActiveCircle(null);
  };

  // Reset active circle when mouse leaves the component
  const handleMouseLeave = () => {
    setActiveCircle(null);
  };

  const handleCircleClick = (circleName: string) => {
    setExpandingCircle(circleName);
    setIsExpanded(true);
    
    setTimeout(() => {
      setIsFading(true);
    }, config.expandDuration);

    setTimeout(() => {
      const circle = config.circles.find(c => c.name === circleName);
      if (circle) {
        router.push(circle.link);
      }
    }, config.expandDuration + config.fadeDuration);
  };

  useEffect(() => {
    if (expandingCircle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expandingCircle]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white relative overflow-hidden">
      <h1 className={`text-4xl font-bold mb-12 transition-opacity duration-300 ${expandingCircle ? 'opacity-0' : 'opacity-100'}`}>Didactic Learning App</h1>
      
      {/* SVG component with interactive circles */}
      <div className={`flex flex-col items-center mb-8 transition-opacity duration-300 ${expandingCircle ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className={`relative ${config.componentSize} mb-2`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg ref={svgRef} viewBox={`0 0 ${config.svgSize} ${config.svgSize}`} className="w-full h-full">
            {config.circles.map((circle) => (
              <InteractiveCircle
                key={circle.name}
                config={circle}
                isActive={activeCircle === circle.name}
                onClick={handleCircleClick}
              />
            ))}
          </svg>
        </div>
        <div className="text-center h-10">
          {config.circles.map((circle) => (
            activeCircle === circle.name && (
              <p key={circle.name} style={{ color: circle.activeColor }} className="font-bold text-lg transition-opacity duration-300">
                {circle.text}
              </p>
            )
          ))}
        </div>
      </div>

      {/* Navigation links */}
      <nav className={`flex space-x-6 mb-8 transition-opacity duration-300 ${expandingCircle ? 'opacity-0' : 'opacity-100'}`}>
        <Link href="/lessons" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Lessons</Link>
        <Link href="/quiz" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Quiz</Link>
        <Link href="/insights" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">Insights</Link>
      </nav>
      <p className={`text-center max-w-lg text-lg transition-opacity duration-300 ${expandingCircle ? 'opacity-0' : 'opacity-100'}`}>
        Welcome to Didactic! Start your learning journey by exploring lessons, 
        testing your knowledge with quizzes, and tracking your progress.
      </p>
      <button 
        onClick={() => router.push('/auth')}
        className={`mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors transition-opacity duration-300 ${expandingCircle ? 'opacity-0' : 'opacity-100'}`}
      >
        Login / Sign Up
      </button>

      {/* Expanding circle overlay */}
      {expandingCircle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            transition: `transform ${config.expandDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
            transform: isExpanded ? 'scale(100)' : 'scale(1)',
            opacity: isFading ? 0 : 1,
            backgroundColor: config.circles.find(c => c.name === expandingCircle)?.fillColor || 'black',
          }}
        />
      )}
    </main>
  );
}