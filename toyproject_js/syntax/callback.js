
// function a() {
//    console.log('A'); 
// }

let a = function(){
    console.log('A');
}
a();


// 자바스크립트에서 함수는 값에 넣을 수 있다.
// a(); 로 하면 변수에 할당된 함수를 실행시킬 수 있음
function slowfunc(callback){
    callback();
}

slowfunc(a);

// 이를 응용한게 콜백함수임