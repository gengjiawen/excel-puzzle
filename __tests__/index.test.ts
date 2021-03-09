import * as path from 'path'
import * as XLSX from 'xlsx'

it('add more test', () => {
  const workbook = XLSX.readFile(path.join(__dirname, 'test.xls'))
  const first_sheet_name = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[first_sheet_name]

  function in_range(v: number, min: number, max: number, result: any[]) {
    if (v >= min && v <= max) {
      result.push('pass')
    } else {
      result.push('fail')
    }
  }

  for (let i = 2; i < 65536; i++) {
    let b = worksheet[`B${i}`]
    if (b === undefined) {
      console.log(`no data at ${i}`)
      break
    }
    let d = worksheet[`D${i}`]

    const conditions = b.v.match(regex)
    const log = d.v.match(regex)

    let result: string[] = []
    if (conditions.length == 2) {
      const min = parseFloat(conditions[0])
      const max = parseFloat(conditions[1])
      const v = parseFloat(log[0])
      in_range(v, min, max, result)
    }

    if (conditions.length == 6) {
      for (let j = 0; j < 6; j = j + 2) {
        const min = parseFloat(conditions[j])
        const max = parseFloat(conditions[j + 1])
        const v = parseFloat(log[j])
        in_range(v, min, max, result)
      }
    }

    XLSX.utils.sheet_add_aoa(worksheet, [[result.join(',')]], {
      origin: `C${i}`,
    })
    console.log(result)
  }

  XLSX.writeFile(workbook, path.join(__dirname, 'result.xlsx'))
})

// https://regex101.com/r/6j4I19/1
const regex = /([+-]?\d)+(\.\d+)?/gm

it('split number', () => {
  const str = `-100~300`
  const r = str.match(regex)
  expect(r).toMatchSnapshot()
})

it('split complex number', () => {
  const str = `voltage: 0 mV
current: 0 mA
temperature: -273.15 C`
  const complex_result = str.match(regex)
  expect(complex_result).toMatchSnapshot()
})
