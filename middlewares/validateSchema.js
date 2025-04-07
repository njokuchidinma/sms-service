export default function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const field = error.details[0].context.key;
            const message = error.details[0].message;
            return res.status(400).json({ message: '', error: message})
        }
        next();
    };
}