import { getAttendance, getAllSurveys } from "@/lib/axios";
import { Attendance, User } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetAttendance = (user: User, date: Date) => {
    return useQuery<Attendance>({
        queryKey: ["attendance", date],
        queryFn: async ({ queryKey }) => {
            const [, date] = queryKey;
            return await getAttendance(user, date as Date);
        },
        retry: false,
    })
}

const useGetAllSurveys = (user: User) => {
    return useQuery({
        queryKey: ["surveys"],
        queryFn: async () => {
            return await getAllSurveys(user);
        }
        ,
        retry: false,
    })
}

export {
    useGetAttendance,
    useGetAllSurveys
}