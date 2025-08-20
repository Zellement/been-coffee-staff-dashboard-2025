export const useDateUtils = () => {
    /**
     * Returns the ordinal suffix for a given date (e.g., 1st, 2nd, 3rd).
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
    const fullDateConverter = (
        passedDate: Date | string,
        showTime?: boolean
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
        return `${day}, ${d}${dSuffix} ${m} ${y}`
    }

    const extractHourAndMinute = (dateString: Date | string): string => {
        const date = new Date(dateString)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const formattedHours = hours.toString().padStart(2, '0')
        const formattedMinutes = minutes.toString().padStart(2, '0')
        return `${formattedHours}:${formattedMinutes}`
    }

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
    const shortDateConverter = (date: Date | string): string => {
        const parsedDate = date instanceof Date ? date : new Date(date)
        const d = parsedDate.getDate()
        const m = parsedDate.getMonth()
        const y = parsedDate.getFullYear()
        return `${d <= 9 ? '0' + d : d}/${m <= 8 ? '0' + (m + 1) : m + 1}/${y}`
    }

    const convertNumberTo24HrTime = (number: number): string => {
        // Take the number which will be between 0 and 23 and return a string that looks like a 24hour time, e.g. 22:00
        const hours = number.toString().padStart(2, '0')
        return `${hours}:00`
    }

    /**
     * Return a backwards date (YYYY-MM-DD).
     * @param date - The date.
     * @returns 2024-01-04
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
        backwardsDate
    }
}
