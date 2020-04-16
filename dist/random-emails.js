function randomLength(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomWord(length) {
    return Math.random()
        .toString(36)
        .substring(2, length + 2);
}
function getRandomEmail() {
    var name = randomWord(randomLength(3, 15));
    var serverName = randomWord(randomLength(1, 8));
    var tld = randomWord(randomLength(2, 3));
    return name + "@" + serverName + "." + tld;
}
//# sourceMappingURL=random-emails.js.map