import { getUser } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Problem {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const router = useRouter();

  useEffect(() => {
    // Example: fetch user's problems from API
    async function fetchProblems() {
      setLoading(true);
      // Replace with your actual API endpoint
      // const res = await fetch("/api/problems");
      // const data = await res.json();
      // setProblems(data);
      // For now, use mock data:
      setProblems([
        {
          _id: "1",
          title: "Sample Data Problem",
          description: "This is a sample problem description.",
          status: "Open",
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }
    fetchProblems();
  }, []);

  if (!user) {
    router.replace("/auth/sign-in");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Problems</h1>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : problems.length === 0 ? (
        <div className="text-muted-foreground">
          You have not posted any problems yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {problems.map((problem) => (
            <li
              key={problem._id}
              className="bg-card border border-border rounded-lg p-4 shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{problem.title}</h2>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                  {problem.status}
                </span>
              </div>
              <p className="text-muted-foreground mb-2">
                {problem.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Created: {new Date(problem.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
