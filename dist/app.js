"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const listing_routes_1 = __importDefault(require("./routes/listing_routes"));
const offer_routes_1 = __importDefault(require("./routes/offer_routes"));
const booking_routes_1 = __importDefault(require("./routes/booking_routes"));
const split_routes_1 = __importDefault(require("./routes/split_routes"));
const payment_routes_1 = __importDefault(require("./routes/payment_routes"));
const conversation_routes_1 = __importDefault(require("./routes/conversation_routes"));
const message_routes_1 = __importDefault(require("./routes/message_routes"));
const review_routes_1 = __importDefault(require("./routes/review_routes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/listing', listing_routes_1.default);
app.use('/offer', offer_routes_1.default);
app.use('/booking', booking_routes_1.default);
app.use('/split', split_routes_1.default);
app.use('/payment', payment_routes_1.default);
app.use('/conversation', conversation_routes_1.default);
app.use('/message', message_routes_1.default);
app.use('/review', review_routes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/user', userRoutes_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Generic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});
exports.default = app;
