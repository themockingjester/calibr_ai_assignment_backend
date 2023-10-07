const resultObject = function (success, message, data, code) {
    return {
        success,
        message,
        data,
        code,
    };
};
const generateResponse = function (success, message, data, code) {
    return {
        success,
        message,
        data,
        code,
    };
};


module.exports = {

    generateResponse,
    resultObject,
};