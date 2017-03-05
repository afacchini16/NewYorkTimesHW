var startYear = 19400101;
var endYear = 20170302;
var staticDayMonth = 0101;
// year should integer
// $("input[type=number]").numeric();

var searchObj = {
	// initializes the info that will be grabbed from the search boxes, to be compared and modified
	// in the following functions
	info: {
		searchTerm:null,
		numOfRecords:null,
		startYear:null,
		endYear:null,
	},
	// // reusable function that takes the HTML id name and will return the user's entered value
	getSearchInfo: function(fieldIdName, fieldValue){
		// will set the searchReturn equal to the value of each individual box
		this.info[fieldIdName] = fieldValue;
		
	},

	// This function will take all of the values that are retrieved from the obtainAndSet function
	getData: function(searchTerm, num, start, end, cb) {
		// public API key
		var authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931"
		var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api_key=" +
 		authKey 
 		+ "&q=" + searchTerm 
 		+ "&limit=" + num 
 		+ "&begin_date=" + start + "0101"  
 		+ "&end_date=" + end + "1231";
 		console.log("queryURL: " + queryURL);
		$.ajax({
			url:queryURL,
			method: 'GET'
		})
		// to be done after the AJAX data has loaded
		.done(function(data){
			// will obtain the user's data and write it to the html for the user to view
			obtainAndSet(data);
		})
	},


	// checks the edge cases where the user enters an incorrect start year
	checkStartYear: function(startYear){
		// sets the start year equal to 1940 if the user doesn't enter one
		if(startYear === ""){
			startYear = "1940";
		}
		// checks if the user enters a date that is before 1940 or after 2017
		if (startYear < 1940 || startYear > 2017){
			alert("Start year is out of range, please enter a number between 1940 and 2017");
		}
		// returns the startYear, either unchanged if the user entered a valid value
		// if the user entered an invalid value, the value is either changed or the user is alerted
		// if ()
		return startYear;
	},
	// checks the edge cases where the user enters an incorrect end year
	checkEndYear: function(endYear){
		// checks if the user doesn't enter an end year.  if they don't it automatically sets the end year to 2017
		if (endYear === ""){
			endYear = "2017";
		}
		// alerts the user if they entered an end year that is out of range
		if (endYear < 1940 || endYear > 2017){
			alert("End year is out of range, please enter a number between 1940 and 2017");
		}
		// returns the endYear that is either changed to 2017 or an alert if the value is out of range
		return endYear;
	},
		checkBothYears: function(startYear, endYear){
		if (startYear > endYear){
			var wrongYear = $("<div>");
			wrongYear.append("<h2>Please enter a new year </h2>");
			wrongYear.addClass(".wrongText");
			wrongYear.append()
			alert("Start year entered is later than end year. Basically, you're stupid.");
		}
	}
};


function obtainAndSet(data) {
	for (i = 0; i < searchObj.info.numOfRecords; i++){
		var results = data.response.docs;
		// create new empty elements
		var newDiv = $("<div class = 'newsElements'>");
		var numDiv = $("<span class = 'label label-primary'>");
		var title = $("<h2>");
		var source = $("<h4>");
		var section = $("<p>");
		var time = $("<p>");
		var link = $("<a>");
		
		// add text to each of the new divs
		var titleText = results[i].headline.main;
		var sourceText = results[i].byline.original;
		console.log(sourceText);
		var sectionText = results[i].section_name;
		var timeText = results[i].pub_date;
		var linkText = results[i].web_url;

		titleNum = i + 1;
		numDiv.append(titleNum);
		// title.addClass("label label-primary");
		title.append(titleText);
		source.append(sourceText);
		section.append(sectionText);
		time.append(timeText);
		link.attr("href", linkText);
		link.append(linkText);

		newDiv.append(numDiv);
		newDiv.append(title);
		newDiv.append(source);
		newDiv.append(section);
		newDiv.append(time);
		newDiv.append(link);
		newDiv.attr("id", "num" + i);

		$(".resultsArea").append(newDiv);
	}
}


	$("#searchBtn").on("click", function(){
		// gets the search term from the searchTerm textbox
		var searchTerm = $("#searchTerm").val().trim();
		// passes the searchTerm value to the getSearchInfo function
		searchObj.getSearchInfo("searchTerm", searchTerm);
		
		// obtains the number of records value from the numOfRecords form-control
		var numOfRecords = $("#numOfRecords").val();
		// passes the above value to the getSearchInfo function 
		searchObj.getSearchInfo("numOfRecords", numOfRecords);
		
		// same as both above but with startYear
		var startYear = $("#startYearTerm").val();
		console.log("startYear: " + startYear);
		searchObj.getSearchInfo("startYear", startYear);
		
		// same as above but with endYear
		var endYear = $("#endYearTerm").val();
		console.log("endYear: " + endYear);
		searchObj.getSearchInfo("endYear", endYear);

		// checks the startYear for incorrect values
		startYear = searchObj.checkStartYear(startYear);
		console.log("startYear: " + startYear);
		// checks the endYear for incorrect endYear vlaues
		endYear = searchObj.checkEndYear(endYear);
		console.log("endYear: " + endYear);
		// compares both values to make sure startYear isn't less than endYear
		searchObj.checkBothYears(startYear, endYear);

		// this will make sure that, if the user enters another search without reloading the page,
		// the results don't stack on top of each other
		$(".resultsArea").empty();
		
		// executes the AJAX call
		searchObj.getData(searchTerm, numOfRecords, startYear, endYear, obtainAndSet);
	});
	$("#clearBtn").on("click", function(){
		// empties the results if the user clicks the clearBtn
		$(".resultsArea").empty();
	});

