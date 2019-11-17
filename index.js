const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail');
require('dotenv/config');

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configurações
const docId = '1vzgLEgNqEAw1UXSComrJIudrH1E0zgIkpjnG6gf1nAw'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.render('home')
  console.log(process.env.SENDGRID_API_KEY)
})
app.post('/', async(request,response)=>{
  // const doc = new GoogleSpreadSheet(docId)
  // doc.useServiceAccountAuth(credentials, (err) => {
  //   if(err){
  //     console.log('Não foi possível abrir a planilha')
  //   }else {
  //     console.log('Planilha aberta')
  //     doc.getInfo((err, info) => {
  //       const worksheet = info.worksheets[worksheetIndex]
  //       worksheet.addRow({ name: request.body.name, email: request.body.email }, err => {
  //         response.send('Bug reportado com sucesso!')
  //       })
  //     })
  //   }
  // })
  try {
    const doc = new GoogleSpreadSheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({ 
      name: request.body.name, 
      email: request.body.email,
      issueType: request.body.issueType,
      userAgent: request.body.userAgent,
      userDate: request.body.userDate,
      howToReproduce: request.body.howToReproduce,
      expectedOutput: request.body.expectedOutput,
      receivedOutput: request.body.receivedOutput,
      source: request.query.source || 'direct'
    })
    
    // se for critico
    if(request.body.issueType === 'CRITICAL') {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
        to: 'jemlima@gmail.com',
        from: 'jemlima@gmail.com',
        subject: 'Reportando erro da aplicação',
        text: `O usuário: ${request.body.name} identificou um problema crítico, que precisa ser solucionado.`,
        html: `O usuário: ${request.body.name} identificou um problema crítico, que precisa ser solucionado.`,
      };
      await sgMail.send(msg);
    }
    response.render('sucesso')
  } catch (err) {
    response.send('Erro ao enviar formulário!')
    console.log(err)
  }
})

app.listen(3000, (err) => {
  if(err){
    console.log('Aconteceu um erro', err)
  }else{
    console.log('BugTracker rodando no endereço http://localhost:3000')
  }
})