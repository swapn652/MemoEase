import express, {Application, Request, Response} from 'express';
const app: Application = express();

const PORT: number = 8080;

app.use("/", (req: Request, res: Response): void => {
    res.send("hello world");
});

app.listen(PORT, (): void => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});