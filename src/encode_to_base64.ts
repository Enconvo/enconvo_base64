import { Clipboard, Action, ActionProps, res } from "@enconvo/api";
import { base64EncodeText } from "./util.ts";
import fs from 'fs'


export default async function main(req: Request) {
    // let table;
    try {
        const { options } = await req.json()
        const { text, context, contextFiles } = options

        const content = text || context
        const requestId = "112222"

        // 如果translateText中有换行符，需要添加> 符号
        if (content) {
            await res.context({ id: requestId, role: "human", content: content })
        }

        let result = ""
        if (content) {
            result = base64EncodeText(content)
        } else if (contextFiles && contextFiles.length > 0) {
            // get files base64
            contextFiles.forEach((item: string) => {
                if (contextFiles.length !== 1) {
                    result += `\n\n ${item}`
                }
                // Read the file into a buffer
                const fileBuffer = fs.readFileSync(item);

                // Convert the buffer to base64 string
                const base64String = fileBuffer.toString('base64');
                if (contextFiles.length !== 1) {
                    result += `\n\n> ${base64String}`
                } else[
                    result = base64String
                ]
            })

        } else {
            const selectedText = await Clipboard.selectedText()
            result = base64EncodeText(selectedText)
        }


        const actions: ActionProps[] = [
            Action.Paste(result, true),
            Action.Copy(result)
        ]

        const output = {
            content: result.slice(0, 1000) + (result.length > 1000 ? "\n..." : ""),
            actions: actions
        }

        return output;
    } catch (err) {
        console.log(err)
    }
}


