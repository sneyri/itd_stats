// Сюда добавляйте юзернеймы. Их программа будет искать и после выводить

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