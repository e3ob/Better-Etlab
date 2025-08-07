"use server"
import { User } from '@/types'
import axios from 'axios'
import { getMonth, getYear } from "date-fns"

const Axios = axios.create(
    {
        baseURL: "https://icet.etlab.in/androidapp/app",
        headers: {
            Referer: "https://icet.etlab.in/androidapp/app"
        }
    }
)

async function getAttendance(user: User, date: Date) {
    const { data } = await Axios.post("/attendancebydayperiod", {
        "month": getMonth(date) + 1,
        "semester": user.sem_id,
        "year": getYear(date),
    }, {
        headers: {
            "Authorization": `Bearer ${user.access_token}`
        }
    })
    return data
}

export { Axios as default, getAttendance }