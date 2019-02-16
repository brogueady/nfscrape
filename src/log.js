/* eslint-disable no-console */
const fs = require('fs')

var stream = fs.createWriteStream("log.out", {flags:'a'});

const logError = (msg) => {
    stream.write("Error:" + msg + '\n')
}

const logInfo = (msg) => {
    stream.write(msg + '\n')
}

const close = () => stream.close()


module.exports =  { logError, logInfo, close}