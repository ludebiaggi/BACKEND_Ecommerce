//Se genera el script para aplicar cuando sea necesario las variables de entorno.

import { program } from "commander";

program
  .option("-m, --mode <mode>", "Ambiente de desarrollo para trabajar", "development")
  .option("-p, --port <number>", "Puerto a utilizar", 8080)
  .option("-d, --debug", "Variable modo debug", false)
  .parse();

console.log("argv", program.args);
console.log("opts", program.opts());

export default program;