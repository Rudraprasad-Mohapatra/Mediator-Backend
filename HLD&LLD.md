

# High-Level Design (HLD) & Low-Level Design (LLD) for Mediator Application

## High-Level Design

### 1. System Architecture
````mermaid
graph TD
    A[Client Apps] --> B[API Gateway/Load Balancer]
    B --> C[Authentication Service]
    B --> D[User Service]
    B --> E[Mediator Service]
    B --> F[Chat Service]
    B --> G[Admin Service]
    C --> H[(Database)]
    D --> H
    E --> H
    F --> H
    G --> H
````

### 2. Core Services

1. **Authentication Service**
   - Registration
   - Login
   - Password Reset
   - Token Management
   - 2FA (Future)

2. **User Service**
   - Profile Management
   - Preferences
   - Search/Match
   - Reviews/Ratings

3. **Mediator Service**
   - Profile Verification
   - Case Management
   - Scheduling
   - Documentation

4. **Chat Service**
   - Real-time Messaging
   - File Sharing
   - Chat History
   - Notifications

5. **Admin Service**
   - User Management
   - Content Moderation
   - Analytics
   - System Configuration

## Low-Level Design

### 1. Database Schema
````sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('user', 'mediator', 'admin'),
    status ENUM('active', 'inactive', 'suspended'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Profiles
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    verification_status ENUM('pending', 'verified', 'rejected')
);

-- Cases
CREATE TABLE cases (
    id UUID PRIMARY KEY,
    mediator_id UUID,
    status ENUM('open', 'in_progress', 'resolved', 'closed'),
    created_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    case_id UUID,
    sender_id UUID,
    content TEXT,
    type ENUM('text', 'file', 'system'),
    created_at TIMESTAMP
);
````

### 2. API Routes Structure

1. **Authentication Routes** (`/api/auth/`)
````javascript:src/routes/authRoutes.js
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
````

2. **User Routes** (`/api/users/`)
````javascript:src/routes/userRoutes.js
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/matches', auth, getMatches);
router.post('/preferences', auth, updatePreferences);
````

3. **Mediator Routes** (`/api/mediators/`)
````javascript:src/routes/mediatorRoutes.js
router.get('/cases', auth, mediatorAuth, getCases);
router.post('/cases/:id/accept', auth, mediatorAuth, acceptCase);
router.put('/cases/:id/status', auth, mediatorAuth, updateCaseStatus);
router.get('/analytics', auth, mediatorAuth, getAnalytics);
````

4. **Chat Routes** (`/api/chats/`)
````javascript:src/routes/chatRoutes.js
router.get('/conversations', auth, getConversations);
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, sendMessage);
router.put('/messages/:id/read', auth, markAsRead);
````

### 3. Middleware Structure

1. **Authentication Middleware**
````javascript:src/middleware/auth.js
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
````

2. **Validation Middleware**
````javascript:src/middleware/validation.js
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
````

### 4. Controller Structure

1. **Base Controller**
````javascript:src/controllers/BaseController.js
export class BaseController {
    async handleRequest(req, res, callback) {
        try {
            await callback(req, res);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    handleError(error, res) {
        // Standard error handling
    }
}
````

2. **Auth Controller**
````javascript:src/controllers/AuthController.js
export class AuthController extends BaseController {
    async register(req, res) {
        // Handle registration
    }

    async login(req, res) {
        // Handle login
    }
}
````

### 5. Service Layer Structure

1. **User Service**
````javascript:src/services/UserService.js
export class UserService {
    async createUser(userData) {
        // Create user logic
    }

    async updateProfile(userId, profileData) {
        // Update profile logic
    }
}
````

2. **Chat Service**
````javascript:src/services/ChatService.js
export class ChatService {
    async sendMessage(senderId, receiverId, content) {
        // Send message logic
    }

    async getConversation(userId1, userId2) {
        // Get conversation logic
    }
}
````

Would you like me to elaborate on any specific part of this design?
