let express = require("express") ;
let app = express();
app.use(express.json ());
app.use( function (req, res, next) {
res.header("Access-Control-Allow-Origin","*");
res.header( "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
res. header( "Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept");
next();
});
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    password: "Rajesh8789kum@r",
    database: "postgres",
    port: 5432,
    host: "db.jycbwqbmmkcavrwqiqzi.supabase.co",
    ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
    console.log(`Connected!!!`);
});


app.get("/mobile/:id", function (req, res, next) {
    let id = req.params.id;
    let value = [id]

    const query = "SELECT * FROM mobiles WHERE id=$1";
    client.query(query,value, function (err, result) {
        if (err){ 
            res.status(400).send(err);
        } else{
            res.send(result.rows);
        }
    });
});

app.get("/mobiles", function (req, res, next) {
    let Brand = req.query.Brand; 
    let RAM = req.query.RAM;
    let ROM = req.query.ROM;
    let OS = req.query.OS;
    
    const query = "SELECT * FROM mobiles";
    client.query(query, function (err, result) {
        if (err){ 
            res.status(400).send(err);
        } else{
            let arr = result.rows;
            if(Brand){
                let arr1 = Brand.split(",");
                arr = arr.filter((e1)=>arr1.find(m1=>m1==e1.brand));
            }
            if(RAM){
                let arr1 = RAM.split(",");
                arr = arr.filter((e1)=>arr1.find(m1=>m1==e1.ram));
            }
            if(ROM){
                let arr1 = ROM.split(",");
                arr = arr.filter((e1)=>arr1.find(m1=>m1==e1.rom));
            }
            if(OS){
                arr = arr.filter((e1)=>e1.os==OS);
            }
            res.send(arr);  
        }
        
    });
});


app.post("/mobiles", function (req, res, next) {
    var values = Object.values(req.body);
    
    const query = `INSERT INTO mobiles(name, price, brand, RAM, ROM, OS) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(query, values, function (err, result) {
        if (err){
            res.status(400).send(err);
        }
        res.send(`${result.rowCount} insertion successful`);
    });
});

app.put("/mobiles/:id", function (req, res, next) {
    let id = req.params.id;
    var values = Object.values(req.body);
    values.push(id);
    
    const query = `UPDATE mobiles SET name=$1, price=$2, brand=$3, RAM=$4, ROM=$5, OS=$6 WHERE id=$7`;
    client.query(query, values, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }res.send(`updation successful`);
    });
});


app.delete("/mobiles/:id",function(req,res){ 
    let id  = req.params.id;
    let value=[id]
    
    const query =  "DELETE FROM mobiles WHERE id=$1";
    client.query(query, value, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} delete successful`);
    });
});