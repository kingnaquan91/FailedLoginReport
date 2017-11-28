/* 1) Failed Logins Detail Report
 * 2) Failed Logins Summary Report
 * 3) BONUS: All Logins as JSON Output
 * 
 * Mark Chilewitz
 * 11/7/2017
 */

//function that allows the program to import a data file from your drive
function loadDoc(theFile) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          var textFile = xhttp.responseText;
          dataArray = putFileIntoArray(textFile);
       }
    };
    xhttp.open("GET", theFile, false);
    xhttp.send();
}

//function that puts the contents of the data file into an array
//note that the array element will be the entire row of data as one string
function putFileIntoArray (textFile){
   // split the text data rows into an array, identified by return/new line characters or tabs
   // each row of data is an array element  
   var dataObj = textFile.split('\r\n');
   return dataObj;
}

//function that takes an SID argument and looks up the SID in the employee data file
//returns the name of the employee if found
function getEmployeeName(sid){
   //search (loop) through the employee records
   
   for(var i = 0; i < employeeData.length; i++){
     if(employeeData[i].indexOf(sid) >-1){ //only return -1 if the SID is not found
        //and return the full name of the SID passed in
         return employeeData[i][i+2];
     }
     else{
        return "Employee Not Found!";
     }
   }
}

//function to track the number of failed login attempts per employee
function incrementEmployeeError(sid){
   
   //function to increment the data row of the passed in SID in the array of employees
   //when an ERROR record is identified
   //adds another column to the emp data array. The column will be the count of errors
   
   for(var i = 0; i < employeeData.length; i++){
       if(finalEmpData[i].indexOf(sid) > -1) //check if SID exists in data
       {
          if(finalEmpData[i].length == 10){ //if there isn't already an 11th column (AKA an error already logged in)
            finalEmpData[i].push(1);   
          }
          else{
             finalEmpData[i][10] ++; //add 1 error to the last column count
          }
       }
        return "Employee Not Found!";
  
   }
}


//*************** MAIN ******************

//reads the web server login data file into an array
//note that it is a csv file
var dataArray = [];
loadDoc("loginData.csv");
var loginRawDataArray = dataArray.slice(); //puts login data in a single string

//reads the employee data file into an array
//note that it is a text file
var dataArray = [];
loadDoc("employeeData.txt");
var employeeRawDataArray = dataArray.slice(); //puts employee data in a single string

//parse employee data rows into an array for searching
var employeeData = [];
for(i = 0; i < employeeRawDataArray.length; i++){
   employeeData[i] = employeeRawDataArray[i].split('\t'); //split emp data elements using the '\t' delimeter
}

//parse loginData rows into an object and store the login objects into an array
var parsedRecord = [];
var loginParsedDataArray = [];
for(var j = 0; j < loginRawDataArray.length; j++){
   //first parse the record
   parsedRecord = loginRawDataArray[j].split(','); //split raw login data elements using ',' delimeter
   
   //next create an object of the login record ...and add data elements to the object (12 columns in login data file)
   var loginRecord = {
        loginDate: parsedRecord[0],
        logintime: parsedRecord[1],
        loginFile: parsedRecord[2],
        server: parsedRecord[3],
        serverIP: parsedRecord[4],
        type: parsedRecord[5],
        portNum: parsedRecord[6],
        domain: parsedRecord[7],
        sid: parsedRecord[8],
        userIP: parsedRecord[9],
        status: parsedRecord[10],
        browser: parsedRecord[11],
      
        //next, populate the employee name from the employee file with the function you provide above
        //and add it to the employee object
   
        fullName: getEmployeeName(parsedRecord[8])//employee SID is the 8th data element in the loginData csv file
        //getEmployeeName('pass in SID')
      
   };
   
   //store the completed login object into the final array to be used for reporting
   loginParsedDataArray.push(loginRecord); //adding record to the login array
}

//get today's date - used for report header
var today = new Date();
var todaysDate = (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear();

//Detail report of Login Errors
//output report heading details - report title, date and column titles
console.log("Detailed Failed Login Report -" + todaysDate)
console.log("Date \t Time \t Server \t ServerIP \t RequestType \t Port Number \t Domain \t SID \t UserIP \t Status \t Browser");

//iterate through all login records to identify and print out the ERRORs
for(var k = 0; k < parsedRecord.length; k++){
   if(loginRecord.status == "ERROR"){
      //console.log(parsedRecord); //prints out the array of each employee record that received an error
      console.log(
        "Login Date: " +loginRecord.loginDate + "\n" +
        "Login Time: " +loginRecord.loginFile + "\n" +
        "Server: " +loginRecord.server + "\n" +
        "Server IP Address: " +loginRecord.serverIP + "\n" +
        "Request Type: " +loginRecord.type + "\n" +
        "Port Number: " +loginRecord.portNum + "\n" +
        "Domain: " +loginRecord.domain + "\n" +
        "SID: " + loginRecord.sid + "\n" +
        "User IP: " +loginRecord.userIP + "\n" +
        "Request Status: " +loginRecord.status + "\n" +
         "Browser: "+loginRecord.browser
      );
   }
}

//Summary report of Login Errors by employee
//since we already have an employee array, it is convenient to use a copy of it
var finalEmpData = [];
finalEmpData = employeeData.slice();
//output report heading details - report title, date and column titles
//iterate through all login records to identify the ERRORs and increment the SID to the employee record
for(var l = 0; l < loginParsedDataArray.length; l++){
   var record = loginParsedDataArray[l];
   
   //you should use your write and implement your incrementEmployeeError function above
   //and call that function to increment the employee record
   
   if(record.status == "ERROR"){
      incrementEmployeeError(record.sid);
   }
}


//when done incrementing employee records, print out all employee records with an ERROR array element and value
if(finalEmpData.length > 10) //if an error has already been logged
   {
      console.log("This employee received an error: \n" +finalEmpData[0]+ "\n" +finalEmpData[3]+"\n"+ finalEmpData[10]);
   }


//BONUS - send login records as JSON output to the console
console.log(JSON.stringify(loginParsedDataArray));

