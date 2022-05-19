'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const balanceDate = document.querySelector(".balance__date");
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



const dateFunction = new Date();
balanceDate.innerHTML = dateFunction.toLocaleDateString();



const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) =>
    a - b) : movements;

  movs.forEach((mov, i) => {

    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
   <div class="movements__row">
     <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
     <div class="movements__value">${mov}€</div>
   </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);

  });

};



const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (prev, current) {
    return prev + current;

  })
  labelBalance.innerHTML = `${acc.balance} €`;
}




// summary balance
const calDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((prev, current) =>
    prev + current
  )
  console.log(incomes)
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements.filter(mov => mov < 0).reduce((prev, current) => prev + current)
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 0
    })
    .reduce((prev, current) => prev + current)
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
}



//user name 

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(" ").map(function (name) {
      return name[0];
    }).join("")
  })
}


createUsernames(accounts);
console.log(accounts)


// function to update UI
const updateUI = function (acc) {
  displayMovements(acc.movements)
  calcDisplayBalance(acc)
  calDisplaySummary(acc)
}



let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount)

  if (currentAccount.pin === Number(inputLoginPin.value)) {

    labelWelcome.textContent = ` Welcome Back, ${currentAccount.owner.split(" ")[0]}`;

  };
  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();

  updateUI(currentAccount);

})

btnTransfer.addEventListener("click", function (e) {

  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (amount > 0 && reciverAcc && currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
})


btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex
      (acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    console.log(index);
    containerApp.style.opacity = 0;
    console.log(accounts)
  }
  inputCloseUsername.value = inputClosePin.value = "";

})


btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    currentAccount.movements.push(amount)
    updateUI(currentAccount);

  }
  inputLoanAmount.value = "";

})

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})







