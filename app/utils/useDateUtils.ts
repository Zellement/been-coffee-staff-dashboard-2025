export const useDateUtils = () => {
    /**
     * Returns the ordinal suffix for a given date (e.g., 1st, 2nd, 3rd).
     */
    /**
     * Returns the ordinal suffix for a given date (e.g., 1st, 2nd, 3rd).
     * @param d - The day of the month.
     * @returns The ordinal suffix as a string.
     */
    const nth = (d: number): string => {
        if (d > 3 && d < 21) return 'th'
        switch (d % 10) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            default:
                return 'th'
        }
    }

    /**
     * Return a long user-friendly date.
     * @param date - The date.
     * @returns Thursday, 04 January 2024
     */
    /**
     * Returns a long user-friendly date string.
     * @param passedDate - The date to format (Date or string).
     * @param showTime - Whether to include the time (optional).
     * @returns A formatted date string, e.g., "Thursday, 04 January 2024" or with time.
     */
    const fullDateConverter = (
        passedDate: Date | string,
        showTime?: boolean,
        showDay?: boolean
    ): string => {
        const date = new Date(passedDate)
        const monthArray = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        const dayArray = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]
        const day = dayArray[date.getDay()]
        const d = date.getDate()
        const dSuffix = nth(date.getDate())
        const m = monthArray[date.getMonth()]
        const y = date.getFullYear()

        if (showTime) {
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return `${day}, ${d}${dSuffix} ${m} ${y} ${hours}:${minutes}`
        }
        if (showDay) {
            return `${day}, ${d}${dSuffix} ${m} ${y}`
        }
        return `${d}${dSuffix} ${m} ${y}`
    }

    /**
     * Extracts the hour and minute from a date as a string in HH:mm format.
     * @param dateString - The date to extract from (Date or string).
     * @returns The formatted time string (e.g., "09:30").
     */
    const extractHourAndMinute = (dateString: Date | string): string => {
        const date = new Date(dateString)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const formattedHours = hours.toString().padStart(2, '0')
        const formattedMinutes = minutes.toString().padStart(2, '0')
        return `${formattedHours}:${formattedMinutes}`
    }

    /**
     * Returns today's date in URL-encoded format (MM%2FDD%2FYYYY).
     * @param date - The date to format.
     * @returns The URL-encoded date string.
     */
    const getTodaysDateInUrlEncodedFormat = (date: Date): string => {
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${mm}%2F${dd}%2F${yyyy}`
    }

    /**
     * Return a short user-friendly date.
     * @param date - The date.
     * @returns 04/01/2024
     */
    /**
     * Returns a short user-friendly date string (DD/MM/YYYY).
     * @param date - The date to format (Date or string).
     * @returns The formatted date string.
     */
    const shortDateConverter = (date: Date | string): string => {
        const parsedDate = date instanceof Date ? date : new Date(date)
        const d = parsedDate.getDate()
        const m = parsedDate.getMonth()
        const y = parsedDate.getFullYear()
        return `${d <= 9 ? '0' + d : d}/${m <= 8 ? '0' + (m + 1) : m + 1}/${y}`
    }

    /**
     * Converts a number (0-23) to a 24-hour time string (e.g., 22:00).
     * @param number - The hour as a number.
     * @returns The formatted 24-hour time string.
     */
    const convertNumberTo24HrTime = (number: number): string => {
        const hours = number.toString().padStart(2, '0')
        return `${hours}:00`
    }

    /**
     * Returns only the month and day from a date as MM/DD.
     * @param date - The date to format (Date or string).
     * @returns The formatted month/day string, but with the months written out
     */
    const getMonthAndDayOnly = (date: Date | string): string => {
        const parsedDate = date instanceof Date ? date : new Date(date)
        const d = parsedDate.getDate()
        const m = parsedDate.getMonth()
        const monthArray = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        return ` ${d}${nth(d)} ${monthArray[m]}`
    }

    /**
     * Return a backwards date (YYYY-MM-DD).
     * @param date - The date.
     * @returns 2024-01-04
     */
    /**
     * Returns a date string in backwards format (YYYY-MM-DD).
     * @param date - The date to format (Date or string).
     * @returns The formatted backwards date string.
     */
    const backwardsDate = (date: Date | string): string => {
        const parsedDate = date instanceof Date ? date : new Date(date)
        const d = parsedDate.getDate()
        const m = parsedDate.getMonth()
        const y = parsedDate.getFullYear()
        return `${y}-${m <= 8 ? '0' + (m + 1) : m + 1}-${d <= 9 ? '0' + d : d}`
    }

    return {
        extractHourAndMinute,
        getTodaysDateInUrlEncodedFormat,
        fullDateConverter,
        shortDateConverter,
        convertNumberTo24HrTime,
        getMonthAndDayOnly,
        backwardsDate
    }
}
