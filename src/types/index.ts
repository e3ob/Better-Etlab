export interface User {
    login: boolean
    access_token: string
    user_type: string
    univ: string
    hostel: number
    hostel_status: string
    batch_id: string
    sem_id: string
    sem_name: string
    profile_name: string
    course: string
    academic_year: string
    start_year: number
    end_year: number
    url: string
    uname: string
    password: string
    isktu: boolean
}


export interface Attendance {
    attends: Attend[]
}

export interface Attend {
    date: string
    holiday: boolean
    totalperiod: number
    periods: Period[]
}

export interface Period {
    hour: number
    subject: string
    topic_cov: string[]
    attendance: string
}
