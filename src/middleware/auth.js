export const auth = async (req, res, next) => {
    // Verify JWT token
    // Add user to request object
    // Handle errors
};

export const roleAuth = (roles) => {
    return (req, res, next) => {
        // Check user role
        // Allow/deny access
    };
}; 