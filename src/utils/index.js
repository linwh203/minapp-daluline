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

export const formatDate = (time,YYYY) => {
  let t = parseInt(time);
  let d=new Date(t),
      year = d.getFullYear(),
      month = d.getMonth() + 1,
      date = d.getDate(),
      hour = d.getHours()<10?`0${d.getHours()}`:d.getHours(),
      minute = d.getMinutes()<10?`0${d.getMinutes()}`:d.getMinutes(),
      second = d.getSeconds()<10?`0${d.getSeconds()}`:d.getSeconds();
  if(YYYY){
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }else{
    return month + "月" + date + "日" + hour + ":" + minute;
  }
};

export const config = {
  // prefix: 'https://etx.forestvisual.com',
  // base: 'https://etx.forestvisual.com/guidewechat/',
  prefix: 'https://dlx.forestvisual.com',
  base: 'https://dlx.forestvisual.com/GuideWechat/',
  lineId: 'C20442B1-FC17-4369-8D03-27C7A7D0EB10',
  appId: 'wx2524b56d9fcdc87a',
  // appId: 'wx64104ee36c863058',
  appSecret: 'd38753fbed0e7f203aeab48207b0d3c7'
}
//儿童线
// AppID：wxb6db5e06d4a0078a
// AppSecret：8035eac66a0427e510aedb20b1a3af08

// 青古线
// appid：wx64104ee36c863058
// appsecret：1b3f1d4dc4d895247c60d0d426aca413


