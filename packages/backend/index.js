import express, { json } from "express";
import { handler } from "./controller/index.js";
const PORT = process.env.PORT || 4040;

const app = express();
app.use(json());
app.post("*", async (req, res) => {
    res.send("Hello post");
    console.log(req.body);
    res.send(await handler(req));

})

app.get("*", async (req, res) => {
    // res.send("Hello get");
    res.send(await handler(req));
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log(`Server is running on port ${PORT}`);
})

