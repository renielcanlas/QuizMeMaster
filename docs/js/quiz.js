$(document).ready(function(){
	var db = firebase.database();
	var questions = [];
	var current;
	var answer;
	var score=0;
	var qCount=0;
	var equiv=0;
	var qId = 0;
	
    //Load Questions
	loadQuestions();
	
	function loadQuestions(){
		db.ref("questions").once("value").then(function(data){
			console.log("Loaded Questions: ");
			console.log(data);
			data.forEach(function(q){
				questions.push({
					"key": q.key,
					"question": q.val()
				});
			});
			
			//Sort Questions
			questions.sort(function(a, b){return 0.5 - Math.random()});
			console.table(questions);
			
			//Load First Question
			setQuestion(qId);
			$("#loader").hide();
		});
		
	}
	
	function setQuestion(index){
		$("#qid").text("#" + (qId+1));
		answer="";
		current=questions[qId].question;
		$("#question").text(current["question"]);
		var qtype = current["type"];
		console.log("Key: " + questions[qId].key);
		console.log(current);
		console.log(qtype);
		
		switch (qtype) { 
            case "Multiple Choice":
                $("#ans").html("<div class='collection'></div>");
				
				var choices = current["choices"].split(",");
				choices.sort(function(a, b){return 0.5 - Math.random()});
				console.log(choices);
				
				for(var i=0; i<choices.length; i++){
					$("#ans .collection").append("<a href='#' class='collection-item'>"+choices[i]+"</a>");
				}
				
				$("#ans .collection a").click(function(){
					$("#ans .collection a").removeClass("active");
					$(this).addClass("active");
					answer = $("#ans .collection a.active").text();
					console.log("You selected: " + answer);
				});
				
            break;
            case "Identification":
                $("#ans").html("<div class='input-field col s12'>"+
                "<input id='correct' type='text' class='validate'>" + 
                "<label for='correct'>Answer:</label>" +
                "</div>");

                $("#correct").change(function(){
                    answer = $("#correct").val();
                });
            break;
            case "True or False":
                $("#ans").html("<div class='collection'>"+
                "<a href='#' class='collection-item'>True</a>" + 
                "<a href='#' class='collection-item'>False</a>" + 
                "</div>");

                $("#ans .collection a").click(function(){
                    $("#ans .collection a").removeClass("active");
                    $(this).addClass("active");
                    answer = $("#ans .collection a.active").text();
					console.log("You selected: " + answer);
                });
            break;
            case "Enumeration":
                $("#ans").html("<div class='collection'>"+
                "</div>" + 
                "<a id='addans' class='waves-effect waves-light btn blue'>Add answer(s)<i class='material-icons right'>send</i></a><br><br>");
				answer="[enum]:";
                $("#addans").click(function(){
                    var ans = prompt("Add Answer: ");
                    if(ans!=""){
                        $("#ans .collection").append("<a href='#' class='collection-item'>"+ans+"</a>");
                    }

                    answer="[enum]:";
                    $("#ans .collection a").each(function(){
                        answer += $(this).text() + ",";
                    });

                    if(answer.length>0){
                        answer=answer.substring(0,answer.length-1);
                    }

                    console.log("Answers: " + answer);
                });
            break;
        }
	}
	
	$("#submit").click(function(){
		
		//check correct
		
		console.log("You answered: " + answer);
		console.log("Correct answer is: " + current["correct"]);
		
		if(answer.startsWith("[enum]:")){
			//Digest array
			var correctAnswers = current["correct"].split(",");
			console.log(correctAnswers);
			alert("Correct Answers: " + correctAnswers);
			
			for(var i=0; i<correctAnswers.length; i++){
				qCount++;
				var item = correctAnswers[i];
				item = item.split(" ").join(""); //removes all spaces
				answer = answer.split(" ").join("");
				
				if(item.includes("[or]")){
					item = item.split("[or]");
					var found=0;
					for(var j=0; j<item.length;j++){
						console.log("Checking: " + item[j].toUpperCase() + " from (" + answer.toUpperCase() + ")");
						if(answer.toUpperCase().includes(item[j].toUpperCase())){
							found=1;
							console.log("found ++");
						}
					}
					
					if(found==1){
						console.log("FOUND: Score+1");
						score++;
					}else{
						console.log(found+"NOT FOUND!");
					}
					
				}else{
					console.log("Checking: " + item.toUpperCase() + " from (" + answer.toUpperCase() + ")");
					if(answer.toUpperCase().includes(item.toUpperCase())){
						console.log("FOUND: Score+1");
						score++;
					}else{
						console.log("NOT FOUND!");
					}
				}
				
				
			}
		}else{
			qCount++;
			if(answer.toUpperCase()==current["correct"].toUpperCase()){
				score++;
				alert("Correct!");
			}else{
				alert("Wrong!, the correct answer is: " + current["correct"]);
			}
		}
		
		
		//Update Score
		$("#score").text("Score: " + score + " / " + qCount);
		
		//Move to next question
		qId++;
		if(qId<questions.length){
			setQuestion(qId);
		}else{
			//Post Score
			$("#score").text("Quiz Me!");
			equiv = 0;
			score+=10;
			qCount+=10;
			equiv = (score / qCount) * 75 + 25;
			$("#main").html("<h5>You finished the review!</h5>" +
			"<h6>+10 Bonus points!</h6>" +
			"<b>Final Score: </b>" + score + " / " + qCount);
			$("#main").append("<br><b>Equivalent: </b>" + equiv + "<br><hr><br>" + 
			"<b>Equiv </b> = (Score / QuestionCount) * 75 + 25<br><hr><br>" + 
			"<a id='retake' href='index.html' class='waves-effect waves-light btn blue'>Retake Quiz Reviewer<i class='material-icons right'>refresh</i></a>");
		}
	});
	
	$("#close").click(function(){
		$("#score").text("Quiz Me!");
		equiv = 0;
		equiv = (score / qCount) * 75 + 25;
		$("#main").html("<h5>Your final score!</h5>" + 
		"<b>Final Score: </b>" + score + " / " + qCount);
		$("#main").append("<br><b>Equivalent: </b>" + equiv + "<br><hr><br>" + 
		"<b>Equiv </b> = (Score / QuestionCount) * 75 + 25<br><hr><br>" + 
		"<a id='retake' href='index.html' class='waves-effect waves-light btn blue'>Retake Quiz Reviewer<i class='material-icons right'>refresh</i></a>");
	});
	
});