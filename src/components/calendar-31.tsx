"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOut } from "./auth";
import { cn, getDate } from "@/lib/utils";
import { User } from "@/types";
import { useGetAttendance } from "@/hooks/query";
import { useState } from "react";
import { getDay } from "date-fns";
import { Dot } from "lucide-react";

export default function Calendar31({ user }: { user: User }) {
  const [date, setDate] = useState<Date>(getDate());
  const { data, refetch, isFetching } = useGetAttendance(user, date);
  return (
    <Card className="w-sm py-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Attendance of {user.profile_name}</span>
          <SignOut />
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          View your attendance records for the selected date.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-4 w-full"
          disabled={(date) => date > getDate() || getDay(date) === 0}
          required
          showOutsideDays={false}
          onMonthChange={(refDate) => {
            setDate(refDate);
            refetch();
          }}
          components={{
            DayButton: ({ children, modifiers, day, className, ...props }) => {
              const att = data?.attends?.find(
                (att) =>
                  new Date(att.date).toDateString() === day.date.toDateString()
              );
              return (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  className={cn(
                    className,
                    "h-full w-full"
                  )}
                  {...props}
                >
                  {children}
                  {!modifiers.outside && att && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
                      {att.periods.map(
                        (period, idx) =>
                          period.attendance !== "N/A" && (
                            <Dot
                              key={idx}
                              size={5}
                              color={
                                period.attendance === "present"
                                  ? "green"
                                  : "red"
                              }
                            
                            />
                          )
                      )}
                    </div>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {isFetching ? (
            <div>Loading...</div>
          ) : data && data.attends ? (
            data.attends
              .filter((att) => {
                return (
                  new Date(att.date).toDateString() === date.toDateString()
                );
              })
              .map((att) => (
                <div
                  key={att.date}
                  className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                >
                  <div className="font-medium">{att.date}</div>
                  <div className="text-muted-foreground text-xs">
                    {att.periods.map(
                      (period, i) =>
                        period.attendance !== "N/A" && (
                          <div
                            key={period.hour}
                            className="flex justify-between"
                          >
                            <span
                              className={
                                period.attendance === "present"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {i + 1}. {period.subject}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div>No attendance data available</div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

const AttDot = ({ attendance }: { attendance: string }) => {
  return (
    <div
      className={cn(
        "absolute pointer-events-none flex h-2 w-2 left-[18px] group-data-[state=expanded]:left-[20px] top-2 z-10 rounded-full",
        attendance !== "present" ? "bg-destructive-600" : "bg-transparent"
      )}
    />
  );
};
