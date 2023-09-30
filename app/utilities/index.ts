/**
 * Digunakan untuk mengubah format angka menjadi format mata uang
 * @param money 
 * @param currency 
 * @returns 
 */
export const toMoney = (money: any, currency: string = ''): string => {
  money = Math.floor(money);
  return (
    (currency ? currency : '') +
    (!money
      ? '0'
      : money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')) +
    ''
  )
}

export const objectToQueryString = (obj: any) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export const classNames = (...classes: any[]) => { return classes.filter(Boolean).join(' ') }