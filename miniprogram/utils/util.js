const formatDate = date => {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  return timestamp
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatDate: formatDate
}
