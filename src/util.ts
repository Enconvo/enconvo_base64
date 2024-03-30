
export const base64EncodeText = (text: string) => {
    // encode content to base64
    const result = Buffer.from(text).toString('base64')
    return result
}

