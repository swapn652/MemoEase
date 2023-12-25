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
const app = (0, express_1.default)();
const prisma = new PrismaClient();
const PORT = 8080;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const newUser = yield prisma.user.create({
            data: req.body
        });
        res.json(newUser);
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
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
app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});
