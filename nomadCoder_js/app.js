
const a = 5;
const b = 2;
let myName="gunha";

console.log(a + b);
console.log(a * b);
console.log(a / b);
console.log("hello "+myName);

myName="nicolas";

console.log("your new name is "+ myName)

const amIFat = null;
let something;
console.log(amIFat)
console.log(something)
//null 과 undefined 는 다르다.
//undefiend 변수는 만들었지만, 값이 들어있지 않다.
//메모리에 컴퓨터가있다는 것을 인지하고있다.
//null은 없다는 것으로 채운것

const mon = "mon";
const tue = "tue";
const wed = "wed";
const thu = "thu";
const fri = "fri";
const sat = "sat";
const sun = "sun";

const daysOfWeek = [mon, tue, "wed", thu, fri, sat ,sun];

const nonsense = [1,2,"hello",false ,null,true,undefined,"nico"]

console.log(daysOfWeek);
// Get Item from Array
console.log(daysOfWeek[6]);
//Add one more day to the arry
daysOfWeek.push("sunddd");
console.log(daysOfWeek);

//object 예제
const player = { 
    name : "nico",
    points : 10,
    fat:true
};

console.log(player)
player.points = player.points+15;

console.log(player)

console.log("hello my name is nico");
function sayhello(nameOfPerson, age){
    console.log("Hello my name is "+nameOfPerson+"and I'm "+age);
}
sayhello("nico",10);
sayhello("dal",23);
sayhello("lynn");

function plus(a, b){
    console.log(a+b);
}
plus(8,60);

function divide(a,b){
    console.log (a/b);
}

divide(98,20)

const py = {
    name : "nico",
    sayHello: function(otherPersonsName){
        console.log("helo!"+otherPersonsName);
    },
}

console.log(py.name);
py.sayHello("lynn");

const toBuy = ["potato", "tomato", "pizza"];
console.log(toBuy[2]);
toBuy[2] = "water";
console.log(toBuy[2]);

const calculator = {
    plus:function(a,b){
        console.log(a+b);
    },
    minus: function(a,b){
        console.log(a-b);
    },
    divide:function(a,b){
        console.log(a/b);
    }, 
    poweroff:function(a,b){
        console.log(a**b);
    }
}

calculator.plus(1,2);
calculator.minus(1,2);
calculator.divide(1,2);
calculator.poweroff(1,2);