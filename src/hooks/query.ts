import { getAttendance } from "@/lib/axios";
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

export {
    useGetAttendance
}