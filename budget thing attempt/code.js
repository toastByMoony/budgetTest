console.log('javascript running');
console.log(document.title);
//establishing cookies
let cookies = document.cookie.split(';').reduce((cookies,cookie) => {
    let splitCookies=cookie.split('=');
    cookies[splitCookies[0].trim()]=splitCookies[1];
    return cookies;
},{});

//Paycheck sheet variables
let paycheckDate=document.getElementById('datePaid');
let paycheckAmount = document.getElementById('paidAmount');
let selectedTerm=document.getElementById('distributionTerm');
let longTermSaveDisplay = document.getElementById('longTermValue');
let paycheckShortTermAmount = document.getElementById('shortTermSaveValue');
let paycheckDebt = document.getElementById('paycheckDebt');
let funsiesSetAside = document.getElementById('funsiesSetAside');
let remainingDetail = document.getElementById('remainingFromPaycheck');
let paycheckDaily = document.getElementById('paycheckDaily');
let paycheckInputs = document.getElementById('paycheckInputs');
let subscriptionAmount = document.getElementById('subscriptionAmount');

//index sheet variables
let balanceInput = document.getElementById('balanceInputArea');
let dailyDate=document.getElementById('dailyDate');
let dailyRemainder=document.getElementById('dailyRemainder');

if(document.title==="Home page"){
    let datee = new Date()
    .toISOString()
    .split("T")[0];
    console.log(datee);
    dailyDate.value=datee;

    //index event listeners
    balanceInput.addEventListener('input', updateDailyRemaining);

} else if(document.title==="Paycheck sheet"){
    loadLastSave();

    //set up the event listeners
    paycheckAmount.addEventListener("input", updateLongTerm);
    selectedTerm.addEventListener("input", showTermOptions);
    subscriptionAmount.addEventListener('input', updateSubscriptionFields);
    paycheckInputs.addEventListener('input', updateRemaining);
    paycheckInputs.addEventListener('input', savePaycheckInfo);
}

//Updates the long term savings thing
function updateLongTerm() {
    console.log(paycheckAmount);
    let longTermSaveAmount = paycheckAmount.value * .1;
    longTermSaveAmount = (Math.round(longTermSaveAmount*100))/100
    console.log(longTermSaveAmount);
    longTermSaveDisplay.innerHTML = longTermSaveAmount;
}

//updates the term options
function showTermOptions(){
    let termStartRow = document.getElementById('startDate');
    let termEndRow = document.getElementById('customEnd');
    termStartRow.innerHTML=null;
    termEndRow.innerHTML=null;
    switch(selectedTerm.value){
        case 'twoWeeks':
            return;
            break;
        case 'customDates':
            //set the custom dates start date option
            let startDateTitle = document.createElement('td');
            let startDateLabel=document.createElement('label');
            startDateLabel.setAttribute('for', 'customTermDatesStartDate');
            startDateLabel.innerHTML='Start date: ';
            startDateTitle.append(startDateLabel);
            let startDateInput = document.createElement('td');
            let startDateInputField = document.createElement('input');
            startDateInputField.type="date";
            startDateInputField.id="customTermDatesStartDate";
            startDateInputField.value=document.getElementById('datePaid').value;
            startDateInput.append(startDateInputField);
            termStartRow.append(startDateTitle, startDateInput);

            //set the custom dates end date option
            let endDateTitle = document.createElement('td');
            let endDateLabel = document.createElement('label');
            endDateLabel.setAttribute('for', 'customTermDatesEndDate');
            endDateLabel.innerHTML='End date: ';
            endDateTitle.append(endDateLabel);
            let endDateInput = document.createElement('td');
            let endDateInputField=document.createElement('input');
            endDateInputField.type="date";
            endDateInputField.id="customTermDatesEndDate";
            endDateInput.append(endDateInputField);
            termEndRow.append(endDateTitle,endDateInput);
            break;
        case "customDays":

        //set the start date stuff
            let customStartDateTitle=document.createElement('td');
            let customStartLabel = document.createElement('label');
            customStartLabel.setAttribute('for', 'customTermDaysStartDate');
            customStartLabel.innerHTML='Start date: ';
            customStartDateTitle.append(customStartLabel);
            let customStartDateInput = document.createElement('td');
            let customStartDateInputField = document.createElement('input');
            customStartDateInputField.type="date";
            customStartDateInputField.id="customTermDaysStartDate";
            customStartDateInputField.value=document.getElementById('datePaid').value;
            customStartDateInput.append(customStartDateInputField);
            termStartRow.append(customStartDateTitle,customStartDateInput);

        //set the amount of days stuff
        let amountOfDaysTitle = document.createElement('td');
        let amountOfDaysLabel=document.createElement('label');
        amountOfDaysLabel.setAttribute('for', 'customTermDaysDayCount');
        amountOfDaysLabel.innerHTML='Amount of days: '
        amountOfDaysTitle.append(amountOfDaysLabel);
        let amountOfDaysInput=document.createElement('td');
        let daysInputField=document.createElement('input');
        daysInputField.type="number";
        daysInputField.id="customTermDaysDayCount";
        amountOfDaysInput.append(daysInputField);
        termEndRow.append(amountOfDaysTitle, amountOfDaysInput);
    }
}

//Updates the amount of subscriptions
function updateSubscriptionFields(){
    let amount = subscriptionAmount.value;
    let nameContainer = document.getElementById('subscriptionNames');
    let costContainer = document.getElementById('subscriptionAmounts');
    if(amount>0){
        //set the name fields
        nameContainer.innerHTML=null;
        for(let i=0;i<amount;i++){
            let newNameDetail = document.createElement("td");
            let newNameField = document.createElement("input");
            newNameField.type="text";
            newNameField.id=`subscriptionName${i+1}`;
            newNameField.placeholder=`Subscription ${i+1} name`;
            newNameDetail.append(newNameField);
            nameContainer.append(newNameDetail);
        }
        //set the amount fields
        costContainer.innerHTML=null;
        for(let i=0;i<amount;i++){
            let newAmountDetail = document.createElement("td");
            let newAmountField = document.createElement("input");
            newAmountField.type="number";
            newAmountField.id=`subscriptionCost${i+1}`;
            newAmountField.placeholder = `Subscription ${i +1} cost`;
            newAmountDetail.append(newAmountField);
            costContainer.append(newAmountDetail);
        }
    } else if(amount<=0){
        nameContainer.innerHTML=null;
        costContainer.innerHTML=null;
    }
}

//update remaining value
function updateRemaining(){
    let paid = parseFloat(paycheckAmount.value) || 0;
    let longSave = parseFloat(longTermSaveDisplay.innerHTML) || 0;
    let shortSave = parseFloat(paycheckShortTermAmount.value) || 0;
    let debt = parseFloat(paycheckDebt.value) || 0;
    let funsies = parseFloat(funsiesSetAside.value) || 0;
    let remaining = paid - (longSave+shortSave+debt+funsies);
    let subCount = subscriptionAmount.value;
    if(subCount!==0 && subCount!=="" && subCount!==null && subCount!==undefined){
    for (let i=0;i<subCount;i++){
        let refSub = parseFloat(document.getElementById('subscriptionCost' + (i+1)).value) || 0;
        remaining-=refSub;
    }
}
    /*
console.log("amount paid: " + paid);
console.log("long term save: " + longSave);
console.log("short term save: " + shortSave);
console.log('debt: ' + debt)
console.log('funsies: ' + funsies);
console.log(remaining);
*/
remaining = (Math.round(remaining*100))/100;
remainingDetail.innerHTML=null;
remainingDetail.append(remaining);
calculateDaily();
}

//calculate the daily
//selectedTerm.value
function calculateDaily(){
    //find term length
    let term;
    switch(selectedTerm.value){
        case "twoWeeks":
            term=14;
        break;
        case "customDates":
            let cDtStart = new Date(document.getElementById('customTermDatesStartDate').value);
            let cDtEnd = new Date(document.getElementById('customTermDatesEndDate').value);
            let cDtDayCnt = (cDtEnd.getTime()-cDtStart.getTime())/1000/60/60/24;
            term = cDtDayCnt;
        break;
        case "customDays":
            let cDyDayCnt = parseFloat(document.getElementById('customTermDaysDayCount').value);
            term = cDyDayCnt;
        break;
    }
    if (term>0){
    let dailyFrPaycheck = parseFloat(remainingDetail.innerHTML)/term;
    dailyFrPaycheck = (Math.round(dailyFrPaycheck*100))/100;
    paycheckDaily.innerHTML=(dailyFrPaycheck);
    } else {
        paycheckDaily.innerHTML=('Please input a positive term');
    }
}

//save paycheck info as cookies
/*cookies: date, 
daily, 
amount, 
 term, 
 startdate value, 
 secondary custom value, 
 short term save, 
 debt, 
 subscription count, 
 subscription names, 
 subscription counts, 
 funsies set aside
*/
//let testButton=document.getElementById('testButton');
//testButton.addEventListener('click', savePaycheckInfo);
function savePaycheckInfo(){
    //paycheck info cookie format: pI(paycheck info)X(letter or two spec item)

    //date
    document.cookie="pIDt="+paycheckDate.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //daily
    document.cookie="pIDI="+paycheckDaily.innerHTML+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //amount
    document.cookie="pIA="+paycheckAmount.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //term
    document.cookie="pIT="+selectedTerm.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
        //custom first value
        let applicableStart;// document.getElementById('customTermDatesStartDate').value || document.getElementById('customTermDaysStartDate').value || "Lax";
        let applicableEnd;
        switch(selectedTerm.value){
            case "twoWeeks":
                applicableStart="Lax"
                applicableEnd="Lax";
            break;
            case "customDates":
                applicableStart=document.getElementById('customTermDatesStartDate').value;
                applicableEnd=document.getElementById('customTermDatesEndDate').value;
            break;
            case "customDays":
                applicableStart=document.getElementById('customTermDaysStartDate').value;
                applicableEnd=document.getElementById('customTermDaysDayCount').value;
            break;
        }

        //Idk why I named it like this but this is the custom start date
        document.cookie="pICf="+applicableStart+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
        //custom second value //document.getElementById('customTermDatesEndDate').value || documument.getElementById('customTermDaysDayCount').value || "Lax";
        document.cookie="pICe="+applicableEnd+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //long term save
        document.cookie="pILT="+parseInt(longTermSaveDisplay.innerHTML)+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //short term save
        document.cookie="pIST="+paycheckShortTermAmount.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //debt
        document.cookie="pID="+paycheckDebt.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //subscription count
        document.cookie="pISCu="+subscriptionAmount.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //subscription names
        let subNames = "";
        for(let i=0;i<parseFloat(subscriptionAmount.value);i++){
            subNames+=(document.getElementById('subscriptionName' + (i+1)).value.trim()+"|");
            console.log(subNames);
        }   
        document.cookie="pISN="+subNames+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //subscription costs
        let subCosts = "";
        for(let i=0;i<parseFloat(subscriptionAmount.value); i++){
            subCosts+=(document.getElementById('subscriptionCost'+(i+1)).value.trim()+"|");
            console.log(subCosts);
        }
        document.cookie="pISCs="+subCosts+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
    //funsies set aside
        document.cookie="pIF="+funsiesSetAside.value+"; max-age=31536000; domain=192.168.1.242; path=/; SameSite=Lax";
        console.log(document.cookie);
}
    function loadLastSave(){
        console.log(cookies);
        /*date
        amount paid
        term
        if applicable start and end values
        short term savings
        debt
        subscription amount
        subscription values
        funsies
        */
       paycheckDate.value=cookies.pIDt;
       paycheckAmount.value=cookies.pIA;
       updateLongTerm();
       selectedTerm.value=cookies.pIT;
       showTermOptions();
       showTermOptions();
       if(cookies.PICe!=="Lax"&&cookies.pICf!=="Lax"){
       switch(cookies.pIT){
        case "customDates":
            document.getElementById('customTermDatesStartDate').value=cookies.pICf;
            document.getElementById('customTermDatesEndDate').value=cookies.pICe;
        break;
        case 'customDays':
            document.getElementById('customTermDaysStartDate').value=cookies.pICf;
            document.getElementById('customTermDaysDayCount').value=cookies.pICe;
        break;
       }
       }
       paycheckShortTermAmount.value=cookies.pIST;
       paycheckDebt.value=cookies.pID;
       subscriptionAmount.value=cookies.pISCu || 0;
       updateSubscriptionFields();
       if(cookies.pISCu>0){
        let namesOfSubs=cookies.pISN.split("|").filter(item => item!==""&&item!==null);
        let costsOfSubs=cookies.pISCs.split("|").filter(item=>item!==""&&item!==null);
        for(let i=0;i<cookies.pISCu;i++){
            let curName=document.getElementById(`subscriptionName${i+1}`);
            let curAmount=document.getElementById(`subscriptionCost${i+1}`);
            curName.value=namesOfSubs[i];
            curAmount.value=costsOfSubs[i];
        }
       }
       funsiesSetAside.value=cookies.pIF;
       updateRemaining();
    }


//START OF INPUT PAGE STUFF
//for when balance is updated
function updateDailyRemaining(){
    //balance input cookie
    document.cookie="baI="+balanceInput.value.trim()+"; max-age=31536000";
    if(cookies.baI!==undefined && cookies.baI!==null && cookies.baI!==""){
    balanceInput.placeholder=cookies.baI;
    } else {
        balanceInput.placeholder='Input balance';
    }
}

console.log('Everything is fine');