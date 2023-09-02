// Copyright © Elnaz Abolahrar, 2011

// translation_quiz.js, assumes that quiz_support.js has also been loaded

/*-------------------------------------- Configuration Variables --------------------------------------*/

var pass_percentage = 0.75;
var min_no_questions = 10;
var exam_quesNo = 10;  // sets the number of questions appearing in an exam
var max_answer_times = 1; // the max limit for the user to increase his/her score


/*-------------------------------------- other Variables --------------------------------------*/

var grammar;
var question_lang;
var answer_lang;

//saves the random tree generated by the server in generate_question function to be used by the check_answer
var rand_tree;  

var counter;
var score;
var confirmed_check = new Boolean(true);
var prev_pressed = new Boolean();

var prev_question;
var prev_explanation;
var prev_answer;
var prev_hint;
var current_question;
var current_answer;
var current_explanation= "";
var current_hint;

//for history
var quiz_history = [];
var history_shown= new Boolean();
var index =0;

//for check answer
var answer_was_right= new Boolean();
var raw_user_answer;
var user_answer;
var user_answer_splited;
var server_answer;
var all_answers = [];
var parsed_trees = 0;
var words_hidden = new Boolean();

var answer_times ;
var hint_times ;
var hint_pressed = new Boolean();
var restart_active = new Boolean();
var is_ended = new Boolean();
var info_hidden = new Boolean();

//modes variables 
var have_minibar = new Boolean();
var have_prevQuestion = new Boolean();
var have_checkAns = new Boolean();
var max_hint_times;
var selected_mode;

/*-------------------------------------- Functions --------------------------------------*/
	

function default_values()
{     
  //resets the question, answer and the explanation and hint display areas
    document.question.question_text.value= "Quiz questions will be displayed here.";
    document.answer.answer_text.value = " ";
    document.explanation.explanation_text.value= "Explanations are displayed here.";  
    document.getElementById("hint_txt").innerHTML = ""; 
	
  //resets some flags
    prev_pressed = false;
    is_ended = false;  //refering to the End button or end o quiz by score or end of exam
    restart_active = false;  //refering to the Restart button
	hint_pressed = false;  
	answer_was_right= false;
	history_shown= false;
	  
  //resets the counter and score displays and some variables
    answer_times = 1;
    counter = 0;
    score = 0;
    hint_times =0;
    document.getElementById('counter_display').value = counter;
    document.getElementById('score_display').value = score;
	
  //resets the variables for keeping the history	
	quiz_history = [];
	index =0;
	var history=element("history_part");
	history.innerHTML ="";
	
  //resets the variables for keeping the parsing and linearization altenatives		
	parsed_trees = 0;
    all_answers = [];
	
  //shows the normal user answer area	
    show_element("user_answer");
}

function start_quiz()
{
   //sets the grammar and From and To languages
	grammar= minibar.grammar_menu.value;
	question_lang= minibar.from_menu.value;
	answer_lang= minibar.to_menu.value;
      
   //removes the start button  	
     minibar.quizbar.removeChild(minibar.quizbar.lastChild);	  	
   
   set_mode();
   	 
	//shows the minibar area and buttons	
	var buttons_bar=element("buttons_bar");			
    if (have_minibar)
      {
	   //show the minibar word magnets
         show_element("minibar_contin");
		   
	   //show the delete and clear buttons
	     show_element("minibar_buttons");
				 
	   //hides the normal user answer area	 
	     hide_element("user_answer");
		 
	   //changes the "Check Answer" button to a none_submit one
         buttons_bar.removeChild(buttons_bar.lastChild);
		 appendChildren(buttons_bar,
		   [ button("Check Answer","check_answer_quiz()","C", "check_answer")]);
	   }
	else
	  { 
	    //enable the user answer area	
	    document.getElementById('user_answer').disabled = false;
	  
	   //hide the minibar word magnets
         hide_element("minibar_contin");
		   
	   //hide the delete and clear buttons
	     hide_element("minibar_buttons");
	  
	  //changes the "Check Answer" button to a submit one
	    buttons_bar.removeChild(buttons_bar.lastChild);
		 appendChildren(buttons_bar,
		   [ submit_button("Check Answer", "check_answer")]);
		}
	   
	//conditionally enbles the "Hint", "Check Answer", "Next Question" and "Previous Question" buttons, and the minibar

    if (have_checkAns)
	   document.getElementById('check_answer').disabled = false;
	else
	   document.getElementById('check_answer').disabled = true;
	  
    if (have_prevQuestion)
	   document.getElementById('previous_question').disabled = false;
		
    if ( max_hint_times > 0 )		
	   document.getElementById('hint').disabled = false;
			
    document.getElementById('next_question').disabled = false;
		  
	//generates the first quiz question
	  generate_question();	

    //resets the restart_active
	  restart_active= true ;	  
	  
	//hides the information
    if ( info_hidden == false )	
	    toggle_info();
}

function restart_quiz()
{
  //javascript:location.reload(true);
 
   if (restart_active == true)
     { 
	   var end_confirmed= new Boolean(true);
	  
	   if (!is_ended )
	      end_confirmed = confirm(" Are you sure you want to quit this quiz!");
	  
	   if (end_confirmed)  
	     {
		  end_quiz(false);
		  
	      reset_mode();
			
	      //add the start button
		    appendChildren(minibar.quizbar,[ button("Start Quiz","start_quiz()","S")]);
		  
		  //removes the History button
	      var history_bar=element("history_bar");
		  history_bar.removeChild(history_bar.lastChild);
		  
          default_values();
		  }
	  }
}

function generate_question()
{  
 //for the exam mode   
   if (selected_mode == "Exam Mode")
    { 	
       if (check_notEmpty())
         {
	       if (counter > 0)
	          {  			
				document.getElementById('score_display').value = "?";
				
			   //save the current user answer for history
	             current_answer = document.answer.answer_text.value;  
		         quiz_history[index][1] = current_answer;
		
				make_all_answers();
		        }
		   else
		      exam_continue();
	    }
	}
  else
    {
	   if (prev_pressed == true )
	       {
	         //changes the question, answer and the explanation back to the current one
		       document.question.question_text.value= current_question;
		       document.answer.answer_text.value = current_answer;
		       document.explanation.explanation_text.value= current_explanation;
		       document.getElementById("hint_txt").innerHTML = current_hint;
		 
		     prev_pressed = false; // to go back to normal	 
		 
	         //enables the "Previous Question","Hint" and "Check Answer" buttons
		       document.getElementById('previous_question').disabled = false;
		       document.getElementById('check_answer').disabled = false;
		       document.getElementById('hint').disabled = false;
	        }
	   else
	       {  
	         // if the user clicks the "Next Question" without cheking his/her previous answer, 
	         // asks for user's confirmation before moving to the next question
		     if ( answer_times == 0 )
		        {
		          confirmed_check = confirm("Are you sure you don't want to check your answer's correctness!");
			
		          if ( hint_times == 0 )
			         {
			           //saves the current answer and the explanation which is null(the answer was not checked or hinted)   
			            current_answer = document.answer.answer_text.value; 
							
		                current_explanation = "You did not check your answer's correctness!"; 
						
			            current_hint = "";
			           }
				 //save the current user answer for  history 
		           quiz_history[index][1] = document.answer.answer_text.value;  
						 
				 //save the current explanation for  history 
		           quiz_history[index][2] = "You did not check your answer's correctness!";
		         }
		     if (confirmed_check == true )
		        {		
		          //save the current question for the "previous question" button and history
			        prev_question = current_question; 
			
		          //save the current answer for the "previous question" button
			        prev_answer = current_answer; 
				
		          //save the current explanation and hint for the "previous question" button
		          	prev_explanation = current_explanation; 
		          	prev_hint= current_hint;
				
		          //clears the question, answer and the explanation and hint display areas
			        clearing(); 

                  if (have_minibar)	
                      {				  
						minibar.clear_all();
						
                        //unhides the words area and removes the "Show Magnets" button	
				        show_word_magnets();
						}
					   
				  if (answer_was_right) //here it still contains info about the previous question
				      document.explanation.explanation_text.value= current_explanation;
					  
		          //resets the times user has answered to the current question
		            answer_times = 0;	
			   
	              //resets the times user has pressed hint for the current question
		            hint_times = 0;	
					
				  document.getElementById('counter_display').value = counter;	
		          //increments the counter
		            counter= ++ counter;
					
				  //sends a question retrival request to the server
		            server.get_random(generate_question2);
		        }
		    }
	}
  //sets the focus on the answer area
	document.answer.answer_text.focus();  
}

function generate_question2(random_trees)
{
  //we now have a random abstract syntax tree that we need to linearize
    server.pgf_call("linearizeAll",{tree:random_trees[0].tree,
                               to:question_lang}, generate_question3);
    rand_tree= random_trees[0].tree;
}

function generate_question3(random_texts)
{  
    var no_of_lins = random_texts[0].texts.length;
	
    //generates a random number, to determine which linearization should be used as the question
	  var which= Math.floor(Math.random()* no_of_lins );
	  if (which >= no_of_lins)
	      which = which - 1;
	  
	//display the new quiz quetion sent by server
      document.question.question_text.value= counter +". " + random_texts[0].texts[which];
	
    //save the current question for the "previous question" button and history
      current_question = document.question.question_text.value; 
      index  = quiz_history.length;
	  quiz_history[index] = [];
	  quiz_history[index][0]= current_question;	  
}
	 
function check_answer_quiz()
{ 
  if (check_notEmpty())
    {  	 
	  //resets the user confirmation for moving to next question without checking the answer
	    confirmed_check = true;
		   
	  //clears the explanation and Hint display area
	    document.explanation.explanation_text.value = "";
	    document.getElementById("hint_txt").innerHTML = ""; 
	  
	  //save the current user answer for the "peivious question" button and history
	    current_answer = document.answer.answer_text.value;  
		quiz_history[index][1] = current_answer;
		
	  //increments the times the user has answered to the current question
	    answer_times ++;	
		
	  //resets the hint_pressed flag
		hint_pressed = false;
			
      if ((answer_times + hint_times) <= 1)		
		  make_all_answers(); 
	  else	
          continue_checking();		
	 }
}

function make_all_answers()
{
  //resets the variables for keeping the parsing and linearization altenatives		
	parsed_trees = 0;
	all_answers = [];		
      		
  //we now need to linearize the random abstract syntax tree in order to 
  //find all possible correct answers then we check user's answer against these answers.
	server.pgf_call("linearize",{tree:rand_tree, to:question_lang}, parse_answer);
}

function parse_answer(right_answer)
{
  server.parse(question_lang,right_answer[0].text, parse_answer2);
}

var trees_to_go;
function parse_answer2(parsed_answer)
{
  trees_to_go = parsed_trees = parsed_answer[0].trees.length; 
  var j =0;
  for (j= 0; j < parsed_trees ; j++)
       {
         server.linearizeAll(parsed_answer[0].trees[j], answer_lang, collect_answers);
        }
}

function collect_answers(lin_answer)
{
   var next= 0;
   var i=0;
   for (i= 0; i < lin_answer[0].texts.length ; i++)
      {
        next = all_answers.length;
        all_answers[next]= lin_answer[0].texts[i];
       }
	   
	trees_to_go--;
    if(trees_to_go == 0)	
	     continue_checking();
}	   
	   
function continue_checking()
{
    if (selected_mode == "Exam Mode") 
	    {
	     check_answer_exam2();
		 exam_continue();
		 }
    else	
	    if (hint_pressed)
		    show_hint2();
		else
            check_answer2();
} 

function check_answer2()
{  
  if (have_minibar)	
      hide_word_magnets();
  
  raw_user_answer= document.answer.answer_text.value;
  user_answer = remove_unwanted_characters(raw_user_answer);
  answer_was_right= false;
  var k = 0 ;
  for (k= 0; k < all_answers.length; k++)
      {
	    server_answer = remove_unwanted_characters(all_answers[k]);
  
	    if ( user_answer == server_answer )
	       {	
		     if (answer_times <= max_answer_times)
		       {
			      //increments the score
			        score ++; 
			      document.getElementById('score_display').value = score;
			     }
				 
		     document.explanation.explanation_text.value = "Yes, that was the correct answer."; 
			 answer_was_right= true;
			  
			 break;
			 
		    }		
	    }

  if (k >= all_answers.length) 
	{
	  document.explanation.explanation_text.value= "No, the correct answer(s) is(are): \n "
	                                                                           + all_answers;  
      document.getElementById('counter_display').value = counter;																			   
	  }
	  
   //save the current explanation for the "previous question" button and history
	 current_explanation = document.explanation.explanation_text.value;
	 quiz_history[index][2] = current_explanation;
 
   if ((counter >= min_no_questions) && ((score/counter) >= pass_percentage))
       {
	     if (answer_was_right)  
	        document.explanation.explanation_text.value += "\nAlso, ";
		 else
		    document.explanation.explanation_text.value += "\nHowever, ";
			
         document.explanation.explanation_text.value += "Congratulations!!! You passed the quiz. Click \"Restart Quiz\" for a new one.";   
         
		 document.getElementById('counter_display').value = counter;
		 
		 end_quiz(false);   
        }
   else
      if (answer_was_right)
	    {  
	     //goes to the next question automaticly after getting the correct answer
		   generate_question();
		 }

  //save the current hint for the "previous question" button
    current_hint = document.getElementById("hint_txt").innerHTML ;  
}

function check_answer_exam2()
{ 
 
  raw_user_answer= document.answer.answer_text.value;
  user_answer = remove_unwanted_characters(raw_user_answer);

  var k = 0 ;
  for (k= 0; k < all_answers.length; k++)
      {
	    server_answer = remove_unwanted_characters(all_answers[k]);
  
	    if ( user_answer == server_answer )
	       {	
			  //increments the score
				score ++; 
				
			  //save the current explanation for history
	            current_explanation = "Yes, that was the correct answer."; 
	            quiz_history[index][2] = current_explanation;
				
              break;			  
			 }
		}	 
        
  if (k >= all_answers.length) 
	  {
	    //save the current explanation for history
	      current_explanation = "No, the correct answer(s) is(are): \n " + all_answers; 
	      quiz_history[index][2] = current_explanation;		
		} 
}

function exam_continue()
{
  if (counter >= exam_quesNo)
	 exam_result();
  else			 
	{ 
		//clears the question and answer and the explanation and hint display areas
          clearing();				  
				   
		document.getElementById('counter_display').value = counter + "/" + exam_quesNo;   
		//increments the counter
		  counter= ++ counter;
				 
		//sends a question retrival request to the server
		  server.get_random(generate_question2);
	  }
}

function exam_result()
{
   document.getElementById('score_display').value = score;
   document.getElementById('counter_display').value = counter + "/" + exam_quesNo;
   document.explanation.explanation_text.value= "That's the end of exam."; 
   end_quiz(false); 
}				 

function show_hint()
{   
  if (hint_times < max_hint_times)
   {
     if (check_notEmpty())
	    {  	 
	      //clears the explanation and Hint area
	        document.explanation.explanation_text.value = "";		   
	        document.getElementById("hint_txt").innerHTML = ""; 
			   
	     //increments the times the user has pressed hint button
	       hint_times= ++ hint_times; 
			  
	     //resets the user confirmation for moving to next question without checking the answer
	       confirmed_check = true;
		  
	     //save the current user answer for the "peivious question" button
	       current_answer = document.answer.answer_text.value;  
		  
		  //sets the hint_pressed flag
		    hint_pressed = true;
			
		 raw_user_answer= document.answer.answer_text.value;
         user_answer = remove_unwanted_characters(raw_user_answer);
         user_answer_splited = split_to_words(user_answer); 
		  
		 if ((answer_times + hint_times) <= 1)		
		   make_all_answers(); 
	     else	
           continue_checking();	   
	    }
    }  
  else
	{
 	 //Error message (max_hint_times is passed)
	   document.explanation.explanation_text.value = "Sorry, you have already used up your allowed number of hints for this question.";
 	 }
}

function show_hint2()
{  
	var best_answer = new Array();
	best_answer= find_closest(all_answers);
	
	var compared = new Array();
	compared = string_matching(best_answer, user_answer_splited);
	
    //preparing the Hint spans
      var hint = element("hint_txt");
      hint.innerHTML = "<b>Hint: </b>";
      var max_length = Math.max(best_answer.length, user_answer_splited.length);
      for (k= 0; k < max_length; k++)
	    {  
	       var id = "word" + k.toString();
	       var word_span= span_id(id);
	       hint.appendChild(word_span);
		 } 
		 
	var k=0;
	var visited = new Array();
    for (k= 0; k < best_answer.length; k++)
	  {	
	    visited[k] = 0;
	   }
		
    var i= 0;   //i is used for the user_answer
    var myid = "";
    while ( i < compared.length)
	    {
		   myid = "word" + i.toString();
		   if (compared[i] == 0)
			 { 
			    var j =0;    //j is used for the server_answer
			    while (j < best_answer.length)
					{
					  if (visited[j] == 0 && user_answer_splited[i] == best_answer[j] && (j >= compared.length || compared[j] == 0 ))
						{
						 //yellow for the right word in wrong place
						   document.getElementById(myid).style.color="#FFFF00"; 
						 visited[j] = 1;
						 break;
						 }
					  j++;
					 }
				
	            if ( j >= best_answer.length)
				    {		
					  //red for the totaly wrong word
					  document.getElementById(myid).style.color="#FF0000"; 
				     }
			   }
		   else
		       {  //green for the right word in right place
                           document.getElementById(myid).style.color="#339933";				
		       }
                   document.getElementById(myid).innerHTML = user_answer_splited[i] + " ";		   
		   i++;
		 } 	
		 
	while ( i < best_answer.length)
		{
		  myid = "word" + i.toString();
		  document.getElementById(myid).style.color="#FF0000";
		  document.getElementById(myid).innerHTML = "____ ";
		  i++;
		 } 
  	
	//save the current explanation and hint for the "previous question" button
	  current_explanation = document.explanation.explanation_text.value;
	  current_hint = document.getElementById("hint_txt").innerHTML ;  
}

function previous_question_quiz()
{
    if ( counter > 1)
 	   {
          if ( answer_times == 0 && hint_times == 0 )
	         {
		       //sets the current answer and the explanation and hint   
		         current_answer = document.answer.answer_text.value;   
		         current_explanation = ""; 
		         current_hint = "";
		      }

	      //disables the "Previous Question","Hint" and "Check Answer" buttons
	        document.getElementById('previous_question').disabled = true; 
	        document.getElementById('check_answer').disabled = true;
	        document.getElementById('hint').disabled = true;

	      //changes the question, answer and the explanation 
	        document.question.question_text.value= prev_question;
	        document.answer.answer_text.value = prev_answer;
	        document.explanation.explanation_text.value= prev_explanation;
	        document.getElementById("hint_txt").innerHTML = prev_hint;
				 
	      prev_pressed = true; // to remember the current question, answer and explanation	    
	    }
}

function end_quiz(confirm_needed)
{
  if (restart_active == true && is_ended == false)
    {
	   var end= new Boolean(true);
	   
	   if (confirm_needed)
          end = confirm(" Are you sure you want to quit this quiz!");
       		  
       if (end)  
	    {  
		   if (have_minibar)	
		     {
		      //removes the "Show Magnets" button if exists	  
		        show_word_magnets();
			  //remove the minibar word magnets if there was any	
	            remove_minibar(); 
			  //shows the normal user answer area	
	            show_element("user_answer"); 
			  }
           disable_all();
           is_ended = true;  
           
		   //adds a Show Quiz History button
           var history_bar=element("history_bar");
           appendChildren(history_bar,
		   [ button("Show Quiz History","show_history()","H", "quiz_history")]);		   
	     }
    }
}

function show_history()
{
  var current_grammar = minibar.grammar.name; // minibar.grammar.name gives the grammar name without .pgf
  var to_lang= langpart(minibar.to_menu.value,current_grammar);
  var from_lang= langpart(minibar.from_menu.value,current_grammar);
  var history=element("history_part");
  if (history_shown == false)
     {
	  var i=0;
	  for (i= 0; i < quiz_history.length ; i++)
		  { 
		   var question = text("Question" + " "+quiz_history[i][0] + "\n");
		   history.appendChild(empty("br"));
		   history.appendChild(question);
		   history.appendChild(empty("br"));
		   
		   var answer = text("Your Answer" + ":  "+ quiz_history[i][1] + "\n");
		   history.appendChild(answer);
		   history.appendChild(empty("br"));
		   
		   var explan = text("Explanation" + ":  "+ quiz_history[i][2] + "\n");
		   history.appendChild(explan);
		   history.appendChild(empty("br"));
		   history.appendChild(empty("br")); 
		   }
		history_shown = true;
		}
	   
	var history_content = history.innerHTML;
	
	var history_window = window.open('', 'historyPopup', "dependent = 1, scrollbars=1, location=1, statusbar=1, width=540, height=650, left = 10, top = 20");
	history_window.document.writeln('<html><head><title>Quiz History</title></head><body>');
	history_window.document.writeln('<h3> Your Quiz History </h3>');
	history_window.document.write('<b> Quiz Mode: </b>');
	history_window.document.write(selected_mode+ ",  ");
	history_window.document.write('<b> Grammar: </b> ');
	history_window.document.write(" "+ current_grammar +",  ");
	history_window.document.write('<b> From: </b>');
	history_window.document.write(" "+ from_lang + ",  ");
	history_window.document.write('<b> To: </b>');
	history_window.document.writeln(" "+ to_lang);
	history_window.document.writeln('<div style="font-size:18px;">');
	history_window.document.writeln(history_content);
	history_window.document.writeln('</div>');
	history_window.document.writeln('<div style="color: #2E8B57; font-size:16px; font-weight: bold;"><a href="javascript: window.print()">Print History</a></div>');
	history_window.document.writeln('<div style="padding-left: 320px; color: #2E8B57; font-size:16px; font-weight: bold;"><a href="javascript: window.close()">Close page</a></div>');
	history_window.document.writeln('</body></html>');
	history_window.document.close();
} 
