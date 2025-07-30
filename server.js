import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage
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
let lastId = 3;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // assuming views folder exists

// API Endpoints
app.get("/transactions", (req, res) => res.json(transactions));

app.post("/transactions", (req, res) => {
  const newId = ++lastId;
  const newTransaction = { id: newId, ...req.body };
  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

app.get("/transactions/:id", (req, res) => {
  const t = transactions.find((p) => p.id === parseInt(req.params.id));
  res.json(t);
});

app.patch("/transactions/:id", (req, res) => {
  const t = transactions.find((p) => p.id === parseInt(req.params.id));
  if (!t) return res.status(404).json({ message: "Not found" });
  Object.assign(t, req.body);
  res.json(t);
});

app.delete("/transactions/:id", (req, res) => {
  const index = transactions.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });
  transactions.splice(index, 1);
  res.json({ message: "Deleted" });
});

// Frontend Routes
app.get("/", async (req, res) => {
  res.render("index", { transactions });
});

app.get("/new", (req, res) => {
  res.render("modify");
});

app.post("/api/add", (req, res) => {
  const newId = ++lastId;
  const newTransaction = { id: newId, ...req.body };
  transactions.push(newTransaction);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const t = transactions.find((p) => p.id === parseInt(req.params.id));
  res.render("modify", { transaction: t });
});

app.post("/api/edit/:id", (req, res) => {
  const t = transactions.find((p) => p.id === parseInt(req.params.id));
  Object.assign(t, req.body);
  res.redirect("/");
});

app.get("/api/transactions/delete/:id", (req, res) => {
  const index = transactions.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) transactions.splice(index, 1);
  res.redirect("/");
});

app.get("/viewTransactions", (req, res) => {
  res.render("viewtransactions", { transactions });
});
app.get("/income", (req, res) => {
  res.render("income", { transactions });
});
app.get("/expenses", (req, res) => {
  res.render("expense", { transactions });
});

app.listen(port, () => console.log(`Server running on port ${port}`));


// import express from "express";
// import bodyParser from "body-parser";
// import axios from "axios";

// const app = express();
// const port = process.env.PORT || 3000;
// // const port = 3000;
// const API_URL = "http://localhost:4000"

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static("./public"));

// app.get("/",async (req,res)=>{
//     try{
//         const response = await axios.get(`${API_URL}/transactions`);
//         console.log(response.data);
//         res.render("index.ejs",{
//             transactions : response.data,
           
//         });
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error Loading Transactions"})
//     }
    
// });
// //GET all
// app.get("/new",(req,res)=>{
//     res.render("modify.ejs");
// });

// //POST
// app.post("/api/add",async (req,res)=>{
//     try{
//         const response = await axios.post(`${API_URL}/transactions`,req.body);
//         res.redirect("/");
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error adding Transaction"});
//     }
// });

// //EDIT 
// app.get("/edit/:id",async (req,res)=>{
//     try{
//         const response = await axios.get(`${API_URL}/transactions/${req.params.id}`);
//         console.log(response.data);
//         const currentT = response.data;
//         if(req.body.title)  currentT.title = req.body.title ;  
//         if(req.body.amount)  currentT.amount = req.body.amount;  
//         if(req.body.date)    currentT.date=req.body.date;  
//         if(req.body.type)     currentT.type = req.body.type ;  
//         if(req.body.description)  currentT.description = req.body.description;
//         res.render("modify.ejs",{
//             transaction : currentT,
//         });
//     }
//     catch(error){
//         res.status(500).json({message:"Error Editing Transaction"})
//     }
   
// });
// app.post("/api/edit/:id",async (req,res)=>{
//     try{
//         const response = await axios.patch(`${API_URL}/transactions/${req.params.id}`,req.body);
//         res.redirect("/");
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error Editing Transaction"});
//     }
// })
// //--------------------------------------------------------------------------


// // DELETE
// app.get("/api/transactions/delete/:id", async (req, res) => {
//     try {
//       await axios.delete(`${API_URL}/transactions/${req.params.id}`);
//       res.redirect("/");
//     } catch (error) {
//       res.status(500).json({ message: "Error deleting transaction" });
//     }
//   });

// //NAV LINKS
// app.get("/viewTransactions",async (req,res)=>{
//     try{
//         const response = await axios.get(`${API_URL}/transactions`);
//         res.render("viewtransactions.ejs",{
//             transactions : response.data
//         });
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error Fetching transactions"});
//     }
// });
// app.get("/income",async (req,res)=>{
//     try{
//         const response = await axios.get(`${API_URL}/transactions`);
//         res.render("income.ejs",{
//             transactions : response.data
//         });
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error Fetching transactions"});
//     }
// });
// app.get("/expenses",async (req,res)=>{
//     try{
//         const response = await axios.get(`${API_URL}/transactions`);
//         res.render("expense.ejs",{
//             transactions : response.data
//         });
//     }
//     catch(error)
//     {
//         res.status(500).json({message:"Error Fetching transactions"});
//     }
// });
// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });
