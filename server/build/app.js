"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = require('crypto');
const cors = require('cors');
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};
const app = (0, express_1.default)();
const prisma = new PrismaClient();
const PORT = 8080;
const SECRET_KEY = generateSecretKey();
app.use(express_1.default.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("hello world");
});
//ALL USER RELATED ROUTES
//route to register a new user
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        res.json(newUser);
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
//route to login
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { username } });
        if (!user || !(yield bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid username or password' });
        }
        // Create a JWT with user information
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY);
        res.json({ token });
    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route to get user information based on the JWT token for the currently logged in user
app.get('/getCurrentLoggedInUser', (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: 'Error! Token was not provided.' });
        return;
    }
    try {
        // Decoding the token
        const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        res.status(200).json({
            success: true,
            data: {
                id: decodedToken.id,
                username: decodedToken.username,
                email: decodedToken.email,
            },
        });
    }
    catch (error) {
        res.status(200).json({ success: false, message: 'Invalid token.' });
    }
});
//route to fetch all the users
app.get("/getUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prisma.user.findMany();
        res.json(allUsers);
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
//ALL NOTES RELATED ROUTES
//middleware to fetch the id of user from JWT token
const extractUserId = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            if (typeof decoded === 'string') {
                // In case the token is valid but only contains a string (not a JwtPayload)
                req.userId = decoded;
            }
            else {
                // If the token is a JwtPayload, extract the user ID
                req.userId = decoded.id;
            }
        }
        catch (err) {
            // Ignore errors, don't reject the request
        }
    }
    next();
};
//route to add a new note to the database for the currently logged in user
app.post("/addNote", extractUserId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const userId = req.userId;
    try {
        if (!userId) {
            res.status(401).json({ error: "Unauthorised" });
            return;
        }
        const newNote = yield prisma.note.create({
            data: {
                title,
                description,
                userId
            }
        });
        res.json(newNote);
    }
    catch (err) {
        console.log("New err encountered: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
//route to fetch the notes for currently logged in user
app.get("/fetchNotes", extractUserId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        if (!userId) {
            res.status(401).json({ error: "Unauthorised" });
            return;
        }
        const userWithNotes = yield prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const notes = userWithNotes.notes;
        res.status(200).json({ notes });
    }
    catch (error) {
        console.log("New error encountered: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// route to edit a particular note
app.patch("/editNote/:id", extractUserId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const noteId = req.params.id;
    const { title, description } = req.body;
    try {
        // Check if the note exists and belongs to the user
        const existingNote = yield prisma.note.findUnique({
            where: {
                id: noteId,
            },
            select: {
                userId: true,
            },
        });
        if (!existingNote || existingNote.userId !== userId) {
            res.status(404).json({ error: 'Note not found or unauthorized' });
            return;
        }
        // Update the note
        const updatedNote = yield prisma.note.update({
            where: {
                id: noteId,
            },
            data: {
                title,
                description,
            },
        });
        res.json(updatedNote);
    }
    catch (error) {
        console.error('Error editing note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//route to delete a particular note
app.delete("/deleteNote/:id", extractUserId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const noteId = req.params.id;
    try {
        const existingNote = yield prisma.note.findUnique({
            where: {
                id: noteId
            },
            select: {
                userId: true
            }
        });
        if (!existingNote || existingNote.userId !== userId) {
            res.status(404).json({ error: "Note not found or unauthorised" });
            return;
        }
        yield prisma.note.delete({
            where: {
                id: noteId
            }
        });
        res.json({ success: true, message: "note deleted successfully" });
    }
    catch (error) {
        console.log("Error encountered: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});
