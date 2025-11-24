import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-jsdoc';

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ship4WD API',
      version: '1.0.0',
      description: 'API documentation for Ship4WD - Grocery Shop Revenue Analytics',
      contact: {
        name: 'Ship4WD',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', nullable: true },
            is_verified: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Shop: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shop_name: { type: 'string' },
            user_id: { type: 'array', items: { type: 'integer' }, nullable: true },
            description: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            phone: { type: 'string', nullable: true },
            deleted: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shop_id: { type: 'integer' },
            amount: { type: 'number', format: 'decimal' },
            expense_date: { type: 'string', format: 'date' },
            deleted: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        IncomeTransaction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shop_id: { type: 'integer' },
            customer_name: { type: 'string' },
            amount: { type: 'number', format: 'decimal' },
            transaction_date: { type: 'string', format: 'date' },
            deleted: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Shops', description: 'Shop management endpoints' },
      { name: 'Shop Managers', description: 'Shop manager management endpoints' },
      { name: 'Expenses', description: 'Expense management endpoints' },
      { name: 'Income Transactions', description: 'Income transaction management endpoints' },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

