var config = {
    quest_id: 00000000, // Question ID, string or number
    ans_sum: 20, // Sum of answers wanted, integer required
    folder: '', // Path of saving images, absolute path or relative path, end by '/' recommanded.
    option: {
        url: '', // do not modify. It doesn't matter in fact whether you modify this or not.
        method: "GET", // do not modify
        headers: {
            Cookie: '' // Your zhihu login cookies
        }
    }
};

module.exports = config;