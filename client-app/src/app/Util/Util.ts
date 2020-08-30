import { IUser } from './../models/user';
import { IActivity, IAttendee } from './../models/activity';
export const combineDateAndTime = (date: Date, time: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    // return new Date(`${year}-${month}-${day} ${hour}:${minutes}:00`);


    return new Date(Date.UTC(year, month, day, hour, minutes, 0));
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees.some(a => a.username === user.username);
    activity.isHost = activity.attendees.some(a => a.isHost && a.username === user.username);
    return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        username: user.username,
        displayName: user.displayName,
        isHost: false,
        image: user.image!
    }
}