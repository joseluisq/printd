import { Printd } from '../src/index'

const d = new Printd()

const content = document.getElementById('myContent')
const btn1 = document.getElementById('myButton1')
const btn2 = document.getElementById('myButton2')

const cssText = `
  body {
    font-family: 'Roboto', sans-serif;
  }

  button {
    background-color: #fff;
    border: solid 2px peru;
    border-radius: 5px;
    color: peru;
    font-size: 16pt;
    font-weight: bold;
    padding: 10px;
    width: 200px;
  }
`

btn1.addEventListener('click', printElement)
btn2.addEventListener('click', printURL)

function printElement () {
  d.print(
    content,
    [ 'https://fonts.googleapis.com/css?family=Roboto', cssText ],
    [ '(()=> console.log(\'Hello world from IFrame!\'))()' ],
    ({ launchPrint }) => {
      console.log('Element printing: Content loaded!')

    // fire printing!
      launchPrint()
    })
}

function printURL () {
  d.printURL('http://localhost:1234/', ({ launchPrint }) => {
    console.log('URL printing: Content loaded!')

    // fire printing!
    launchPrint()
  })
}
