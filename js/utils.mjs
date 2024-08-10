
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



export default {
    uuid,
    is_json,
    is_json_comp,
    is_utf_8,
    get_storage,
    set_storage
}