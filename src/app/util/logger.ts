const enabled: boolean = true;

export function log(...messages: Array<any>) {
  if(enabled) console.log(...messages);
}
