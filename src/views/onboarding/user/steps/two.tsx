import { SkeletonBox } from "@/components";
import { useToast } from "@/context/ToastContext";
import { setUser } from "@/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addSkillsApi, getAvailableSkillsApi } from "../../api";

const formSchema = z.object({
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
});

interface Skill {
  _id: string;
  name: string;
}

const SkillsSelector = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await getAvailableSkillsApi();
        setSkillsList(response.skills || []);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { skills: [] },
  });

  const updateFormValues = (newSkills: Skill[]) => {
    const skillNames = newSkills.map((skill) => skill.name);
    form.setValue("skills", skillNames);
    setSelectedSkills(newSkills);
  };

  const addSkill = (skill: Skill) => {
    if (
      selectedSkills.length < 15 &&
      !selectedSkills.find((s) => s._id === skill._id)
    ) {
      const newSkills = [...selectedSkills, skill];
      updateFormValues(newSkills);
    }
    setSearch("");
  };

  const removeSkill = (skillToRemove: Skill) => {
    const newSkills = selectedSkills.filter((s) => s._id !== skillToRemove._id);
    updateFormValues(newSkills);
  };

  const filteredSkills = skillsList.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedSkills.find((s) => s._id === skill._id)
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUpdating(true);
      setError(null);

      const skillIds = selectedSkills.map((skill) => skill._id);

      const response = await addSkillsApi({ skillIds });

      if (response.user) {
        setUser(response.user);
      }

      showToast("Skills updated successfully!", "success");

      sessionStorage.setItem("selectedSkills", JSON.stringify(values.skills));

      form.reset();
      setPage((page) => page + 1);
    } catch (error: any) {
      console.error("Error updating skills:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to update skills. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
      setIsUpdating(false);
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-2">
        <div
          className="w-full bg-card rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-8 md:gap-0"
          style={{ maxWidth: "1200px", minHeight: "70vh" }}
        >
          <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
            <SkeletonBox className="h-6 w-24 mb-4" />
            <SkeletonBox className="h-8 w-3/4 mb-2" />
            <SkeletonBox className="h-5 w-2/3 mb-6" />
            <SkeletonBox className="h-4 w-full mb-4" />
            <SkeletonBox className="h-5 w-1/2 mb-3" />
            <SkeletonBox className="h-12 w-full mb-8" />
            <SkeletonBox className="h-5 w-1/2 mb-3" />
            <div className="flex gap-2">
              <SkeletonBox className="h-10 w-1/4" />
              <SkeletonBox className="h-10 w-1/4" />
            </div>
          </div>
          <div className="w-full md:w-[30%] flex items-start justify-center px-2 md:px-0 py-2 md:py-20">
            <SkeletonBox className="w-full max-w-xs h-48" />
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-2">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-card rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-8 md:gap-0"
        style={{ maxWidth: "1200px", minHeight: "70vh" }}
      >
        <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
          <h2 className="text-md mb-4 text-border font-semibold">2/6</h2>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Almost there! What skills do you have to show off?
          </h2>
          <p className="text-muted-foreground mb-6 text-base">
            Your skills show business owners what you can offer and help us
            recommend jobs to you. Select from our suggestions or type to add
            more.
          </p>
          <div className="border-t border-border pt-6 mb-4"></div>
          <h3 className="text-lg font-semibold mb-3">Your skills</h3>
          <div className="w-full mb-1 relative">
            <div className="flex flex-wrap items-center gap-2 border border-border rounded-lg px-2 py-1 bg-background ">
              {selectedSkills.map((skill) => (
                <div
                  key={skill._id}
                  onClick={() => removeSkill(skill)}
                  className="bg-card text-primary border border-primary px-3 py-1 rounded-lg flex items-center cursor-pointer"
                >
                  <button
                    type="button"
                    className="mr-1 text-sm text-primary font-bold"
                    tabIndex={-1}
                  >
                    ✕
                  </button>
                  <span className="text-primary text-sm">{skill.name}</span>
                </div>
              ))}
              <input
                type="text"
                placeholder="Enter skills here"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-background text-primary outline-none py-3 min-w-[120px]"
              />
            </div>
            {search && filteredSkills.length > 0 && (
              <div className="border border-border rounded-lg p-3 mt-2 bg-card shadow-md flex flex-wrap gap-2 z-10">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill._id}
                    type="button"
                    className="border border-primary m-1 text-sm text-primary text-left px-3 py-2 rounded-lg"
                    onClick={() => addSkill(skill)}
                  >
                    + {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="text-right text-muted-foreground text-sm mb-8">
            Max 15 skills
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <h3 className="text-lg font-semibold mb-3">Suggested skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {skillsList
              .filter(
                (skill) => !selectedSkills.find((s) => s._id === skill._id)
              )
              .slice(0, 10)
              .map((skill) => (
                <button
                  key={skill._id}
                  type="button"
                  className="border border-primary m-1 text-sm text-primary text-left px-3 py-2 rounded-lg"
                  onClick={() => addSkill(skill)}
                >
                  + {skill.name}
                </button>
              ))}
          </div>
          <div className="flex flex-row justify-between mt-8 gap-4 w-full">
            <button
              type="button"
              className="w-1/2 sm:w-1/4 border border-primary bg-background text-primary hover:bg-primary/10 rounded-md px-4 py-2 font-semibold transition"
              onClick={() => setPage((page) => page - 1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 sm:w-1/4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-semibold transition"
              disabled={selectedSkills.length === 0 || isUpdating}
            >
              {isUpdating ? "Loading..." : "Next"}
            </button>
          </div>
        </div>
        {/* Info Box */}
        <div className="w-full md:w-[30%] flex items-start justify-center px-2 md:px-0 py-2 md:py-20">
          <div className="w-full max-w-xs border border-border bg-primary/5 rounded-lg p-6 text-center shadow-md md:mt-0 mt-8">
            <Image
              src="/svgs/data-fellow.svg"
              width={70}
              height={70}
              alt="Data Fellows Logo"
              className="mx-auto mb-4"
            />
            <p className="text-base text-foreground font-medium">
              Data Fellow&apos;s algorithm will match you with specific jobs
              tailored to your skill set.
              <br />
              <span className="font-semibold text-primary">
                Choose carefully to get the best matches!
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SkillsSelector;
