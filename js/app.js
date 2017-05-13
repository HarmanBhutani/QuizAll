(function (){
	'use strict';
	angular.module("test", [])
	.controller("testController", testController)
	.service("testService", testService)
	.component("testComponent", {
		templateUrl: "js/template/questions.html",
		controller: testComponentController,
		bindings: {
			dat: '<',
			name:'<',
			cat:"=",
			quotes: "&",
			next: '&'
		}
	});

	testComponentController.$inject=['testService'];	
	function testComponentController(testService){
		var $ctrl = this;
		$ctrl.x='';
		$ctrl.counter=0;
		// $ctrl.data = [];
		$ctrl.qust_index=0;
		$ctrl.abc='';
		$ctrl.data=testService.shareDat();
		$ctrl.next = function(){
			$ctrl.cat=$ctrl.cat+1;
			$ctrl.qust_index=$ctrl.qust_index+1;
			$ctrl.total_quest= testService.total_quest();
			testService.stopCount();
			testService.startCount();
				for(var i=0; i<$ctrl.data.length; i++){
					if($ctrl.x===$ctrl.data[i]){
						
						$ctrl.counter++;
						$ctrl.x='';
						// console.log($ctrl.counter);
							
					}		
				}
				if($ctrl.qust_index==$ctrl.total_quest){

						$ctrl.counter=($ctrl.counter/$ctrl.total_quest)*100;
						testService.shareTimer_arr();	
						testService.shareAverage();
							var promise2 = testService.getQuotes();
							promise2.then(function(response){
								var a =Math.floor(Math.random() * (102-1))+1;
								// console.log(response.data.length);
								 $ctrl.abc= response.data[a].quote;
								 $ctrl.author= response.data[a].name;
								// console.log(abc);
						});
			
				}
		}

		$ctrl.back = function(){
			$ctrl.cat=$ctrl.cat-1;
			$ctrl.qust_index=$ctrl.qust_index-1;
		}



	}


	testController.$inject=['testService'];
	function testController(testService){
		var tc= this;
		tc.cat='';
		tc.head1=0;
		tc.name='';
		tc.level='';
		tc.num=10;
		tc.token='';
		tc.intro=1;
		tc.qust_index=0;
		tc.timer_sum;
		tc.opt=[];
		tc.shuffledOptions= [];
		tc.x=0;
		tc.dat=[];
		tc.question= [];
		tc.heading="Let the quiz begin!";
		tc.getdata= function(){
			console.log(tc.cat);
			tc.head1=2;
			tc.intro++;
			console.log(tc.level);
			var promise= testService.getToken();
			promise.then(function(response){
				if(response.data.response_code ==0){
					tc.token = response.data.token;
					console.log(tc.token);
					var promise2 = testService.getDat(tc.token, tc.cat, tc.level, tc.num);
					promise2.then(function(response){
						
						tc.dat= response.data.results;
						// console.log(tc.dat);
						// console.log(tc.dat[0].correct_answer);
						// console.log(tc.dat[1].correct_answer);
						// console.log(tc.dat[2].correct_answer);
						// console.log(tc.dat[3].correct_answer);
						// console.log(tc.dat[4].correct_answer);
						// console.log(tc.dat[5].correct_answer);
						// console.log(tc.dat[6].correct_answer);
						// console.log(tc.dat[7].correct_answer);
						// console.log(tc.dat[8].correct_answer);
						// console.log(tc.dat[9].correct_answer);
						testService.options(tc.dat, tc.num);
						tc.head1=1;
						tc.timer=testService.startCount();
						// console.log(tc.timer);
						tc.category=testService.shareCategory();
						tc.difficulty=testService.shareDifficulty();
						tc.shuffledOptions= testService.getOptions();

					});
				};
			});

		}

	}

	testService.$inject =["$http"];
	function testService($http){
		var ts= this;
		var data=[];
		var arr2=[];
		var category=[];
		var timer_arr=[];
		var timer_is_on=0;
		var timer_sum=0;
		var c=0;
		var t;
		var difficulty=[];
		var timer_counter=0;
		var num=0;
		var arr1=[];
		var quest = [];
		ts.getToken = function(){
			return $http({
				method: 'GET',
				url:'https://opentdb.com/api_token.php?command=request'
			});
		}

		ts.getDat = function(token1, cat, level,num){
			return $http({
				method: 'GET',
				// url:'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&token=',
				url:'https://opentdb.com/api.php?amount=&token=&category=&difficulty=&type=multiple&encode=url3986',
				params: {amount: num, token: token1, category: cat, difficulty: level,}
			});
		}
		ts.getQuotes = function(){
			return $http({
				method: 'GET',
				url:"js/quotes.json"
			});
		}

		ts.options = function(arr, number){
			data= arr;
			num=number;
			for(var i=0; i<arr.length; i++){
				category[i]= (decodeURIComponent(arr[i].category));
				difficulty[i]= (decodeURIComponent(arr[i].difficulty));
			}
			console.log(difficulty);
			for(var i=0; i<=arr.length-1; i++){
			
					arr1[i]=[];
						
					for(var j=0; j<=2; j++){
						arr1[i][j]=(decodeURIComponent(arr[i].incorrect_answers[j]));	
					}
					
			}

			for(var i =0; i<=arr1.length-1; i++){
				arr1[i].push(decodeURIComponent(arr[i].correct_answer));
				arr2[i]=decodeURIComponent(arr[i].correct_answer);
			}
						// console.log(arr1);

			for(var i=0; i<=arr1.length-1; i++){
				ts.shuffle(arr1[i]);
			}
			for(var i=0; i<=arr1.length-1; i++){ 
				arr1[i].push(decodeURIComponent(arr[i].question));
			}

		}
		ts.getOptions = function(){
			console.log(arr2);
			return arr1;
		}

		ts.shuffle = function(arr2){
			var m = arr2.length, t, i;
			for(var j=arr2.length-1; j>=0; j--){
				var a =Math.floor(Math.random() * (j + 1));
				t=arr2[j];
				arr2[j]= arr2[a];
				arr2[a]= t;
			}
		}
		ts.startCount = function(){
			if(!timer_is_on){
					timer_is_on=1;
					timedCount();
				}
			}

		function timedCount (){
			document.getElementById("timer").innerHTML = "Timer: " + c + " sec";
			c=c+1;
			t=setTimeout(function(){timedCount()}, 1000);
			// console.log(c);
			}
			ts.stopCount = function() {
    			clearTimeout(t);
    			timer_is_on = 0;
    			timer_arr[timer_counter]=c-1;
    			timer_counter++;
    			// console.log(timer_arr);

    			c=0;
			}

		ts.shareDat = function(){
			return arr2;
		}
		ts.total_quest= function(){
			return num;
		}
		ts.shareCategory = function(){
			return category;
		}
		ts.shareDifficulty = function(){
			return difficulty;
		}
		ts.shareTimer_arr = function(){
			for(var i=0; i<timer_arr.length; i++){
				timer_sum=timer_sum+timer_arr[i];
			}
			console.log(timer_sum);
			document.getElementById("timer_sum").innerHTML = "Total Time Taken: " + timer_sum + " sec";
			return timer_sum;
		}
		ts.shareAverage = function(){
			var average_time= timer_sum/num;
			document.getElementById("timer_average").innerHTML = "Average Time per question: " + average_time + " sec";
		}

	}
})();