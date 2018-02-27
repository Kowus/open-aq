module.exports = function () {
    let strlen = 64;
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.~!@#^*()_+$%&";

    for (let i = 0; i < strlen; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};