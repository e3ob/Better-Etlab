"use client";
import { useGetAllSurveys } from "@/hooks/query";
import { User } from "@/types";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { useState, Fragment } from "react";
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
      <ItemGroup className="max-h-[calc(100vh-250px)] overflow-y-auto space-y-3 p-2  rounded w-full">
        {data && data.length > 0 ? (
          data?.map((survey, i) => (
            <Fragment key={i}>
              <Item
                variant={
                  !survey.complete && survey.survey_id !== ""
                    ? "outline"
                    : "muted"
                }
              >
                <ItemContent>
                  <ItemTitle className="line-clamp-1 ">
                    {survey.complete && (
                      <Badge className="bg-green-500">Completed</Badge>
                    )}
                    {!survey.complete && survey.survey_id !== "" && (
                      <Badge className="bg-yellow-500">Pending</Badge>
                    )}
                  </ItemTitle>
                  <ItemDescription>{survey.name}</ItemDescription>
                </ItemContent>
                <ItemMedia>
                  {survey.survey_id === "" ? (
                    <Badge className="bg-red-500">Last Date Over</Badge>
                  ) : (
                    <Badge className="bg-green-500">{survey.last_date}</Badge>
                  )}
                </ItemMedia>
              </Item>
            </Fragment>
          ))
        ) : (
          <Item variant="muted">
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                No surveys available
              </ItemTitle>
            </ItemContent>
          </Item>
        )}
      </ItemGroup>
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
