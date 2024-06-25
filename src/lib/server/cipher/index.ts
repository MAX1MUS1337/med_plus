import crypto from "crypto"
import { existsSync, readFileSync, writeFileSync } from "fs"

class Cipher {
    private static _instance: Cipher | null = null

    private _method: string = "aes-256-cbc"
    private _key: string | null = null

    static GetInstance(data: {keyPath: string} = {keyPath: "ciphkey"}): Cipher {
        if (this._instance != null) return this._instance

        try {
            let key: string = ""

            if (existsSync(data.keyPath)) {
                key = readFileSync(data.keyPath).toString()
            } else {
                key = crypto.createHash("sha512").update(crypto.randomInt(1, 10001).toString()).digest("hex").substring(0, 32)

                writeFileSync(data.keyPath, key)
            }

            this._instance = new Cipher()
            this._instance._key = key
        } catch (ex) {
            throw new Error(`Failed to initialize cipher instance: ${ex}.`)
        }
        
        return this._instance
    }

    public Encrypt(data: string) {
        if (this._key == null) throw Error("Failed to encrypt data: key is not provided.")

        const iv = crypto.createHash("sha512").update(crypto.randomInt(1, 10001).toString()).digest("hex").substring(0, 16)
        const cipher = crypto.createCipheriv(this._method, this._key, iv)

        return cipher.update(data, "utf8", "hex") + cipher.final("hex") + iv
    }

    public Decrypt(cipher: string) {
        if (this._key == null) throw Error("Failed to decrypt data: key is not provided.")

        const iv = cipher.slice(-16)
        const rawData = cipher.slice(0, -16)

        const decipher = crypto.createDecipheriv(this._method, this._key, iv)

        return decipher.update(rawData, "hex", "utf8") + decipher.final("utf8")
    }
}

export default Cipher