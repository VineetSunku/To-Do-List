const express= require ("express");
const bodyParser= require ("body-parser")
const app= express();
//const mongoose=require("mongoose");
const mysql = require('mysql');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

//mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

var mysqlconnection = mysql.createConnection({
    host:'localhost',
    user:'system',
    password:'system',
    database:'test',
    multipleStatements : true
    
    });
    
    mysqlconnection.connect((err)=>{
    
    if(!err)
    {
        console.log("sonnection successful");
    }
    else
    console.log(err);
    
    })
    
const itemschema= 
{
    name:String
}
const item= new mongoose.model("item",itemschema);

const listschema= {
    name:String,
    list:[itemschema]
}
const List=new mongoose.model("List",listschema);

app.get("/",(req,res)=>{
    var today =new Date();
    var options={
        weekday:"long",
        month:"long",
        day:"numeric"
    }
    var date=today.toLocaleDateString("en-US", options);

//    item.find({}).then((add)=>{
  
//        res.render("list",{today:date,newitem:add});
   
//    }).catch((err)=>{
//     console.log(err);
//    });
   mysqlconnection.query('select * from item',(err,rows,fields)=>{
	
	if(!err)
	{
		//console.log(rows[0].item); //item - column name
		res.render("list",{today:date,newitem:rows});
		//res.send(rows); //displays json data on browser
	}
	else{
	console.log(err);
	}

})
   

   
});


app.get("/:customListName",(req,res)=>{
    const customListName=req.params.customListName;
    List.findOne({name:customListName})
    .then(function (foundList) {
        if(!foundList)
        {
            const list1 =new List({
                name: customListName,
                list:[]
            })
            list1.save();
            console.log("done succesfully");
            res.redirect("/"+customListName)
        }
        else
        {
            res.render("list",{today:foundList.name,newitem:foundList.list})
        }
    })
    .catch(function (err) {
        console.log(err);
    });

    

})



app.post("/delete", (req,res)=>{
    const itemID=req.body.checkbox;
  
//    item.findByIdAndRemove(itemID)
//    .then(function () {
//        console.log("Successfully removed");
//    })
//    .catch(function (err) {
//        console.log(err);
//    });
   mysqlconnection.query('delete from item where _id = ?',[itemID],(err,rows,fields)=>{
	
	if(!err)
	{
		console.log("deleted"); 
		
	}
	else{
	console.log(err);
	}

})

    res.redirect("/");
})


app.post("/",(req,res)=>{
    const item1= new item({
        name:req.body.add
        }) ;
 //  item.insertMany([item1]);
 //var sql = 'set @item = ?; Insert into item values(@item)' 

mysqlconnection.query('Insert into item SET?',item1,(err,rows,fields)=>{
	
	if(!err)
	{
		console.log("inserted"); 
		//res.send(rows);
		res.redirect("/");
	}
	else{
	console.log(err);
	}

})
   
})


app.listen(3000,()=>{
    console.log("i am listening");
})