export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        mongodb: { url: process.env.MONGODBURL || 'mongodb://localhost:27017' },
    },
    jwtConstant: {
        secret: {
            key: process.env.JWT_SECRET_KEY || 'your-secret-key',
            expiresIn: process.env.JWT_SECRET_EXPIRATION || '1h',
        },
        public: {
            key: process.env.JWT_PUBLIC_KEY || 'your-secret-key',
            expiresIn: process.env.JWT_PUBLIC_KEY_EXPIRATION || '1h',
        },
    },
});
