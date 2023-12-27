import express, {Application, Request, Response} from 'express';
const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt');
import jwt, { JwtPayload } from 'jsonwebtoken';
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


//ALL USER RELATED ROUTES

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
  
  // Route to get user information based on the JWT token
  app.get('/getCurrentLoggedInUser', (req: Request, res: Response): void => {
    const token = req.headers.authorization?.split(' ')[1];
  
    // Authorization: 'Bearer TOKEN'
    if (!token) {
      res.status(200).json({ success: false, message: 'Error! Token was not provided.' });
      return;
    }
  
    try {
      // Decoding the token
      const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string; username: string, email: string };
  
      res.status(200).json({
        success: true,
        data: {
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
        },
      });
    } catch (error) {
      res.status(200).json({ success: false, message: 'Invalid token.' });
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

//ALL NOTES RELATED ROUTES

const extractUserId = (req: Request, res: Response, next: Function): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
      try {
          const decoded = jwt.verify(token, SECRET_KEY) as { id: string; username: string, email: string };

          if (typeof decoded === 'string') {
              // In case the token is valid but only contains a string (not a JwtPayload)
              req.userId = decoded;
          } else {
              // If the token is a JwtPayload, extract the user ID
              req.userId = decoded.id;
          }
      } catch (err) {
          // Ignore errors, don't reject the request
      }
  }

  next();
};

app.post("/addNote", extractUserId, async (req: Request, res: Response): Promise<void> => {
  const {title, description} : {title: string, description: string} = req.body;
  const userId = req.userId;

  try{
    if(!userId){
      res.status(401).json({error: "Unauthorised"});
      return;
    }

    const newNote = await prisma.note.create({
      data: {
        title, 
        description,
        userId
      }
    });

    res.json(newNote);
  }catch(err){
    console.log("New err encountered: ", err);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/fetchNotes", extractUserId, async(req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    if(!userId){
      res.status(401).json({error: "Unauthorised"});
      return;
    }

    const userWithNotes = await prisma.user.findUnique({
      where:{
        id: userId
      },
      include: {
        notes: true
      }
    });

    if(!userWithNotes){
      res.status(404).json({ error: "User not found" });
      return;
    }

    const notes = userWithNotes.notes;
    res.status(200).json({ notes });
  } catch (error) {
    console.log("New error encountered: ", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.listen(PORT, (): void => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});