

let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
      );
      res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
          );
          next();
        });
        
        var port = process.env.PORT||2410
        app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const {Client}=require("pg");
let {employees}=require("./empData")
const client=new Client({
    user:"postgres",
    password:"ajay1#vinay",
    database:"postgres",
    port:5432,
    host:"db.ribgtbzzuwgzkvzsyagn.supabase.co"
})
client.connect(function (res,error){
    console.log("connected !!!");
    if(error)console.log(error);
})
 app.get("/svr/employees",async function(req,res,next){
    console.log("inside /users get api1");
    let query="SELECT * FROM employees"
    client.query(query,function (err,result){
        if(err){
            res.status(400).send(err)
        }
        else{
            res.send(result.rows)
        } 
        // client.end()
    })
});

// -------------------------------------    local sql----------------
// let mysql=require("mysql")
// let connData={
//     host:"127.0.0.1",
//     user:"root",
//     password:"",
//     database:"employeesdatabase"
// }
// let {employess}=require("./empData")

// app.get("/svr/employees",function(req,res){   
//         let connection=mysql.createConnection(connData)
//         let sql="select * from employees"
//         connection.query(sql,function(err,result){
//             if(err)console.log(err);
//             else res.send(result)
//         })

// })

// -------------------------------------    local sql----------------
app.get("/svr/employees/resetData",function(req,res){
    let query="truncate table employees"
    client.query(query,function(err,result){
        if(err)console.log(err);
        else{
            console.log("table emptied success")
            resetData()
        }
    })
})

resetData=()=>{
    let empArray=employees.map(ele=>[ele.empCode,ele.name,ele.department,ele.designation,ele.salary,ele.gender])
        empArray.map(ele=>{
        console.log(ele);
        let sql1="INSERT INTO employees VALUES ($1,$2,$3,$4,$5,$6)"
        client.query(sql1,ele,function(err,result){
        })
})
}

app.get("/svr/employees/:id",function(req,res){  
        let id=req.params.id 
        let value=[id]
        let sql="select * from employees where empCode=$1"
        client.query(sql,value,function(err,result){
            if(err)console.log(err);
            else res.send(result.rows)
        })

})
app.get("/svr/employees/dept/:deptName",function(req,res){   
        let dept=req.params.deptName
        let value=[dept]
        let sql="select * from employees where department=$1"
        client.query(sql,value,function(err,result){
            if(err)console.log(err);
            else res.send(result.rows)
        })

})
app.get("/svr/employees/desg/:designation",function(req,res){   
        let designation=req.params.designation
        let value=[designation]
        let sql="select * from employees where designation=$1"
        client.query(sql,value,function(err,result){
            if(err)console.log(err);
            else res.send(result.rows)
        })

})

//for query params now
app.get("/svr/leftpanel/employees",function(req,res){   
    let designation=req.query.designation
    let department=req.query.department
    let gender=req.query.gender
    let sql="select * from employees"
    client.query(sql,function(err,result){
        if(err)console.log(err);
        else {
            let arr1=result.rows
            // console.log(arr1[0],"before");
            if(designation){
                arr1=arr1.filter(ele=>ele.designation===designation)
                // console.log("des",arr1[0]);
            }
            if(department){
                arr1=arr1.filter(ele=>ele.department===department)
                // console.log("dep",arr1[0]);
            }
            if(gender){arr1=arr1.filter(ele=>ele.gender===gender)}
            // console.log(arr1[0],"after");
            res.send(arr1)
        }
    })

})

app.post("/svr/employees",function(req,res){   
        let body=req.body
        let arr1=[body.empcode,body.name,body.department,body.designation,body.salary,body.gender]
        let sql="INSERT INTO employees VALUES ($1,$2,$3,$4,$5,$6)";
        client.query(sql,arr1,function(err,result){
            if(err)console.log(err);
            else res.send(`${result.rowCount} added successful`)
        })

})
app.put("/svr/employees/:empId",function(req,res){   
        let body=req.body
        let empId=req.params.empId
        let arr1=[body.name,body.department,body.designation,body.salary,body.gender,empId]
        let sql="update employees set name=$1,department=$2,designation=$3,salary=$4,gender=$5 where empcode=$6"
        console.log(sql);
        client.query(sql,arr1,function(err,result){
            if(err)console.log(err.message);
            else res.send(result.rowCount+"edit successfull")
        })

})
app.delete("/svr/employees/:empId",function(req,res){   
        let empId=req.params.empId
        let value=[empId]
        let sql="delete from employees where empCode=$1"
        client.query(sql,value,function(err,result){
            if(err)console.log(err);
            else res.send(result.rows)
        })

})

