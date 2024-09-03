export default function Insights() {
  const progress = {
    lessonsCompleted: 2,
    quizzesTaken: 3,
    averageScore: 80,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Insights</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <ul className="space-y-2">
          <li>Lessons Completed: {progress.lessonsCompleted}</li>
          <li>Quizzes Taken: {progress.quizzesTaken}</li>
          <li>Average Quiz Score: {progress.averageScore}%</li>
        </ul>
      </div>
    </div>
  );
}