const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
  const doc = new GoogleSpreadSheet('1vzgLEgNqEAw1UXSComrJIudrH1E0zgIkpjnG6gf1nAw')
  await promisify(doc.useServiceAccountAuth)(credentials)
  console.log('Planilha aberta')
  const info = await promisify(doc.getInfo)()
  const worksheet = info.worksheets[0]
  await promisify(worksheet.addRow)({ name: 'Everaldo Lima', email: 'jemlima@gmail.com'})
}

addRowToSheet()

// const doc = new GoogleSpreadSheet('1vzgLEgNqEAw1UXSComrJIudrH1E0zgIkpjnG6gf1nAw')
// doc.useServiceAccountAuth(credentials, (err) => {
//   if(err){
//     console.log('Não foi possível abrir a planilha')
//   }else {
//     console.log('Planilha aberta')
//     doc.getInfo((err, info) => {
//       const worksheet = info.worksheets[0]
//       worksheet.addRow({ name: 'Everaldo Lima', email: 'jemlima@gmail.com'}, err => {
//         console.log('Linha inserida')
//       })
//     })
//   }
// })