"use server"
import { SurveyQuestions5, Surveys, User } from '@/types'
import axios from 'axios'
import { getMonth, getYear } from "date-fns"

const ApiHandler = axios.create(
    {
        baseURL: "https://icet.etlab.in/androidapp/app",
        headers: {
            // Referer: "https://icet.etlab.in/androidapp",
            Host: "icet.etlab.in",
        }
    }
)

async function getAttendance(user: User, date: Date) {
    const { data } = await ApiHandler.post("/attendancebydayperiod", {
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

async function getAllSurveys(user: User) {
    const { data } = await ApiHandler.post<Array<Surveys>>("/survey", {}, {
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
        }
    })
    return data
}

async function submitSurvey(survey: Surveys, user: User) {
    switch (survey.type) {
        case "5": {
            const { data } = await ApiHandler.post<Array<SurveyQuestions5>>("/surveyquestions", {
                "survey_id": survey.survey_id,
            }, {
                headers: {
                    "Authorization": `Bearer ${user.access_token}`
                }
            })
            const params = new URLSearchParams()
            params.append("survey_id", survey.survey_id);
            params.append("AnswerDetail[remark]", "Great");
            data.forEach((question) => {
                params.append(`Option[${question.qid}]`, question.option[0]);
            })
            const { data: response } = await ApiHandler.post("/submitsurvey", params.toString(), {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
        }
        default: new Error("Unknown survey type")
    }
}

export { ApiHandler, getAttendance, getAllSurveys, submitSurvey }