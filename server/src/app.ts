import express, {Application, Request, Response} from 'express';
const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt');
import jwt, { JwtPayload } from 'jsonwebtoken';
const crypto = require('crypto');
const cors = require('cors')

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const app: Application = express();
const prisma = new PrismaClient();

const PORT: number = 8080;
const SECRET_KEY = generateSecretKey();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response): void => {
    res.send("hello world");
});


//ALL USER RELATED ROUTES

//route to register a new user
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


//route to login
app.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password }: { username: string; password: string } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { username } });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Create a JWT with user information
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY);
  
      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get user information based on the JWT token for the currently logged in user
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
  
//route to fetch all the users
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

//middleware to fetch the id of user from JWT token
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

//route to add a new note to the database for the currently logged in user
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

//route to fetch the notes for currently logged in user
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


// route to edit a particular note
app.patch("/editNote/:id", extractUserId, async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const noteId = req.params.id;
  const { title, description }: { title: string; description: string } = req.body;

  try {
    // Check if the note exists and belongs to the user
    const existingNote = await prisma.note.findUnique({
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
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        description,
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error('Error editing note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//route to delete a particular note
app.delete("/deleteNote/:id", extractUserId, async(req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const noteId = req.params.id;

  try {
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId
      },
      select: {
        userId: true
      }
    });

    if(!existingNote || existingNote.userId !== userId){
      res.status(404).json({ error: "Note not found or unauthorised" });
      return;
    }

    await prisma.note.delete({
      where:{
        id: noteId
      }
    });

    res.json({ success: true, message: "note deleted successfully" });
  } catch (error) {
    console.log("Error encountered: ", error);
    res.status(500).json({ error: "Internal Server Error" })
  }
});

app.listen(PORT, (): void => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});