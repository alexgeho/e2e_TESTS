export type UserType = {
    id: number
    userName: string
}

export type DBType = {
    courses: CourseType[],
    users: UserType[],
    userCourseBindings: UserCourseBindingType[]
}

export type CourseType = {
    id: number
    title: string
    studentsCount: number
}

export type UserCourseBindingType = {
    userId: number
    courseId: number
    date: Date
}

export const db: DBType = {

    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}
    ],

    users: [
        {id: 1, userName: 'Dimych'},
        {id: 2, userName: 'Ivan'},
        {id: 3, userName: 'Petro'},
        {id: 4, userName: 'Dmitro'},
        {id: 5, userName: 'Vova'},
        {id: 6, userName: 'Kostja'},
        {id: 7, userName: 'Ilja'},
        {id: 8, userName: 'Anton'},
        {id: 9, userName: 'Roma'},
        {id: 10, userName: 'Artjom'},

    ],

    userCourseBindings: [
        {userId: 1, courseId:1, date: new Date(2022,10,1)},
        {userId: 1, courseId:2, date: new Date(2022,10,1)},
        {userId: 2, courseId:2, date: new Date(2022,10,1)},
    ]
}

