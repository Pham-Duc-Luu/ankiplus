export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        mongodb_main: { url: process.env.MONGODBURL || 'mongodb://localhost:27017', name: 'MAIN' },
        mongodb_bin: { url: process.env.MONGODBURL_BIN || 'mongodb://localhost:27017', name: 'BIN' },
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
