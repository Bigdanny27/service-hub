import zod from "zod"

export const validate = (schema, source = "body") => {
    return (req, res, next) => {
        let target
        if (source === "params") {
            target = req.params
        } else if (source === "query") {
            target = req.query
        } else {
            target = req.body
        }
        const result = schema.safeParse(target)

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors,
            })
        }

        if (source === "params") {
            req.params = result.data
        } else if (source === "query") {
            req.query = result.data
        } else {
            req.body = result.data
        }

        next()
    }
}

