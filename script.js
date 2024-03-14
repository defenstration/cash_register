let price = 3.26;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

let cidOriginal = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
  ];

const cash = document.getElementById('cash')
const purchaseBtn = document.getElementById('purchase-btn')
const changeDue = document.getElementById('change-due')
const priceScreen = document.getElementById('price-screen')
const cashDrawerDisplay = document.getElementById('cash-drawer-display')


cashDrawerDisplay.textContent = cid
priceScreen.textContent = `Price: $${price}`

const determineChange = () =>{
    let change = cash.value - price;
    let originalChange = change
    if (change < 0) {
        alert('Customer does not have enough money to purchase the item')
    } else if (change === 0){
        changeDue.textContent = "No change due - customer paid with exact cash"
    };
    cash.value = ''
    //determine change breakdown
    let denominations = [.01, .05, .10, .25, 1.00, 5.00, 10.00, 20.00, 100.00]
    let denominationsReversed = denominations.reverse()
    let changeArray = [];
    denominationsReversed.forEach(type => {
        if (change >= type) {
            let cashNum = Math.floor(change.toFixed(2) / type)
            changeArray.push(cashNum)
            change = change - type * cashNum
        } else if (change < type) {
            changeArray.push(0)
        }
    })

    //Create array of change matched to the correct denomination
    let matchedChange = []

    for( let i=0; i < changeArray.length; i++){
        matchedChange.push(changeArray[i] * denominations[i])
    }

    let cidReversed = cid.slice().reverse();
    let cidOriginalReversed = cidOriginal.slice().reverse();


    let statusChange = []

    let statusText = 'OPEN'

    //Modify CID with the change values
    for (let i=0; i<cidReversed.length; i++) {
        cidReversed[i][1] = (cidReversed[i][1]-matchedChange[i]).toFixed(2)

        if(cidReversed[i][1] < 0){
            if (i === cidReversed.length-1) {
                cidReversed[i][1] = 0
                changeDue.textContent = 'Status: INSUFFICIENT_FUNDS'
                break
            } else {
                matchedChange[i+1] += Math.abs(cidReversed[i][1])
                //cidReversed[i][1] = 0
            }  
        }

        statusChange.push([cidReversed[i][0], matchedChange[i]]);
            if (statusChange[i][1] > cidOriginalReversed[i][1]) {
                statusChange[i][1] = cidOriginalReversed[i][1]
            }
    }

    console.log(statusChange)
    console.log(cidOriginalReversed)

    //Set final status
    finalStatus = []
    
    for (let i = 0; i < statusChange.length; i++){
        if (statusChange[i][1] !== 0){
            finalStatus.push([statusChange[i][0], statusChange[i][1]])
        } 
    }

    cidNew = cidReversed.slice().reverse();

    if (cidNew.reduce((acc, arr) => acc + arr[1], 0)===0) {
        statusText = 'CLOSED'
    }

    cashDrawerDisplay.textContent = cidNew;

    const finalStr = (arr) => {
        let finalStrRes = ''
        arr.forEach(arr => {
            finalStrRes += arr[0] + ': $' + arr[1] + ' '
        });
        return finalStrRes
    }

    if (originalChange > 0) {
        changeDue.textContent = `Status: ${statusText} ${finalStr(finalStatus)}`
    }
    
}

purchaseBtn.addEventListener('click', () =>{
    determineChange()
})