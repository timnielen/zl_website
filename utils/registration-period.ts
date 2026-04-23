type RuntimePublicConfig = {
    REGISTRATION_START_DATE?: string
    REGISTRATION_END_DATE?: string
}

function parseIsoDate(input: string, label: string): Date {
    const trimmed = input.trim()

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const parsed = new Date(`${trimmed}T00:00:00.000Z`)
        if (Number.isNaN(parsed.getTime())) {
            throw new Error(`${label} is invalid: ${input}`)
        }
        return parsed
    }

    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`${label} is invalid: ${input}`)
    }

    return parsed
}

function asInclusiveEndDate(input: string): Date {
    const trimmed = input.trim()

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return new Date(`${trimmed}T23:59:59.999Z`)
    }

    return parseIsoDate(trimmed, 'REGISTRATION_END_DATE')
}

export function getRegistrationPeriodFromRuntimeConfig(config: RuntimePublicConfig) {
    if (!config.REGISTRATION_START_DATE || !config.REGISTRATION_END_DATE) {
        throw new Error('REGISTRATION_START_DATE and REGISTRATION_END_DATE must be configured')
    }

    const startDate = parseIsoDate(config.REGISTRATION_START_DATE, 'REGISTRATION_START_DATE')
    const endDate = asInclusiveEndDate(config.REGISTRATION_END_DATE)

    if (startDate.getTime() > endDate.getTime()) {
        throw new Error('REGISTRATION_START_DATE must be before or equal to REGISTRATION_END_DATE')
    }

    const registrationYear = endDate.getUTCFullYear()

    return {
        startDate,
        endDate,
        registrationYear
    }
}

export function isRegistrationOpenAt(startDate: Date, endDate: Date, now = new Date()) {
    const nowMs = now.getTime()
    return nowMs >= startDate.getTime() && nowMs <= endDate.getTime()
}
