export const combineDateAndTime = (date: Date, time: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    // return new Date(`${year}-${month}-${day} ${hour}:${minutes}:00`);


    return new Date(Date.UTC(year, month, day, hour, minutes, 0));
}