export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        mongodb: { url: process.env.MONGODBURL || 'mongodb://localhost:27017' },
    },
    jwtConstant: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '1h',
    },
});
