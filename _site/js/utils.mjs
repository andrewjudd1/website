
function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function is_json(json) {
    try {
        JSON.parse(json)
        return true
    } catch (error) {
        return false
    }
}
function is_json_comp(json) {
    try {
        JSON.parse(LZString.decompressFromUTF16(json))
        return true
    } catch (error) {
        return false
    }
}

function is_utf_8(str) {
    try {
        // Use TextDecoder to check if the string can be decoded as UTF-8
        new TextDecoder('utf-8').decode(new TextEncoder().encode(str));
        return true;
    } catch (e) {
        return false;
    }
}

function get_storage(item) {
    item = localStorage.getItem(item)
    if (!item) {
        return ''
    }
    if (item === 'true' || item === 'false' || item.toUpperCase() === 'Y' || item.toUpperCase() === 'N') {
        return item
    }
    let result = ''
    if (is_json_comp(item)) {
        result = JSON.parse(
            LZString.decompressFromUTF16(
                item
                    ?.replace('undefined', LZString.compressToUTF16('{}'))
            )
        )
        if (result === '{}') {
            result = ''
        }

    } else if (is_json(item)) {
        result = JSON.parse(
            item
                ?.replace('undefined', '{}') ||
            '{}'
        )
        if (result === '{}') {
            result = ''
        }
    } else {
        result = is_utf_8(item?.replace('undefined', '')) ? item : LZString.decompressFromUTF16(item?.replace('undefined', ''))
    }
    return result
}

function set_storage(key, value) {
    if (is_json(JSON.stringify(value))) {
        localStorage.setItem(key, LZString.compressToUTF16(JSON.stringify(value)))
    } else if (is_json_comp(JSON.stringify(value))) {
        localStorage.setItem(JSON.stringify(value))
    } else {
        is_utf_8(value) ? localStorage.setItem(key, LZString.compressToUTF16(value)) : localStorage.setItem(key, value)
    }
    return value
}

function get_date() { }

function get_el(el) {
    return document.getElementById(el) || null
}

function get_days_between(date1, date2) {
    // Parse the dates (ensure they are in a format recognized by the Date constructor)
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Get the difference in time (milliseconds)
    const differenceInTime = d2 - d1;

    // Convert the difference from milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
}

function get_date_no_tz() {
    const local_time = new Date().toLocaleDateString()
    const time_arr = local_time.split('/')
    const day = String(time_arr[1]).padStart(2, '0')
    const month = String(time_arr[0]).padStart(2, '0')
    const year = time_arr[2]

    return `${year}-${month}-${day}`

}

function get_days_ago(days, date = new Date()) {
    // Create a new Date object for the current date

    if (typeof date === 'string') {
        date = new Date(date)
    }
    // Subtract the specified number of days
    date.setDate(date.getDate() - days);

    return date.toISOString()
}

function is_valid_date(date) {
    return date instanceof Date && !isNaN(date)
}

function get_date_format(date, format = 'yyyy-mm-dd') {
    if (!date) {
        return null
    }
    if (typeof date === 'string') {
        date = new Date(date)
    }
    const days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months_of_year = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based
    const day = date.getDate();
    const day_of_week = days_of_week[date.getDay()];

    if (format === 'yyyy-mm-dd') {
        return `${year}-${month?.toString().padStart(2, '0')}-${day?.toString().padStart(2, '0')}`
    } else if (format = 'day, mon, dd') {
        return `${day_of_week?.slice(0, 3)}, ${months_of_year[month - 1]?.slice(0, 3)} ${day?.toString()?.padStart(2, '0')}`
    }
}

const validate_number = (num, dec) => {
    if (!num) {
        return 0
    }
    if (num?.toString()?.replace(/[$€£¥,%]/g, '') === '-') {
        return 0
    }
    num = num?.toString()?.replace(/[$€£¥,%]/g, '')
    num = num?.split('.')
    num = `${num?.[0]?.replace(/[^0-9-]/g, '')}${num?.[1] ? `.${num?.[1]?.replace(/[^0-9-]/g, '')}` : ''}`
    num = Number(num)
    if (isNaN(num)) {
        return 0
    }
    if (dec >= 0) {
        num = Number(num.toFixed(dec))
    }
    return num
}


export default {
    uuid,
    is_json,
    is_json_comp,
    is_utf_8,
    get_storage,
    set_storage,
    get_date,
    get_el,
    get_date_format,
    get_days_ago,
    validate_number
}