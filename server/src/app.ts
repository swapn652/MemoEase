import express, {Application, Request, Response} from 'express';
const { PrismaClient } = require("@prisma/client")

const app: Application = express();
const prisma = new PrismaClient();

const PORT: number = 8080;

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    res.send("hello world");
});

app.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const newUser = await prisma.user.create({
            data: req.body
        });

        res.json(newUser);
    } catch(err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getUsers", async (req: Request, res: Response): Promise<void> => {
    try{
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    }catch(err){
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, (): void => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});