import { describe, it } from "node:test";
import { transporter } from "../src/utils/mailSender.js";
import assert from "node:assert";

describe('Nodemailer', () => {
    it('should connect', async () => {
        const result = await transporter.verify()
        assert.strictEqual(result, true)
    })
})