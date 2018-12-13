function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export const config = {
  prefix: 'https://etx.forestvisual.com',
  base: 'https://etx.forestvisual.com/guidewechat/',
  // prefix: 'http://39.106.120.41:8498',
  // base: 'http://39.106.120.41:8498/GuideWechat/',
  lineId: 'F8F6CA62-2B02-4A09-AB50-0575321B0C89',
  appId: 'wx64104ee36c863058',
  appSecret: '1b3f1d4dc4d895247c60d0d426aca413'
}
//儿童线
// AppID：wxb6db5e06d4a0078a
// AppSecret：8035eac66a0427e510aedb20b1a3af08

// 青古线
// appid：wx64104ee36c863058
// appsecret：1b3f1d4dc4d895247c60d0d426aca413


