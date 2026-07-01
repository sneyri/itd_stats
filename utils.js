// Сюда добавляйте юзернеймы. Их программа будет искать и после выводить
// Я добавил самых популярных, а так можно и удалить и добавить свои

const verifyUsernames = [
    'nowkie',
    'tefn1',
    'smegmo4ka2003',
    'mast1kaa',
    'pswet',
    'itdcoder',
];

export default function checkVerify(username) {
    return verifyUsernames.includes(username);
}