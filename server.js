var express = require('express');
var app=express();
var nodemailer= require('nodemailer');
var mongodb = require('mongodb');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Db=require('mongodb').Db;
var BSON=require('mongodb').BSONPure;
var Server=require('mongodb').Server;
var client=new Db('healthdata' , new Server('127.0.0.1',27017),{safe:false});
client.open(function(err,pClient)
                {

                        client.collection('userdetails',function(err,collection)
                        {
                                Ucollection=collection;

                        });
                });

var MemStore=express.session.MemoryStore;
passport.use('local', new LocalStrategy({},

	      	function(username, password, done) 
		{

			Ucollection.find({"Email":username,"Password":password,"Active":"A"}).toArray(function(err,result)
			{
				if(result.length == 0 )
				{
					return done(null, false, { message: 'Incorrect username.' });

				}else
				{

					 return done(null, {"id":result[0]._id,"username":result[0].Name});
				}
			});
		}
    ));

passport.serializeUser(function(user, done) 
{
	console.log(JSON.stringify(user));
	done(null, user.id);
});

passport.deserializeUser(function(username, done) 
{
	console.log("username is "+username);
    	done(null, username);
});

app.configure(function()
{
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.cookieParser());
    app.use(express.session({key: 'session', secret: 'secret', store: MemStore({reapInterval: 60000 * 10,})}));
    app.use(passport.initialize());
    app.use(passport.session());
});

app.get('/', function(req, res) 
{
	console.log("loginpage");   
        res.sendfile('./Login.html');
});
app.get('/signup.html',function(req,res)
{
        res.sendfile('./signup.html');
});
app.get('/Login.html',function(req,res)
{
        res.sendfile('./Login.html');
});
app.get('/*.(js|css)', function(req, res)
{

        res.sendfile('./'+req.url);

});
app.get("/denovomainpage",function(req,res)
{
	console.log("data");
        res.sendfile('./denovo.html');
});
app.post('/registration',function(req,res)
{
    var name=req.body['fullname'];
    var emailid=req.body['email'];
    var password=req.body['password'];
    console.log(name+","+emailid+","+password);
    Ucollection.find({'Email':emailid}).toArray(function(err,results)
    {
    		if(results.length > 0 )
                {
                	res.writeHead(200,{'Content-Type':'text/html', 'Access-Control-Allow-Orgin':'*'});
                        res.write(JSON.stringify({status:"available"}));
                        res.end();

                }else
                {

                        Ucollection.insert({"Name":name,"Email":emailid,"Password":password,"Active":"I"},function(err,result)
			{
				var email=result[0].Email;
				var id=result[0]._id;
				var transport = nodemailer.createTransport("SMTP",
                        	{
                                	service: 'Gmail',
                                	auth:
                                	{
                                        	user: "silvesterprabu25@gmail.com",
                                       		pass: "silvesterprabu"
                                	}
                       		});
				var message =
                        	{

                                	from: 'denovonow.com',
                                	to:email,
                                	subject: 'Confirm your registration',
                                	headers:{'X-Laziness-level': 1000},
                                	text: 'Welcome to denovo.com!',
                                	html:   '<p>Welcome to <b>denovo.com</b></p><br/>'+'To confirm your registration please click this link'+'(if link is not clickable, copy and paste it to your browser):<br/>'+'http://127.0.0.1:8081/confirmation/'+id+'</p><br/>'+'<p>Thank you,<br/>www.denovo.com</P>',
                       		}
				transport.sendMail(message, function(error)
                        	{
                                	if(error)
                                	{
                                        	console.log('Error occured');
                                        	console.log(error.message);
                                       		return;
                                	}else
                                	{
                                        	console.log('Message sent successfully!');
                                        	res.writeHead(200,{'Content-Type':'text/html', 'Access-Control-Allow-Orgin':'*'});
                                        	res.write(JSON.stringify({status:"success"}));
                                        	res.end();
                                	}	
                                	transport.close();
                        	});



			});
		}
    });


});
app.get("/confirmation/:id",function(req,res)
{
	var id=req.params.id;
	var obj_id = BSON.ObjectID.createFromHexString(id);
        Ucollection.update({"_id":obj_id},{$set:{"Active":"A"}},{safe:true},function(err,result)
	{
		if(result==1)
		{
			res.writeHead(302,{'Content-Type':'text/html','Access-Control-Allow-Orgin':'*','Location':'http://127.0.0.1:8081/Login.html'});
                        res.end();

		}
	});
        
});
app.post('/logindata',passport.authenticate('local', { successRedirect: '/denovomainpage',
                                                       failureRedirect: '/',

                                                    })

);
app.listen(8081,"127.0.0.1");
