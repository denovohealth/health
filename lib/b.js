var listapp={};
var output  = [];
var ch = "";
var fname = '', eid='', pass= '',cpass='';
var valusername;
var valpassword;
var valemailid;
var email_filter    = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var username_filter = /^([a-zA-Z0-9]){0,1}([a-zA-Z0-9])+$/;		
var u=0, e =0, p=0,t=0;
/*----------------------------------------model for to send  login data---------------------------*/


listapp.logdata=Backbone.Model.extend(
{

	url:"/logindata",

});

/*------------------------------------------model for to signup data------------------------------*/

listapp.model=Backbone.Model.extend(
{

	url: "/registration",	

});


/*----------------------------view for login-------------------------------------------------*/

listapp.view=Backbone.View.extend(
{
	el:"#lmain",
	initialize:function()
	{
	},	
	events:{

		'click #lin':'logindata',
		'click #un':'hide',
		'click #pw':'hide',
	      },
	logindata:function()
	{
		var uname=$("#un").val();
		var password=$("#pw").val();
		var loginstance=new listapp.logdata();
		loginstance.save({"username":uname,"password":password},
		{
			success:function(model,res)
			{
				if(res.status=="error")
				{
					$("#logerror").html("Username and Password is Incorrect");

				}else if(res.status=="deactivated")
				{

					$("#logerror").html("Confirm Your Mailid");

				}else
				{
					window.location=res.url;
				}

			},
			error:function(model,res)
			{



			}

		});
	},
	hide:function()
	{

		$("#logerror").html('');

	},



});

var loginview=new listapp.view();

/*---------------------------------------------view for signup-------------------------------------------*/


listapp.view1= Backbone.View.extend(
{

	el: "#content",
	events:
	{
	    	"blur input#fullname": "checkfullname",
	    	"blur input#emailid": "checkemail",
	    	"blur input#passwd": "checkpass",
		"blur input#cpasswd":"confirmpass",
  		"click #formsubmit": "doSearch",
		"click #fullname ":"remove",
		"click #emailid":"remove1",
		"click #passwd":"remove2",
		"click #cpasswd":"remove3",
      	},
	remove:function()
	{
	  $("#show").html('');
	  $("#namealert").html('');
	  $("#cpassalert").html('');
	},

	remove1:function()
	{
	  $("#show").html('');
	  $("#mailalert").html('');
	  $("#cpassalert").html('');
	},
	remove2:function()
	{
	  $("#show").html('');
	  $("#passalert").html('');
	  $("#cpassalert").html('');
	},
	remove3:function()
	{
	  $("#show").html('');
	  $("#passalert").html('');
	  $("#cpassalert").html('');

	},
	checkfullname:function()
	{
		fname = $('#fullname').val();
		if(fname=='')
		{
			u=0;
		
		}else if(username_filter.test(fname) && fname.length >3 && fname.length<15)
		{

			$('#namealert').html('');
			valusername=fname;
			u =1;		

		} else
                {
			u=0;
                        $('#namealert').html('Invalid Username');
                        
                }
	
	},
	checkemail:function()
	{
		 eid=$('#emailid').val();

		if(eid=='')
		{
			e=0;

		}else if(email_filter.test(eid))
		{
			$("#mailalert").html('');
			valemailid=eid;
			e=1;
                
		}else
		{
                    	$("#mailalert").html('Invalid Mail id');
			e=0;
			
		}
			
	},
	checkpass:function()
	{
		 pass=$('#passwd').val();

		if(pass=='')
		{
			p=0;
		}else if(pass.length>5&&pass.length<15)
		{
			$("#passalert").html('');
			p=1;
			valpassword=pass;

		}else
		{
			$("#passalert").html('Password length weak');
			p=0;
		}
	},
	confirmpass:function()
	{

		cpass=$("#cpasswd").val();
		if(cpass!=pass)
		{
			$("#cpassalert").html("Password not match");
			t=0;
		}else
		{
			t=1;
		}
	},
	doSearch:function()
	{  

		
		if((fname=='')&&(eid=='')&&(pass==''&&(cpass=='')))
		{
			$("#show").html('Must fill all details');
		}
		else if(fname==''&&eid=='')
		{
			$("#show").html('Must fill all detail');
		}
		else if(fname==''&&pass=='')
		{
			$("#show").html('Must fill all detail');
		}else if(fname==''&&cpass=='')
		{

			 $("#show").html('Must fill all detail');
		}
		else if(eid==''&&pass=='')
		{

			$("#show").html('Must fill all detail');
		
		}else if(eid==''&&cpass=='')
		{
			 $("#show").html('Must fill all detail');
		}else if(pass==''&&cpass=='')
		{
			 $("#show").html('Must fill all detail');
		}
		else if(fname=='')
		{
			 $("#show").html('Must fill all detail');
		}else if(eid=='')
		{
			 $("#show").html('Must fill all detail');

		}else if(pass=='')
		{
			 $("#show").html('Must fill all detail');

		}else if(cpass=='')
		{
			 $("#show").html('Must fill all detail');
		}else
		{
			$("#show").html('');
		}
		if((u&&p&&e&&t)==1)
		{
			

			$("#show").html('');
		
			var username=$("#fullname").val();
			var emailid=$("#emailid").val();
			var password=$("#passwd").val();
			var usermail=emailid.split("@")[0];
			var model=new listapp.model();
			$("#show").css("color","blue");
			$("#show").html("Loading.......");
			model.save({fullname:username,email:emailid,password:password},
			{
				success: function(model, response)                              
				{
					var mail=response.status;		
									
					if(mail == "available")
					{
						$("#mailalert").html('');
						$('#mailalert').html("Mail Id Exist");
						$("#emailid").val('');
					}
					else 
					{
						$("#show").html('');
						$("#show").css("color","blue");
						$("#show").html("check your mail to confirm your mailid");
						$("#emailid").val('');
						$("#passwd").val('');
						$("#cpasswd").val('');
						$("#fullname").val('');
					}
                                },
                                error: function(model, response) 
                                {
                                        alert('FAIL:');
                                        alert(response);
                                }



			});
		}else
		{
		$("#show").css("color","red");
		$("#show").html('Fill The Form');
		}	
	},    		
});

var finalview = new listapp.view1(); 



