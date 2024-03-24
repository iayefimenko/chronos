/* 
Password requirements:
1) Min 10 characters len
2) Min 1 uppercase letters
3) Min 1 lowercase letters
4) Min 1 special character 
5) Min 1 numbers
*/
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$&%^_+=()\\\[\]{};:<>.,|?\-\/*])(?=.*[0-9])(?=.*[a-z]).{10,}$/m;

const colorRegex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

module.exports = { passwordRegex, colorRegex };
