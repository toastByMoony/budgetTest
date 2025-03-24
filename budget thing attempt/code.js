console.log('javascript running');
let paycheckDate=document.getElementById('datePaid');
let paycheckAmount = document.getElementById('paidAmount');
let selectedTerm=document.getElementById('distributionTerm');
let longTermSaveDisplay = document.getElementById('longTermValue');
let paycheckShortTermAmount = document.getElementById('shortTermSaveValue');
let paycheckDebt = document.getElementById('paycheckDebt');
let funsiesSetAside = document.getElementById('funsiesSetAside');

//Updates the long term savings thing
paycheckAmount.addEventListener("input", updateLongTerm);
function updateLongTerm() {
    console.log(paycheckAmount);
    let longTermSaveAmount = paycheckAmount.value * .1;
    longTermSaveAmount = (Math.round(longTermSaveAmount*100))/100
    console.log(longTermSaveAmount);
    longTermSaveDisplay.innerHTML = longTermSaveAmount;
}

//updates the term options
selectedTerm.addEventListener("input", showTermOptions);
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
            startDateTitle.append('Start date: ');
            let startDateInput = document.createElement('td');
            let startDateInputField = document.createElement('input');
            startDateInputField.type="date";
            startDateInputField.id="customTermDatesStartDate";
            startDateInputField.value=document.getElementById('datePaid').value;
            startDateInput.append(startDateInputField);
            termStartRow.append(startDateTitle, startDateInput);

            //set the custom dates end date option
            let endDateTitle = document.createElement('td');
            endDateTitle.append('End date:');
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
            customStartDateTitle.append('Start date: ');
            let customStartDateInput = document.createElement('td');
            let customStartDateInputField = document.createElement('input');
            customStartDateInputField.type="date";
            customStartDateInputField.id="customTermDaysStartDate";
            customStartDateInputField.value=document.getElementById('datePaid').value;
            customStartDateInput.append(customStartDateInputField);
            termStartRow.append(customStartDateTitle,customStartDateInput);

        //set the amount of days stuff
        let amountOfDaysTitle = document.createElement('td');
        amountOfDaysTitle.append('Amount of days: ');
        let amountOfDaysInput=document.createElement('td');
        let daysInputField=document.createElement('input');
        daysInputField.type="number";
        daysInputField.id="customTermDaysDayCount";
        amountOfDaysInput.append(daysInputField);
        termEndRow.append(amountOfDaysTitle, amountOfDaysInput);
    }
}

//Updates the amount of subscriptions
let subscriptionAmount = document.getElementById('subscriptionAmount');
subscriptionAmount.addEventListener('input', updateSubscriptionFields);
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
            newNameField.id=`name${i+1}`;
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
let paycheckInputs = document.getElementById('paycheckInputs');
paycheckInputs.addEventListener('input', updateRemaining);
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
(Math.round(remaining)*100)/100;
let remainingDetail = document.getElementById('remainingFromPaycheck');
remainingDetail.innerHTML=null;
remainingDetail.append(remaining);
}

/*let paycheckDate=document.getElementById('datePaid');
let paycheckAmount = document.getElementById('paidAmount');
let selectedTerm=document.getElementById('distributionTerm');
let longTermSaveDisplay = document.getElementById('longTermValue');
let paycheckShortTermAmount = document.getElementById('shortTermSaveValue');
let paycheckDebt = document.getElementById('paycheckDebt');
let funsiesSetAside = document.getElementById('funsiesSetAside');*/
