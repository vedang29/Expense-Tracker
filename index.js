import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

let transactions = [
    {
        id: 1,
        title: "Electricity Bill",
        amount: "120",
        date: "2024-04-20",
        description: "Monthly electricity bill payment",
        type: "Debited",
    },
    {
        id: 2,
        title: "Bookstore Purchase",
        amount: "50",
        date: "2024-05-04",
        description: "Bought a new novel",
        type: "Debited",
    },
    {
        id: 3,
        title: "Salary",
        amount: "4000",
        date: "2024-04-10",
        description: "Monthly salary deposit",
        type: "Credited",
    },
];
var lastId = 3;

// GET all transactions
app.get("/transactions",(req,res)=>{
    console.log(transactions);
    res.json(transactions);
});

//POST new Transaction
app.post("/transactions",(req,res)=>{
    const newId = lastId + 1;
    const newTransaction = {
        id:newId,
        title:req.body.title,
        amount:req.body.amount,
        date:req.body.date,
        description:req.body.description,
        type:req.body.type,
    };
    lastId = newId;
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

// GETS A TRANSACTION
app.get("/transactions/:id",(req,res)=>{
    const index = transactions.findIndex((p) => p.id === parseInt(req.params.id));
    res.json(transactions[index]);
});

//UPDATES Transaction
app.patch("/transactions/:id",(req,res)=>{
    const transaction = transactions.find((p) => p.id === parseInt(req.params.id));
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if(req.body.title)   transaction.title = req.body.title ;  
    if(req.body.amount)   transaction.amount = req.body.amount;  
    if(req.body.date)   transaction.date=req.body.date;  
    if(req.body.type)    transaction.type = req.body.type ;  
    if(req.body.description) transaction.description = req.body.description;
    res.json(transaction);
});

//DELETE transaction
app.delete("/transactions/:id", (req, res) => {
    const index = transactions.findIndex((p) => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "transaction not found" });
  
    transactions.splice(index, 1);
    res.json({ message: "transaction deleted" });
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
