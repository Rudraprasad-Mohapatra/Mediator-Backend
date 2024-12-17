export const validateRegistration = [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    // ... other validations
];

export const validateProfile = [
    body('fullName').notEmpty(),
    body('phone').isMobilePhone(),
    // ... other validations
]; 