import express, {Application, Request, Response} from 'express';
const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const app: Application = express();
const prisma = new PrismaClient();

const PORT: number = 8080;
const SECRET_KEY = generateSecretKey();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    res.send("hello world");
});

app.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.json(newUser);
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password }: { username: string; password: string } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { username } });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Create a JWT with user information
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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