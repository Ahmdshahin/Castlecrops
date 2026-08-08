const { parsePhoneNumber } = require('libphonenumber-js/min');
const phone = '+48 123 456 789';
try {
  const phoneNumber = parsePhoneNumber(phone);
  console.log('Country:', phoneNumber.country);
  const getFlag = (cc) => cc.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
  console.log('Flag:', getFlag(phoneNumber.country));
} catch (e) {
  console.error(e);
}
