export class DateUtil {

  public static getTimeInMillisForFirstAndLastDayOfCurrentMonth(): { firstDay: number, lastDay: number } {
    // Get the current date
    const currentDate = new Date();

    // Set the date to the first day of the current month at 12:00 AM
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);

    // Set the date to the last day of the current month at 11:59:59 PM
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      firstDay: firstDay.getTime(),
      lastDay: lastDay.getTime()
    };
  }
}
