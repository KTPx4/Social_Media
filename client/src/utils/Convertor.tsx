import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const toHCMTime  = (date: string) =>{
    if (!date) return "Unknown time";

    const dateUTC = parseISO(date); // Chuyển đổi chuỗi thành đối tượng Date
    const dateHCM = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000); // Chuyển đổi sang giờ HCM (GMT+7)

    const month = String(dateHCM.getMonth() + 1).padStart(2, '0'); // Tháng (0-based index)
    const day = String(dateHCM.getDate()).padStart(2, '0'); // Ngày
    const year = dateHCM.getFullYear(); // Năm
    const hours = String(dateHCM.getHours()).padStart(2, '0'); // Giờ
    const minutes = String(dateHCM.getMinutes()).padStart(2, '0'); // Phút

    return `${month}/${day}/${year} ${hours}:${minutes}`; // Định dạng mm/dd/yyyy hh:mm
}

// Convert to Ho Chi Minh time (GMT+7)
const convertToHoChiMinhTime = (dateString: string): string => {
    // Parse the input date string
    if (!dateString) return "unknow time"
    const dateUTC = parseISO(dateString);

    // Convert to Ho Chi Minh time (GMT+7)
    const dateHCM = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000);

    // // Format the distance to now using Vietnamese locale
    // const distanceToNow = formatDistanceToNow(dateHCM, {
    //     locale: vi,
    //     addSuffix: true,
    // });

    // Customize the output format
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateHCM.getTime();
    const diffInMinutes = diffInMilliseconds / 1000 / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInMonths / 12;

    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minute`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour`;
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)} day`;
    } else if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)} month`;
    } else {
        return `${Math.floor(diffInYears)} year`;
    }
};

const ToHCMLite = (dateString: string): string => {
    // Parse the input date string
    if (!dateString) return "unknow time"
    const dateUTC = parseISO(dateString);

    // Convert to Ho Chi Minh time (GMT+7)
    const dateHCM = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000);

    // // Format the distance to now using Vietnamese locale
    // const distanceToNow = formatDistanceToNow(dateHCM, {
    //     locale: vi,
    //     addSuffix: true,
    // });

    // Customize the output format
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateHCM.getTime();
    const diffInMinutes = diffInMilliseconds / 1000 / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInMonths / 12;

    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)}d`;
    } else if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)}mth`;
    } else {
        return `${Math.floor(diffInYears)}y`;
    }
};
export {toHCMTime, convertToHoChiMinhTime, ToHCMLite}
// Example usage
// const inputDate = '2023-01-11T03:57:16.1Z'; // UTC format
// const hoChiMinhTime = convertToHoChiMinhTime(inputDate);
// console.log(hoChiMinhTime); // Output: 'x năm trước' hoặc 'x tháng trước', v.v.
