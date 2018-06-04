 var exp=require('express');
 var app=exp();
 app.use(exp.static('public'));
 var ejs=require('ejs');
 app.set('view engine','ejs');

var mongojs=require('mongojs');
var db=mongojs('mongodb://punith29:123456a@ds016718.mlab.com:16718/punith29',['project']);

app.set('port',process.env.PORT||5000)

 var bodyParser=require('body-parser');
 app.use(bodyParser.urlencoded({extended:false}));
 var session=require('express-session');
app.use(session({secret:'key'}));

 app.get('/',function(req,res){
 	if(req.session.login==true){
    var docc={
      username:req.session.username
    }
 		 db.project.find(docc,function(error,newdoc1){
      res.render('messages',{messages:newdoc1,user:docc});
 })

 	}
  else{
 	res.sendFile(__dirname+'/public/project.html');
    }
 })
 app.get('/register',function(req,res){
 	   if(req.session.login==true){
      var docc={
        username:req.session.username
      }
 	  db.project.find(docc,function(error,newdoc1){
      res.render('messages',{messages:newdoc1,user:docc});
    })

 	   }
 	   else{
 	   res.sendFile(__dirname+'/public/register.html');
 	   }
 })
 app.get('/login',function(req,res){
 	  if(req.session.login==true){
 	  	var docc={
        username:req.session.username
      }
      console.log(req.session.username);
       db.project.find(docc,function(error,newdoc1){
      res.render('messages',{messages:newdoc1,user:docc});
 })

 	  }
 	  else{
 	  res.sendFile(__dirname+'/public/projectlogin.html');
      }
 	
 })
 app.get('/aboutus',function(req,res){
 	
 	res.sendFile(__dirname+'/public/aboutus.html');
 	
 })
 app.get('/contactus',function(req,res){
 
 	res.sendFile(__dirname+'/public/contactus.html');
 
 })
 app.post('/registerdetails',function(req,res){
  
  var doc={
 		name:req.body.name,
 		email:req.body.email,
 		username:req.body.username,
 		password:req.body.password

 	}
  console.log(req.body.username);
  db.project.find({username:req.body.username},function (er,newdoc) {
    if(newdoc.length==0){
  console.log(req.body.username);

 	db.project.insert(doc,function(err,docs){
 		if(err){
 			res.redirect('/register');
 		
 			}
      else{
        res.redirect('/login');
        console.log('inserted');
      }

 	}) 
 }
 else{
  res.send('Username already exists');
 }
 })
 })
 app.post('/logindetails',function(req,res){
  req.session.login=false;
 	var doc2={
    username:req.body.username,
    password:req.body.password
  }
  db.project.find(doc2,function(err,newdoc){
  	if(newdoc.length>0){
  		req.session.login=true;
   	  	req.session.username=newdoc[0].username;
  		db.project.find({username:req.body.username},function(error,newdoc1){
  		res.render('messages',{messages:newdoc1,user:newdoc});
     })
  	}
  	else{
  		res.send('your email or password went wrong');
  	}
  })

 })
/* app.get('/forgotpassword',function(req,res) {
    var docfp={
      //email: 
    }
 })*/


app.get('/logout',function(req,res){
	req.session.destroy(function(){
    console.log('session destroyed');
	})
	res.redirect('/login');
})

app.get('/user/:usern',function (req,res) {
    db.project.find({username:req.params.usern},function (error,newdoc) {
      if(newdoc.length==0){
        res.send("User name doesn't exist");
      }
      else{
        req.session.user=newdoc[0].username;
        //req.session.i=newdoc.messages.length;
        res.render('send',{result:newdoc});
      }
      
    })


})
app.post('/sent',function (req,res) {
 var docc={
  username:req.body.username
 }
 db.project.find(docc,function (e,doc) {
  if(doc.length>0){
    var u=req.session.user;
    var doc3={
      username:req.body.username,
      name:req.body.name,
      message:req.body.message
    };
    
    db.project.insert(doc3,function (error,docs) {
      if(error){
        res.send('Not sent');
      }
      else{
        res.render('send',{result:doc})
      }
    })
  }
  else{
    res.send('Error in sending a message');
  }
 })
   })



/*app.get('/changepassword',function (req,res) {
    var doc={
      current
    }
})*/



app.listen(app.get('port'),function(){
	console.log(' server is listening ')
});
 
 			
 		
 	
 
