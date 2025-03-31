console.log('javascript running');
console.log(document.title);
let currentIp='.budgetgoose.xyz';
//establishing cookies
let cookies = document.cookie.split(';').reduce((cookies,cookie) => {
    let splitCookies=cookie.split('=');
    cookies[splitCookies[0].trim()]=splitCookies[1];
    return cookies;
},{});
let input=new Event('input', {bubbles: true});

//Paycheck sheet variables
let paycheckDate=document.getElementById('datePaid');
let paycheckAmount = document.getElementById('paidAmount');
let selectedTerm=document.getElementById('distributionTerm');
let longTermSaveDisplay = document.getElementById('longTermValue');
let paycheckShortTermAmount = document.getElementById('shortTermSaveValue');
let paycheckDebt = document.getElementById('paycheckDebt');
let funsiesSetAside = document.getElementById('funsiesSetAside');
let remainingDetail = document.getElementById('remainingFromPaycheck');
let paycheckDaily = document.getElementById("paycheckDaily");
let paycheckInputs = document.getElementById('paycheckInputs');
let subscriptionAmount = document.getElementById('subscriptionAmount');
let term;
let payTerm;
setPayTerm();

//index sheet variables
let balanceInput = document.getElementById('balanceInputArea');
let dailyDate=document.getElementById('dailyDate');
let dailyRemainder=document.getElementById('dailyRemainder');
let addPurchDoneButton=document.getElementById('addPurchDoneButton');
let addPurch=document.getElementById('addPurch')

//redistribution sheet variables
let redDate=document.getElementById('redDate');
let currentButton = document.getElementById('currentStandings');
let currentInfo = document.getElementById('infoStuff');
let redTermSelect=document.getElementById('redTerm');
let redTermContainer = document.getElementById('redTermInput');
let redExpendInputs = document.getElementById('redExpendInputs');
let redExpendFieldsContainer=document.getElementById('redExpendFieldsContainer');
let redDailyDisp=document.getElementById('redDailyDisp');
let redAmount = document.getElementById('redAmount');
let redBody = document.getElementById('redBody');
let redInputs=document.getElementById('redInputs');
let redRemainingDisp = document.getElementById('redRemainingDisp');

if(document.title==="Home page"){
    let datee = new Date()
    .toLocaleDateString("en-CA", {timeZone: 'America/Chicago'})
    .replace(/\//g, "=")
    .split("T")[0];
    console.log(datee);
    dailyDate.value=datee;
    balanceInput.value=cookies.baI;
    updateDailyRemaining();

    //index event listeners
    balanceInput.addEventListener('input', updateDailyRemaining);
    addPurchDoneButton.addEventListener('click', updateCurrentFromPurchase);

} else if(document.title==="Paycheck sheet"){
    loadLastSave();

    //set up the event listeners
    paycheckAmount.addEventListener("input", updateLongTerm);
    selectedTerm.addEventListener("input", showTermOptions);
    subscriptionAmount.addEventListener('input', updateSubscriptionFields);
    paycheckInputs.addEventListener('input', updateRemaining);
    paycheckInputs.addEventListener('input', savePaycheckInfo);
} else if(document.title==='Re-distribution sheet'){
    currentInfo.style.visibility='hidden';
    //current date 
    let curRedDate = document.createElement('p');
    curRedDate.className='redInfoItem';
    curRedDate.append('Date: ');
    let dateee=new Date().toISOString().split('T')[0];
    curRedDate.append(dateee);
    //current balance
    let curRedBalance = document.createElement('p');
    curRedBalance.className='redInfoItem';
    curRedBalance.append('Balance: ');
    curRedBalance.append(cookies.baI);
    console.log(curRedBalance);
    //current remaining days
    let curRedRemainingDays=document.createElement('p');
    curRedRemainingDays.className='redInfoItem';
    curRedRemainingDays.append('Remaining days: ');
    let redRemDays = Math.round(cookies.pITe-((new Date().getTime()/1000/60/60/24)-(new Date(cookies.pIDt).getTime()/1000/60/60/24)));
    console.log(redRemDays); 
    curRedRemainingDays.append(redRemDays);
    //daily would be: 
    let redPotentialDaily = document.createElement('p');
    redPotentialDaily.className='redInfoItem';
    redPotentialDaily.append('Daily would be: ');
    let lfaew=Math.round((parseInt(cookies.baI)/redRemDays)*100)/100;
    if (lfaew=Infinity){
        redPotentialDaily.append(cookies.baI);
    } else {
        redPotentialDaily.append(lfaew);
    }
    currentInfo.innerHTML='Current stuff';
    currentInfo.append(curRedDate,curRedBalance,curRedRemainingDays,redPotentialDaily);

    if(cookies.baI!==null&&cookies.baI!==""&&cookies.baI!==undefined){
    currentButton.style.color='black';
    currentButton.addEventListener('mouseover', showRedDetails);
    currentButton.addEventListener('mouseleave', hideRedDetails);
    currentButton.addEventListener('click', setRedAsCurrent);
    } else {
        currentButton.style.color='#aaa1a1';
    }
    redTermSelect.addEventListener('input', setRedInputOption);
    redExpendInputs.addEventListener('input',redExpendFields);
    redInputs.addEventListener('input', updateRedDaily);
    redInputs.addEventListener('input', saveRedCookies);

    loadRedSave();
}

function setPayTerm(){
    payTerm=findPayTerm();
    console.log(payTerm);
    document.cookie ="pIPT="+payTerm+"; max-age=31536000; sameSite=Lax; domain="+currentIp;
    console.log(document.cookie);
}

//Updates the long term savings thing
function updateLongTerm() {
    console.log(paycheckAmount.value);
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
console.log('wtf')
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
console.log('approaching daily');
calculateDaily();
}

//calculate the daily
//selectedTerm.value
function calculateDaily(){
    //find term length
    console.log('made it to calculate daily');
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
    console.log(term);
    if (term>0){
    let dailyFrPaycheck = parseFloat(remainingDetail.innerHTML)/term;
    dailyFrPaycheck = (Math.round(dailyFrPaycheck*100))/100;
    paycheckDaily.innerHTML=(dailyFrPaycheck);
    } else {
        paycheckDaily.innerHTML=('Please input a positive term');
    }
    console.log(term);
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
    console.log('running thing')
    //paycheck info cookie format: pI(paycheck info)X(letter or two spec item)

    //date
    console.log(paycheckDate.value);
    document.cookie="pIDt="+paycheckDate.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //daily
    document.cookie="pIDI="+paycheckDaily.innerHTML+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //amount
    document.cookie="pIA="+paycheckAmount.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //term
    document.cookie="pIT="+selectedTerm.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
        //custom first value
        let applicableStart;// document.getElementById('customTermDatesStartDate').value || document.getElementById('customTermDaysStartDate').value || "Lax";
        let applicableEnd;
        switch(selectedTerm.value){
            case "twoWeeks":
                applicableStart="none"
                applicableEnd="none";
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
        document.cookie="pICf="+applicableStart+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
        //custom second value //document.getElementById('customTermDatesEndDate').value || documument.getElementById('customTermDaysDayCount').value || "Lax";
        document.cookie="pICe="+applicableEnd+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //long term save
        document.cookie="pILT="+parseInt(longTermSaveDisplay.innerHTML)+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //short term save
        document.cookie="pIST="+paycheckShortTermAmount.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //debt
        document.cookie="pID="+paycheckDebt.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //subscription count
        document.cookie="pISCu="+subscriptionAmount.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //subscription names
        let subNames = "";
        for(let i=0;i<parseFloat(subscriptionAmount.value);i++){
            subNames+=(document.getElementById('subscriptionName' + (i+1)).value.trim()+"|");
            console.log(subNames);
        }   
        document.cookie="pISN="+subNames+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //subscription costs
        let subCosts = "";
        for(let i=0;i<parseFloat(subscriptionAmount.value); i++){
            subCosts+=(document.getElementById('subscriptionCost'+(i+1)).value.trim()+"|");
            console.log(subCosts);
        }
        document.cookie="pISCs="+subCosts+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
    //funsies set aside
        document.cookie="pIF="+funsiesSetAside.value+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
        //remaining
        document.cookie="pIR="+remainingDetail.innerHTML+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
        document.cookie="pITe="+term+"; max-age=31536000; domain="+currentIp+"; path=/; SameSite=Lax";
        
        setPayTerm();

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
       if(cookies.PICe!=="none"&&cookies.pICf!=="none"){
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
        let namesOfSubs=cookies.pISN.split("|");
        let costsOfSubs=cookies.pISCs.split("|");
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

    function findPayTerm(){
        console.log(cookies.pIT);
        switch(cookies.pIT){
            case 'twoWeeks':
                return 14;
            break;
            case 'customDates':
                return (new Date(cookies.pICe).getTime()-new Date(cookies.pICf).getTime())/1000/60/60/24;
            break;
            case 'customDays':
                return parseInt(cookies.pICe);
            break;
        }
    }
//START OF INDEX PAGE STUFF
//for when balance is updated
function updateDailyRemaining(){
    //balance input cookie
    console.log('updating');
    document.cookie="baI="+balanceInput.value.trim()+"; max-age=31536000; path=/; SameSite=Lax; domain=" + currentIp;
    if(cookies.baI!==undefined && cookies.baI!==null && cookies.baI!==""){
    balanceInput.placeholder=cookies.baI;
    } else {
        balanceInput.placeholder='Input balance';
    }
    let amountToSubtract;
    let projectedBlnce;
    if(parseInt(cookies.rID)!==NaN&&parseInt(cookies.rID)!=='NaN'&&cookies.rID!=='Fill everything out!'&&cookies.rID!==""){
        console.log(parseInt(cookies.rID)!==NaN);
        console.log(parseInt(cookies.rID)!=='NaN');
        console.log(cookies.rID);
        console.log(typeof(parseInt(cookies.pID)));
        console.log('new balance');
        amountToSubtract=(((new Date(dailyDate.value).getTime()-new Date(cookies.rISD).getTime())/1000/60/60/24)+1)*parseFloat(cookies.rID);
        projectedBlnce=parseFloat(cookies.rIR)-amountToSubtract;
    } else if(parseInt(cookies.pIDI)!==NaN&&parseInt(cookies.pIDI)!=='NaN'){
        console.log('original balance');
        amountToSubtract=(((new Date(dailyDate.value).getTime()-new Date(cookies.pIDt).getTime())/1000/60/60/24)+1)*parseFloat(cookies.pIDI);
        console.log(new Date(dailyDate.value).getTime())
        console.log(new Date(cookies.pIDt).getTime());
        console.log(parseFloat(cookies.pIDI));
        console.log(amountToSubtract);
        
        
        projectedBlnce=cookies.pIR-amountToSubtract;
    }
    dailyRemainder.value=Math.round((parseFloat(balanceInput.value)-projectedBlnce)*100)/100 || 'Please input budget information';
}

function updateCurrentFromPurchase(){
    balanceInput.value=Math.round((parseFloat(balanceInput.value)-parseFloat(addPurch.value))*100)/100;
    addPurch.value=null;
    balanceInput.dispatchEvent(input);
}

//START OF REDISTRIBUTION PAGE STUFF
function showRedDetails(){
    currentInfo.style.visibility='visible';
}
function hideRedDetails(){
    currentInfo.style.visibility='hidden';
}

function setRedInputOption(){
    redTermContainer.innerHTML=null;
    let redEndMessage;
    let bigDefaultEndDate;
    let redEndOption = document.createElement('input');
    redEndOption.id='redEndValue';
    switch(redTermSelect.value){
    case 'auto':
        redEndMessage = 'End date: ';
        redEndOption.type='date';
        let defaultEndDate = new Date(new Date(cookies.pIDt).getTime()+(cookies.pITe*24*60*60*1000));
        bigDefaultEndDate=defaultEndDate;
        console.log('start date' + new Date(parseInt(cookies.pIDt)));
        console.log('term' + cookies.pIPT);
        console.log(cookies.pIPT * 1000*60*60*24);
        console.log(defaultEndDate);
        redEndOption.value=defaultEndDate.toISOString().split('T')[0];
    break;
    case 'pickDate':
        redEndMessage = 'End Date: ';
        redEndOption.type='date';
    break;
    case 'pickDay':
        redEndMessage='How many days? '
        redEndOption.type='number';
    break;
    }
    let lineBreak = document.createElement('br');
    redTermContainer.append(redEndMessage, redEndOption, lineBreak);
    redEndOption.addEventListener('input', checkAuto);
    function checkAuto(){
        console.log('checking')
        if(redTermSelect.value==='auto' && redEndOption.value!==bigDefaultEndDate){
            redTermSelect.value='pickDate';
        }
    }
}

function redExpendFields(){
    let numOfExpend = redExpendInputs.value;
    redExpendFieldsContainer.innerHTML=null;
    if(numOfExpend===0||numOfExpend===null||numOfExpend===NaN){
        return;
    }
    let redExpendNameRow=document.createElement('tr');
    redExpendNameRow.id="redExpendNameRow";
    let redExpendValueRow=document.createElement('tr');
    redExpendValueRow.id="redExpendValueRow";
    for(let i=0;i<numOfExpend;i++){
        let newRedExpendNameFieldCont=document.createElement('td');
        let newRedExpendValueFieldCont=document.createElement('td');

        let newRedExpendNameField=document.createElement('input');
        newRedExpendNameField.id=`redExpendName${i+1}`;
        newRedExpendNameField.placeholder=`Expenditure ${i+1} Name`
        newRedExpendNameField.type='text';

        let newRedExpendValueField=document.createElement('input');
        newRedExpendValueField.id=`redExpendValue${i+1}`;
        newRedExpendValueField.placeholder=`Expenditure ${i+1} amount`
        newRedExpendValueField.type='number';

        newRedExpendNameFieldCont.append(newRedExpendNameField);
        newRedExpendValueFieldCont.append(newRedExpendValueField);
        
        redExpendNameRow.append(newRedExpendNameFieldCont);
        redExpendValueRow.append(newRedExpendValueFieldCont);
    }
    redExpendFieldsContainer.append(redExpendNameRow,redExpendValueRow);
}

function updateRedDaily(){
    //find daily
    let redEndValue=document.getElementById('redEndValue');
    console.log(redEndValue.type);
    let redRemaining=parseFloat(redAmount.value);
    for(let i=0;i<parseFloat(redExpendInputs.value);i++){
        let newAmount = document.getElementById(`redExpendValue${i+1}`);
        redRemaining-=parseFloat(newAmount.value);
        console.log(newAmount.value);
        console.log(redRemaining);
    }
    redRemaining=Math.round(redRemaining*100)/100
    redRemainingDisp.value=redRemaining || 'Fill everything out!';
    console.log(redRemaining);
    switch(redEndValue.type){
        case 'date':
            let redTermLength = (new Date(redEndValue.value).getTime()-new Date(redDate.value).getTime())/1000/60/60/24;
            console.log(redTermLength);
            let redDaily=redRemaining/parseFloat(redTermLength);
            redDaily = Math.round(redDaily*100)/100
            redDailyDisp.value=redDaily || 'Fill everything out!';
        break;
        case 'number':
            let redNumDaily = redRemaining/parseFloat(redEndValue.value);
            redNumDaily = Math.round(redNumDaily*100)/100;
            redDailyDisp.value=redNumDaily || 'Fill everything out!';
        break;
    }
    if(redDailyDisp.value==='Infinity'){
        redDailyDisp.value=cookies.baI;
    }
}

function setRedAsCurrent(){
    let input = new Event('input', {bubbles: true});
    console.log('setting');
    redDate.value=new Date().toISOString().split('T')[0];
    redTermSelect.value='auto';
    redTermSelect.dispatchEvent(input);
    redAmount.value=cookies.baI;
    redExpendInputs.value=0;
    redExpendInputs.dispatchEvent(input);
    saveRedCookies();
}

function saveRedCookies(){
    console.log('saving red cookies');
    //rI--- redistribution info ____ _____
    //startdate
    document.cookie='rISD='+redDate.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //end setting
    document.cookie='rITS='+redTermSelect.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //end date/day count
    document.cookie='rIED='+redEndValue.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //starting amount
    document.cookie='rISA='+redAmount.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //expenditures
    document.cookie='rIEI='+redExpendInputs.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //expenditure values
    let expNames="";
    let expValues="";
        for(let i=0; i<redExpendInputs.value; i++){
            let curExpName = document.getElementById(`redExpendName${i+1}`).value.trim();
            expNames+=curExpName+'|';
            let curExpValue = document.getElementById(`redExpendValue${i+1}`).value.trim();
            expValues+=curExpValue+'|';
            console.log(expNames);
            console.log(expValues);
        }
    document.cookie='rIEN='+expNames+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    document.cookie='rIEV='+expValues+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';
    //new daily
    document.cookie='rID='+redDailyDisp.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';

    //remaining
    document.cookie='rIR='+redRemainingDisp.value+'; domain='+currentIp+'; path=/; max-age=31536000; SameSite=Lax';

    let fuck=document.cookie.split(';').reduce((cookies, cookie) => {
        let cookiee=cookie.split('=');
        cookies[cookiee[0].trim()]=cookiee[1];
        return cookies;
    },{})
    console.log(document.cookie);
    console.log(fuck);
}

function loadRedSave(){
    //set date
    redDate.value=cookies.rISD;
    //term
    redTermSelect.value=cookies.rITS;
    redTermSelect.dispatchEvent(new Event('input', {bubbles: true}));
    //end value
    redEndValue.value=cookies.rIED;
    //starting amount
    redAmount.value=cookies.rISA;
    //expenditures
    redExpendInputs.value=cookies.rIEI;
    redExpendInputs.dispatchEvent(new Event('input', {bubbles: true}));
    for (let i=0;i<cookies.rIEI;i++){
        let names = cookies.rIEN.split('|');
        let values=cookies.rIEV.split('|');
        document.getElementById(`redExpendName${i+1}`).value=names[i];
        document.getElementById(`redExpendValue${i+1}`).value=values[i];
    }
    redInputs.dispatchEvent(new Event('input', {bubbles: true}));
}

function clearRedStuff(){
    let input = new Event('input', {bubbles: true});
    redDate.value=null;
    redTermSelect.value=null;
    redTermSelect.dispatchEvent(input);
    redAmount.value=null;
    redExpendInputs.value=0;
    redExpendInputs.dispatchEvent(input);
    redTermContainer.innerHTML=null;
}

console.log('Everything is fine');   
