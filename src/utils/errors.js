// Custom error class for Authentication errors
export class AuthError extends Error {
    constructor(message, code = 'AUTH_ERROR') {
        super(message);
        this.name = 'AuthError';
        this.code = code;
    }
}

// Custom error class for Validation errors
export class ValidationError extends Error {
    constructor(message, errors = [], code = 'VALIDATION_ERROR') {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
        this.errors = errors;
    }
}

// Custom error class for Not Found errors
export class NotFoundError extends Error {
    constructor(message, code = 'NOT_FOUND') {
        super(message);
        this.name = 'NotFoundError';
        this.code = code;
    }
}

// Custom error class for Permission errors
export class PermissionError extends Error {
    constructor(message, code = 'PERMISSION_DENIED') {
        super(message);
        this.name = 'PermissionError';
        this.code = code;
    }
}

// Error codes mapping
export const ErrorCodes = {
    AUTH_ERROR: {
        status: 401,
        defaultMessage: 'Authentication failed'
    },
    VALIDATION_ERROR: {
        status: 400,
        defaultMessage: 'Validation failed'
    },
    NOT_FOUND: {
        status: 404,
        defaultMessage: 'Resource not found'
    },
    PERMISSION_DENIED: {
        status: 403,
        defaultMessage: 'Permission denied'
    }
};

// Helper function to handle errors in controllers
export const handleError = (error, res) => {
    console.error(error);

    if (error instanceof AuthError) {
        return res.status(401).json({
            status: 'error',
            code: error.code,
            message: error.message
        });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({
            status: 'error',
            code: error.code,
            message: error.message,
            errors: error.errors
        });
    }

    if (error instanceof NotFoundError) {
        return res.status(404).json({
            status: 'error',
            code: error.code,
            message: error.message
        });
    }

    if (error instanceof PermissionError) {
        return res.status(403).json({
            status: 'error',
            code: error.code,
            message: error.message
        });
    }

    // Default error handler
    return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
    });
}; 