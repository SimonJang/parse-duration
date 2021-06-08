const durationRE = /(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/uig
const durationISO8601Re = /^P(?!$)(\d+(?:\.\d+)?Y)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?W)?(\d+(?:\.\d+)?D)?(T(?=\d)(\d+(?:\.\d+)?H)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?S)?)?$/uig

/**
 * conversion ratios
 */

parse.nanosecond =
parse.ns = 1 / 1e6

parse['µs'] =
parse['μs'] =
parse.us =
parse.microsecond = 1 / 1e3

parse.millisecond =
parse.ms =
parse[''] = 1

parse.second =
parse.sec =
parse.s = parse.ms * 1000

parse.minute =
parse.min =
parse.m = parse.s * 60

parse.hour =
parse.hr =
parse.h = parse.m * 60

parse.day =
parse.d = parse.h * 24

parse.week =
parse.wk =
parse.w = parse.d * 7

parse.month =
parse.b =
parse.d * (365.25 / 12)

parse.year =
parse.yr =
parse.y = parse.d * 365.25

/**
 * convert `str` to ms
 *
 * @param {String} str
 * @param {String} format
 * @return {Number}
 */

function parse(str='', format='ms'){
  var result = null
  // ignore commas/placeholders
  str = (str+'').replace(/(\d)[,_](\d)/g, '$1$2')
  str.replace(durationRE, function(_, n, units){
    units = unitRatio(units)
    if (units) result = (result || 0) + parseFloat(n, 10) * units
  })

  return result && (result / (unitRatio(format) || 1))
}

function unitRatio(str) {
  return parse[str] || parse[str.toLowerCase().replace(/s$/, '')]
}

function extractResults(result) {
  let total = 0

  const valueMap = {
    1: 'Y',
    2: 'M',
    3: 'W',
    4: 'D',
    6: 'H',
    7: 'M',
    8: 'S',
  }

  for (const [index, value] of result.entries()) {
    if (index === 0 || index === 5)  continue
    if (!value) continue

    const modifier = valueMap[index]

    if (!modifier) continue

    const [modValue, rest] = value.split(modifier)

    if (rest === undefined) continue

    total += parseFloat(modValue, 10) * unitRatio(modifier.toLowerCase())
  }

  return total;
}

export default parse
