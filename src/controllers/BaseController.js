export class BaseController {
    async handleRequest(req, res, callback) {
        try {
            await callback(req, res);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    handleError(error, res) {
        console.error(error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.errors
            });
        }

        if (error.name === 'UnauthorizedError') {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }

        // Default error response
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}