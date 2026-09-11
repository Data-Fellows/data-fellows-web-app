import { dayNumberForToday } from "@/lib/challenge/day-number";
import type { ChallengeWithDays } from "@/types/challenge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { z } from "zod";
import { useMemberIdentity } from "../hooks/use-member-identity";

const formSchema = z.object({
  dayId: z.string().min(1, "Pick a day"),
  memberName: z.string().trim().min(1, "Enter your name"),
  memberEmail: z.string().trim().email("Enter a valid email"),
  learningNote: z.string().trim().max(1000).optional(),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const submitCheckIn = async (slug: string, values: FormValues) => {
  const response = await fetch(`/api/challenges/${slug}/check-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const body = (await response.json()) as { success: boolean; error?: string };
  if (!response.ok || !body.success) {
    throw new Error(body.error || "Something went wrong. Try again.");
  }
  return body;
};

const CheckInTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const { identity, setIdentity, hydrated } = useMemberIdentity();
  const queryClient = useQueryClient();
  const [submittedDay, setSubmittedDay] = useState<number | null>(null);

  const todayDayNumber = dayNumberForToday(challenge.start_date);
  const availableDays = challenge.challenge_days.filter(
    (day) => day.day_number <= todayDayNumber
  );
  const defaultDayId =
    availableDays.find((day) => day.day_number === todayDayNumber)?.id ||
    availableDays[availableDays.length - 1]?.id ||
    "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayId: defaultDayId,
      memberName: "",
      memberEmail: "",
      learningNote: "",
      company: "",
    },
  });

  useEffect(() => {
    if (hydrated && identity) {
      setValue("memberName", identity.name);
      setValue("memberEmail", identity.email);
    }
  }, [hydrated, identity, setValue]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => submitCheckIn(challenge.slug, values),
    onSuccess: (_data, values) => {
      setIdentity({ name: values.memberName, email: values.memberEmail });
      const day = challenge.challenge_days.find((d) => d.id === values.dayId);
      setSubmittedDay(day?.day_number ?? null);
      queryClient.invalidateQueries({
        queryKey: ["challenge-wall", challenge.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["challenge-tracker", challenge.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["challenge-certificate", challenge.slug],
      });
      reset({
        dayId: values.dayId,
        memberName: values.memberName,
        memberEmail: values.memberEmail,
        learningNote: "",
        company: "",
      });
    },
  });

  if (availableDays.length === 0) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
        <FiClock className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Check-in is opening soon.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Once {challenge.title} kicks off, you&apos;ll be able to check in
          here each day and share what you learned.
        </p>
      </div>
    );
  }

  if (submittedDay !== null) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
        <FiCheckCircle className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Day {submittedDay} checked in!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Nice work. See what the cohort is learning on the Wall tab, or
          check in for another day.
        </p>
        <button
          type="button"
          onClick={() => setSubmittedDay(null)}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Check in for another day
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="mx-auto max-w-xl space-y-5 rounded-3xl border border-primary/10 bg-background px-6 py-8"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Daily check-in
        </h2>
        <p className="text-sm text-muted-foreground">
          Log today&apos;s progress and tell the cohort what you learned.
        </p>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Day
        </label>
        <select
          {...register("dayId")}
          className="w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground"
        >
          {availableDays.map((day) => (
            <option key={day.id} value={day.id}>
              Day {day.day_number} -- {day.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Name
        </label>
        <input
          {...register("memberName")}
          className="w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground"
          placeholder="Your name"
        />
        {errors.memberName ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.memberName.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Email
        </label>
        <input
          type="email"
          {...register("memberEmail")}
          className="w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground"
          placeholder="you@email.com"
        />
        {errors.memberEmail ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.memberEmail.message}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Used to track your progress across days -- never shown publicly.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          What did you learn? (optional)
        </label>
        <textarea
          {...register("learningNote")}
          rows={3}
          className="w-full rounded-2xl border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground"
          placeholder="Share a takeaway with the cohort..."
        />
      </div>

      {mutation.isError ? (
        <p className="text-center text-sm text-destructive">
          {(mutation.error as Error).message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {mutation.isPending ? "Checking in..." : "Check in"}
      </button>
    </form>
  );
};

export default CheckInTab;
