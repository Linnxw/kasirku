import pino from "pino"
import pretty from "pino-pretty"

export const logger=pino({
  base:{
   pid:false
  },
  timestamp:()=>`,"time":"${new Date().getTime}"`,
},
  pretty()
)