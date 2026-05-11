const loggingEnabled: boolean = true;
const errorLoggingEnabled: boolean = true;

export function log(...messages: Array<any>) {
  if(loggingEnabled) console.log(...messages);
}

export function error(...messages: Array<any>) {
  if(errorLoggingEnabled) console.error(...messages);
}
