# E-Commerce API

A comprehensive e-commerce backend API built with NestJS, featuring user authentication, product management, shopping cart, order processing, and payment integration.

## Features

### Authentication & User Management
- User registration with email verification (OTP)
- Login/logout functionality
- Google OAuth integration
- Password reset via email
- JWT-based authentication
- User profiles with favorites

### Product Management
- Create products with image uploads (up to 10 images)
- Product categorization and branding
- Pricing with discount support
- Stock management
- Product search and filtering
- Redis caching for performance

### Shopping Features
- Shopping cart functionality
- Wishlist/favorites system
- Coupon system with expiration and usage limits
- Order creation and management
- Multiple payment methods (Stripe integration)
- Order status tracking
- Refund processing

### Technical Features
- File upload handling (Multer)
- Email notifications (Nodemailer)
- Data validation (Zod)
- Database connection monitoring
- Global error handling and success interceptors

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport (Local & Google OAuth)
- **Payments**: Stripe
- **Caching**: Redis
- **Email**: Nodemailer
- **Validation**: Zod
- **File Upload**: Multer
- **Language**: TypeScript

## Installation

1. Clone the repository:
`ash
git clone <repository-url>
cd e-commerce
`

2. Install dependencies:
`ash
npm install
`

3. Start MongoDB and Redis services on your system.

## Running the Application

### Development
`ash
npm run start:dev
`

### Production
`ash
npm run build
npm run start:prod
`

### Testing
`ash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
`

## API Endpoints

### Authentication
- POST /auth/signup - User registration
- PATCH /auth/confirm-email - Confirm email with OTP
- POST /auth/email-confirmation - Resend OTP
- POST /auth/login - User login
- POST /auth/forget-pass - Request password reset
- PATCH /auth/reset-pass - Reset password
- GET /auth/google/login - Google OAuth login
- GET /auth/me - Get current user info

### Products
- POST /product/create-product - Create new product (authenticated)
- GET /product/get-all-products - Get all products
- GET /product/products-with-redis - Get products with Redis caching

### Cart
- POST /cart/add-to-cart - Add product to cart (authenticated)

### Orders
- POST /order/create-order - Create new order (authenticated)
- POST /order/checkout/:orderId - Create Stripe checkout session
- POST /order/refund/:orderId - Process refund

### Categories, Brands, Coupons, Favorites
- Additional endpoints available for managing categories, brands, coupons, and user favorites

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Authentication endpoints
│   ├── auth.service.ts      # Authentication business logic
│   ├── auth.module.ts       # Authentication module configuration
│   ├── authDTO/             # Data Transfer Objects
│   ├── authValidation/      # Validation schemas
│   ├── config/              # OAuth configurations
│   └── google/              # Google OAuth strategy
├── user/                    # User management module
├── product/                 # Product management module
├── category/                # Product categories module
├── brand/                   # Product brands module
├── cart/                    # Shopping cart module
├── order/                   # Order processing module
├── coupon/                  # Coupon management module
├── favorite/                # User favorites module
├── DB/                      # Database layer
│   ├── models/              # Mongoose schemas
│   └── Repo/                # Repository pattern implementations
├── common/                  # Shared utilities and cross-cutting concerns
│   ├── guards/              # Authentication guards
│   ├── interceptors/        # Request/response interceptors
│   ├── pipes/               # Validation pipes
│   ├── services/            # Shared services (payment, etc.)
│   └── tokens/              # JWT token utilities
└── uploads/                 # Static file uploads directory
    ├── brands/              # Brand images
    ├── category/            # Category images
    └── products/            # Product images
```

## Database Models

- **User**: User accounts with authentication details
- **Product**: Product information with pricing and inventory
- **Order**: Order details with payment and shipping info
- **Cart**: Shopping cart items
- **Category**: Product categories
- **Brand**: Product brands
- **Coupon**: Discount coupons
- **OTP**: Email verification codes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED license.
