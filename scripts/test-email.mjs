import nodemailer from 'nodemailer'

const {
    EMAIL,
    EMAIL_PASSWORD,
    EMAIL_SERVICE,
} = process.env

const TO = process.argv[2] ?? EMAIL

if (!TO) {
    console.error('Usage: node --env-file=.env scripts/test-email.mjs [recipient@example.com]')
    process.exit(1)
}

const transport = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
})

console.log('Verifying connection...')
await transport.verify()
console.log('Connection OK — sending test mail to', TO)

const info = await transport.sendMail({
    from: EMAIL,
    to: TO,
    subject: 'Nodemailer test',
    text: 'If you see this, nodemailer is configured correctly.',
})

console.log('Sent:', info.messageId)
