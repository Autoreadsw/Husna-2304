import "dotenv/config"
import { delay, jidNormalizedUser } from "@whiskeysockets/baileys"

import * as Func from "./lib/function.js"
import serialize, { getContentType } from "./lib/serialize.js"
import Color from "./lib/color.js"

import util from "util"
import { exec } from "child_process"

export default async function message(hisoka, store, m) {
   try {
      let quoted = m.isQuoted ? m.quoted : m
      let downloadM = async (filename) => await hisoka.downloadMediaMessage(quoted, filename)
      let isCommand = m.prefix && m.body.startsWith(m.prefix) || false

      // mengabaikan pesan dari bot
      if (m.isBot) return

      // memunculkan ke log
      if (m.message && !m.isBot) {
         console.log(Color.black(Color.bgWhite("FROM")), Color.black(Color.bgGreen(m.pushName)), Color.black(Color.yellow(m.sender)) + "\n" + Color.black(Color.bgWhite("IN")), Color.black(Color.bgGreen(m.isGroup ? "Group" : "Private")) + "\n" + Color.black(Color.bgWhite("MESSAGE")), Color.black(Color.bgGreen(m.body || m.type)))
      }

      // command
      switch (isCommand ? m.command.toLowerCase() : false) {

         
         

         default:
            // eval
            if ([">", "eval", "=>"].some(a => m.command.toLowerCase().startsWith(a)) && m.isOwner) {
               let evalCmd = ""
               try {
                  evalCmd = /await/i.test(m.text) ? eval("(async() => { " + m.text + " })()") : eval(m.text)
               } catch (e) {
                  evalCmd = e
               }
               new Promise(async (resolve, reject) => {
                  try {
                     resolve(evalCmd);
                  } catch (err) {
                     reject(err)
                  }
               })
                  ?.then((res) => m.reply(util.format(res)))
                  ?.catch((err) => m.reply(util.format(err)))
            }

            // exec
            if (["$", "exec"].some(a => m.command.toLowerCase().startsWith(a)) && m.isOwner) {
               try {
                  exec(m.text, async (err, stdout) => {
                     if (err) return m.reply(util.format(err))
                     if (stdout) return m.reply(util.format(stdout))
                  })
               } catch (e) {
                  await m.reply(util.format(e))
               }
            }
      }
   } catch (err) {
      await m.reply(util.format(err))
   }
}
