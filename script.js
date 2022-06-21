'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
alert(`Account1: mt ,pasword:1111
Account2: lb ,pasword:2222`)
// Data
const account1 = {
  owner: 'Mai Tường',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2022-04-26T21:31:17.178Z',
    '2022-04-25T07:37:02.383Z',
    '2022-04-28T10:25:36.790Z',
    '2022-04-29T23:32:37.929Z',
    '2020-02-17T17:01:37.194Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: 'Lê Bảo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2022-04-23T07:42:02.383Z',
    '2022-11-18T21:31:17.178Z',
    '2020-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
  currency: "USD",
  locale: "pt-PT",
};



let accounts = [account1, account2];
let currentAccount,timer 




// Elements
const landingPage = document.querySelector('app');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const locale = navigator.language;






//Hiển thị ngày tháng năm
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
console.log(locale);

//Định dạng ngày tháng năm giao dịch
function formatDateMovs(date){
  function calsDayPass(date){
    const today = new Date();
    const dayPass = Math.abs(Math.floor((today - date) / (1000 * 60 * 60 * 24)));
    return dayPass;
  }
  if(calsDayPass(date) === 0){
    return 'Today';
  }else if(calsDayPass(date) === 1){
    return 'Yesterday';
  }else if(calsDayPass(date)<=7){
    return `${calsDayPass(date)} days ago`;
  }else{
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

//Định dạng tiền tệ
function formatCurrency(amount, currency, locale) {
  return (new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount))
}

//Hiển thị giao dịch
function displayMovement(acc,sort=false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.sort((a,b)=>b-a) : acc.movements;
  movs.forEach(function(mov,i){

    //tạo ngyaf của từng movement
    const dateMov= new Date(currentAccount.movementsDates[i]);
    console.log(dateMov);
    const dateMovString = formatDateMovs(dateMov) ;

    //TAO NUT XANH ĐỎ
    const type= mov>0 ? 'deposit' : 'withdrawal';
    const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${dateMovString}</div>
    <div class="movements__value">${formatCurrency(mov,acc.currency,acc.locale)}$</div>
  </div>`
  containerMovements.insertAdjacentHTML('afterbegin',html);
  });



}

//Sort btn
let sort = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault()
  displayMovement(currentAccount,!sort)
  sort = !sort;
})

//Tính tổng giao dịch
const calcDisplayBalance = function (acc) {
   acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = formatCurrency(acc.balance, acc.currency, acc.locale);

};

//Tính tổng giao dịch
function calcDisplaySummary(acc){
  const incomes= acc.movements.filter(mov=>mov>0).reduce((acc,move)=>acc+move,0);
  labelSumIn.textContent=`${formatCurrency(incomes,acc.currency,acc.locale)}`

  const out = acc.movements.filter((mov =>mov<0)).reduce((acc,mov)=>acc+mov)
  labelSumOut.textContent=`${formatCurrency(out,acc.currency,acc.locale)}`

  const interest= acc.movements.filter((mov=>mov>0)).map((mov=>mov*acc.interestRate/100)).filter((mov)=>mov>1).reduce((acc,mov)=>acc+mov,0)
  labelSumInterest.textContent=`${formatCurrency(interest,acc.currency,acc.locale)}`
}


function createUserName(accs){
  accs.forEach(function(acc){
 acc.username = acc.owner.toLowerCase().split(' ').map((word)=> word[0]).join('')
})
}
createUserName(accounts);

//Close account
btnLogin.addEventListener('click',function(e){
  e.preventDefault()

  currentAccount = accounts.find(acc=>acc.username===inputLoginUsername.value)

  if (currentAccount.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner}`
    containerApp.style.opacity=1

    inputLoginUsername.value= inputLoginPin.value=''

    // landingPage.style.display='none';
    updateUI(currentAccount)

    

  
  }

})

//update UI
var updateUI= function(acc){
  inputTransferTo.value= inputTransferAmount.value="";
    displayMovement(acc)
    calcDisplayBalance(acc)
    calcDisplaySummary(acc)

    //update timer
    clearInterval(timer)
    timer=startLogOutTimer()
    
}

// Tràner
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value)
  const receiveAcc=accounts.find((acc=>
    acc.username=== inputTransferTo.value))

    if(amount >0 && currentAccount.balance >= amount && currentAccount.username!==receiveAcc?.username&& receiveAcc){
      currentAccount.movements.push(-amount)
      receiveAcc.movements.push(amount)

      currentAccount.movementsDates.push(new Date())
      receiveAcc.movementsDates.push(new Date())
      updateUI(currentAccount)
    }
})

//Loan
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount= Number(inputLoanAmount.value)
  if(amount>0 && currentAccount.movements.some(mov=>mov>= amount*0.1)){
    setTimeout(()=>{
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date())
      updateUI(currentAccount)
    },2000)
  }
  inputLoanAmount.value=''
})


//close account

btnClose.addEventListener('click',function(e){

  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
   const index = accounts.findIndex(acc=>acc.username===currentAccount.username)
    accounts.splice(index,1)
    containerApp.style.opacity=0
    labelWelcome.textContent=`Login to get started`
    inputCloseUsername.value=inputClosePin.value=''
    console.log(accounts)
  }
})

//Hàm tạm đăng xuất 
function startLogOutTimer(){
  let time =600
function tik(){
  
   const min = String(Math.trunc(time/60)).padStart(2,'0')
   const sec = String(time % 60).padStart(2,'0')
   labelTimer.textContent= `${min}:${sec}`
    time--

    if(time<0){
      containerApp.style.opacity=0
      labelWelcome.textContent=`Login to get started`
      inputLoginUsername.value= inputLoginPin.value=''
    }
  }
  tik()
  return setInterval(tik,1000)

  
}


