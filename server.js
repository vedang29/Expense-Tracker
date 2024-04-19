import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://pbl-2.vercel.app/"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.get("/",async (req,res)=>{
    try{
        const response = await axios.get(`${API_URL}/transactions`);
        console.log(response.data);
        res.render("index.ejs",{
            transactions : response.data,
           
        });
    }
    catch(error)
    {
        res.status(500).json({message:"Error Loading Transactions"})
    }
    
});
//GET all
app.get("/new",(req,res)=>{
    res.render("modify.ejs");
});

//POST
app.post("/api/add",async (req,res)=>{
    try{
        const response = await axios.post(`${API_URL}/transactions`,req.body);
        res.redirect("/");
    }
    catch(error)
    {
        res.status(500).json({message:"Error adding Transaction"});
    }
});

//EDIT 
app.get("/edit/:id",async (req,res)=>{
    try{
        const response = await axios.get(`${API_URL}/transactions/${req.params.id}`);
        console.log(response.data);
        const currentT = response.data;
        if(req.body.title)  currentT.title = req.body.title ;  
        if(req.body.amount)  currentT.amount = req.body.amount;  
        if(req.body.date)    currentT.date=req.body.date;  
        if(req.body.type)     currentT.type = req.body.type ;  
        if(req.body.description)  currentT.description = req.body.description;
        res.render("modify.ejs",{
            transaction : currentT,
        });
    }
    catch(error){
        res.status(500).json({message:"Error Editing Transaction"})
    }
   
});
app.post("/api/edit/:id",async (req,res)=>{
    try{
        const response = await axios.patch(`${API_URL}/transactions/${req.params.id}`,req.body);
        res.redirect("/");
    }
    catch(error)
    {
        res.status(500).json({message:"Error Editing Transaction"});
    }
})
//--------------------------------------------------------------------------


// DELETE
app.get("/api/transactions/delete/:id", async (req, res) => {
    try {
      await axios.delete(`${API_URL}/transactions/${req.params.id}`);
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error deleting transaction" });
    }
  });

//NAV LINKS
app.get("/viewTransactions",async (req,res)=>{
    try{
        const response = await axios.get(`${API_URL}/transactions`);
        res.render("viewtransactions.ejs",{
            transactions : response.data
        });
    }
    catch(error)
    {
        res.status(500).json({message:"Error Fetching transactions"});
    }
});
app.get("/income",async (req,res)=>{
    try{
        const response = await axios.get(`${API_URL}/transactions`);
        res.render("income.ejs",{
            transactions : response.data
        });
    }
    catch(error)
    {
        res.status(500).json({message:"Error Fetching transactions"});
    }
});
app.get("/expenses",async (req,res)=>{
    try{
        const response = await axios.get(`${API_URL}/transactions`);
        res.render("expense.ejs",{
            transactions : response.data
        });
    }
    catch(error)
    {
        res.status(500).json({message:"Error Fetching transactions"});
    }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
