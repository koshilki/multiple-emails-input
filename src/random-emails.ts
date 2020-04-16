function randomLength(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

function getRandomEmail() {
  const name = randomWord(randomLength(3, 15));
  const serverName = randomWord(randomLength(1, 8));
  const tld = randomWord(randomLength(2, 3));
  return `${name}@${serverName}.${tld}`;
}
