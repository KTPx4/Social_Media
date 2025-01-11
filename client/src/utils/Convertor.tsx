import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const convertToHoChiMinhTime = (dateString: string): string => {
    // Parse the input date string
    if (!dateString) return "unknow time"
    const dateUTC = parseISO(dateString);

    // Convert to Ho Chi Minh time (GMT+7)
    const dateHCM = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000);

    // Format the distance to now using Vietnamese locale
    const distanceToNow = formatDistanceToNow(dateHCM, {
        locale: vi,
        addSuffix: true,
    });

    // Customize the output format
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateHCM.getTime();
    const diffInMinutes = diffInMilliseconds / 1000 / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInMonths / 12;

    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minute ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour ago`;
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)} day ago`;
    } else if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)} month ago`;
    } else {
        return `${Math.floor(diffInYears)} year ago`;
    }
};

export default convertToHoChiMinhTime;

// Example usage
// const inputDate = '2023-01-11T03:57:16.1Z'; // UTC format
// const hoChiMinhTime = convertToHoChiMinhTime(inputDate);
// console.log(hoChiMinhTime); // Output: 'x năm trước' hoặc 'x tháng trước', v.v.
