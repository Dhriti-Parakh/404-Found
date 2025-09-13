/*

format of the cvs file standardised to match this

Transaction Date,Description,Amount,Merchant,Card Number (Masked)

*/

(function(){
    var Delimiter = ',';
    var NEWLINE = '\n';
    var i = document.getElementById('file')
    var table = document.getElementById('table');
    
    // ADDED: Array to store objects for each row
    var rowObjects = [];

    if(!i){
        return;
    }

    i.addEventListener('change',function(){
        if(!!i.files && i.files.length > 0){
            parseCSV(i.files[0])
        }
    });

    function parseCSV(file){
        if(! file || !FileReader){
            return;
        }

        var reader = new FileReader();

        reader.onload = function(e){
            toTable(e.target.result);
        };

        reader.readAsText(file);
    }

    function toTable(text){
        if(!text || !table){
            return;
        }

        // Clear previous objects
        rowObjects = [];

        //clear table
        while(!!table.lastElementChild){
            table.removeChild(table.lastElementChild);
        }

        var rows =  text.split(NEWLINE);
        var headers =  rows.shift().trim().split(Delimiter);
        
        // ADDED: Clean headers to use as object keys
        var cleanHeaders = headers.map(function(header) {
            return header.trim();
        });
        
        var htr = document.createElement('tr');

        cleanHeaders.forEach(function(h){
            var th = document.createElement('th');
            //Account for potential blank spaces between comma delimters
            var ht = h.trim();

            if(!ht){
                return;
            }

            th.textContent = ht;
            htr.appendChild(th);
        });

        table.appendChild(htr);

        var rtr;
        rows.forEach(function (r) {
            r = r.trim();
            if (!r){ //prevents empty row issues
                return;
            }

            var cols = r.split(Delimiter);

            if(cols.length === 0){
                return;
            }

            rtr = document.createElement('tr');

            // ADDED: Create object for this row
            var rowObject = {};

            cols.forEach(function(c, index){
                var td = document.createElement('td');
                var tc = c.trim();
                td.textContent = tc;
                rtr.appendChild(td);
                
                // ADDED: Add to row object if header exists
                if (cleanHeaders[index]) {
                    rowObject[cleanHeaders[index]] = tc;
                }
            });

            // ADDED: Add the object to our array if it has properties
            if (Object.keys(rowObject).length > 0) {
                rowObjects.push(rowObject);
            }

            table.appendChild(rtr);
        });
        
        // ADDED: Now you can access all row objects
        console.log("Array of objects created:", rowObjects);


        var FOOD_places  = ["WOOLWORTHS","CHECKERS","SHOPRITE","PNP","CAFE","cafe","EATs"]; //common food stores(staples)
        var food_obj = [];//will store objects here

        var subsctiptions = ["APPL MUSIC","SPOTIFY","NEXTFLIX","DISNEY+","SHOWMAX","DSTV","CANVA"]; //common subscriptions
        var subs_obj = [];//will store objects here

        var travel = ["UBER","SHELL","BP","ASTRON","TOTAL","BOLT","ENGEN"]; //common ride share/ petrol brands in SA
        var travel_obj = [];//will store objects here

        var income = [];
        var expense = [];

        //first i need to split it between money comming in and money going out
        for(let i = 0; i < rowObjects.length;i++){
            
            if(rowObjects[i].Amount.includes('-')){
                expense.push(rowObjects[i]);
            }else{
                income.push(rowObjects[i]);
            }
            
        }

        console.log("Expenses",expense);
        console.log("Income",income);

        //SPLIT BASED ON EXPENSES
        //pop into the food sub cat leaving only the unknown
        for(let j = 0; j < expense.length && expense.length > 0;j++){
            //see if we can place it in a cateorgy 
            for(let k = 0; k < FOOD_places.length;k++){
                if(expense[j].Description.includes(FOOD_places[k])){
                    food_obj.push( structuredClone(expense[j]));
                    expense.pop(j)
                    break;
                }
            }

        }

        console.log(food_obj)

        //pop into the travel sub cat
        for(let k = 0 ; k < expense.length && expense.length > 0;k++){
            for(let h = 0; h < travel.length;h++){
                if(expense[k].Description.includes(travel[h])){
                    travel_obj.push(structuredClone(expense[k]));
                    break;
                }
            }
        }

        console.log(travel_obj)





    }
})();