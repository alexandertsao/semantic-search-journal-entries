require('dotenv').config()
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import { importFiles } from './importFiles'
import { queryFiles } from './queryFiles'
import { server } from './server'
import { chatCompletions } from './chatCompletions'

async function main() {
  const argv = yargs(hideBin(process.argv)).parseSync()
  const args = argv._
  if (args.length < 1) {
    console.error('Error: Must input function name')
  } else if (args[0] == 'importFiles') {
    await importFiles(args[1] as string)
  } else if (args[0] == 'queryFiles') {
    await queryFiles(args[1] as string)
  } else if (args[0] == 'server') {
    await server()
  } else if (args[0] == 'chatCompletions') {
    await chatCompletions(args[1] as string)
  } else {
    console.error('Error: Function does not exist')
  }
}
main()
