import { getSuggestedProblems, SuggestedProblem } from "@/api/problems";
import { useEffect, useState } from "react";

export const useSuggestedProblems = () => {
  const [suggestions, setSuggestions] = useState<SuggestedProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const suggestionsData = await getSuggestedProblems();
      setSuggestions(suggestionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching suggested problems:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();

    // Listen for problem posted events to refetch data
    const handleProblemPosted = () => {
      fetchSuggestions();
    };

    window.addEventListener("problemPosted", handleProblemPosted);

    return () => {
      window.removeEventListener("problemPosted", handleProblemPosted);
    };
  }, []);

  return { suggestions, isLoading, error, refetch: fetchSuggestions };
};
