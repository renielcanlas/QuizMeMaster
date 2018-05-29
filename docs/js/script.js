$(document).ready(function(){
    var ca="";
    var ch="";

    $('select').formSelect();
    $("#loader").hide();

    $("#qtype").change(function(){
        var qtype = $("#qtype option:selected").text();
        console.log("Selected " + qtype);
        ca="";
        ch="";
        switch (qtype) { 
            case "Multiple Choice":
                $("#ans").html("<div class='collection'>"+
                "</div>" + 
                "<a id='addchoice' class='waves-effect waves-light btn blue'>Add choice(s)<i class='material-icons right'>send</i></a>");
                
                $("#addchoice").click(function(){
                    var choice = prompt("Add Choice: ");
                    if(choice!=""){
                        $("#ans .collection").append("<a href='#' class='collection-item'>"+choice+"</a>");
                    }

                    ch="";
                    $("#ans .collection a").each(function(){
                        ch += $(this).text() + ",";
                    });
                    if(ch.length>0){
                        ch=ch.substring(0,ch.length-1);
                    }
                    console.log("Choices: " + ch);

                    $("#ans .collection a").removeClass("active");
                    $("#ans .collection a").click(function(){
                        $(this).addClass("active");
                        ca = $("#ans .collection a:active").text();
                        console.log("Correct: " + ca);
                    });
                });
            break;
            case "Identification":
                $("#ans").html("<div class='input-field col s12'>"+
                "<input id='correct' type='text' class='validate'>" + 
                "<label for='correct'>Correct Answer</label>" +
                "</div>");

                $("#correct").change(function(){
                    ca = $("#correct").val();
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
                    ca = $("#ans .collection a:active").text();
                });
            break;
            case "Enumeration":
                $("#ans").html("<div class='collection'>"+
                "</div>" + 
                "<a id='addans' class='waves-effect waves-light btn blue'>Add answer(s)<i class='material-icons right'>send</i></a>");

                $("#addans").click(function(){
                    var ans = prompt("Add Answer: ");
                    if(ans!=""){
                        $("#ans .collection").append("<a href='#' class='collection-item'>"+ans+"</a>");
                    }

                    ca="";
                    $("#ans .collection a").each(function(){
                        ca += $(this).text() + ",";
                    });

                    if(ca.length>0){
                        ca=ca.substring(0,ca.length-1);
                    }

                    console.log("Answers: " + ca);
                });
            break;
        }
    });

    $("#send").click(function(){
        $("#loader").show();
        var db = firebase.database();
        db.ref("questions").push({
            question: $("#question").val(),
            type: $("#qtype option:selected").text(),
            choices: ch,
            correct: ca
        },function(){
            $("#loader").hide();
            $("#question").val("");
            $("#ans").html("");
            alert("Question Saved!");
        });
    });

  });
      