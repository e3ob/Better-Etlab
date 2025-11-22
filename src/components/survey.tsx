"use client";
import { useGetAllSurveys } from "@/hooks/query";
import { User } from "@/types";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item";
import { useState } from "react";
import { toast } from "sonner";
import { submitSurvey } from "@/lib/axios";

export default function Survey({ user }: { user: User }) {
  const { data, isFetching, refetch } = useGetAllSurveys(user);
  const tos = data?.filter((s) => s.survey_id !== "" && !s.complete);
  const [submitting, setSubmitting] = useState(false);
  if (isFetching) {
    return (
      <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">Getting surveys...</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    );
  }
  async function submitAllSurveys() {
    const t = toast.loading("Submitting all surveys...");
    setSubmitting(true);
    try {
      const sub = data?.filter((s) => s.survey_id !== "" && !s.complete);
      if (!sub || sub?.length === 0) {
        toast.error("No surveys to submit", { id: t });
        return;
      }
      await Promise.all(
        sub.map((survey) => {
          return submitSurvey(survey, user);
        })
      );
      await refetch();
      toast.success("All surveys submitted successfully", { id: t });
    } catch (error) {
      console.error("Error submitting surveys:", error);
      toast.error("Failed to submit surveys", { id: t });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center ">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-3 p-2 border rounded">
        {data ? (
          data?.map((survey, i) => (
            <div key={i} className="border rounded p-4 shadow-sm bg-white">
              <p className="font-semibold text-lg">{survey.name}</p>

              <div className="mt-2 text-sm flex flex-col gap-1">
                <Badge
                  className={
                    survey.survey_id === "" ? "bg-red-500" : "bg-green-500"
                  }
                >
                  <span className="font-medium">Last Date:</span>{" "}
                  {survey.last_date}
                </Badge>
                {survey.complete && (
                  <Badge className="bg-green-500 ">Completed</Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      {data && (
        <Button
          disabled={submitting || !(tos && tos.length > 0)}
          onClick={submitAllSurveys}
        >
          {tos && tos.length > 0
            ? `Submit All Surveys (${tos.length})`
            : "No surveys to submit"}
          {submitting && <Spinner className="ml-2" />}
        </Button>
      )}
    </div>
  );
}
