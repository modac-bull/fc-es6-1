//  데이터는 HN 사이트에 있음
// 네트워크 너머에 있는 데이터를 가져와야함
// AJAX
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json"
// let, const
// let : ajax에 다른 값을 넣을 수 있다. (변수)
// const : 다른 데이터를 넣을 수 없다. (상수)
ajax.open(
  'GET', // GET 방식
  NEWS_URL,
  false // 동기적으로 처리하겠다.
);
ajax.send(); // 데이터를 가져옴
// console.log(ajax.response) // 가져온 데이터 확인
// 입력 데이터를 가져오는데에는 성공
// 가져온 데이터를 다루는 과정
// XHR : XML Http Request
const newsFeed = JSON.parse(ajax.response);
// 객체로 바꾸기



/* ===================================================
            출력
=================================================== */
//  ul li라는 태그로 어떻게 바꾸지?

// 문자열 백틱 ` 사용안에 변수를 사용하기 위해서는? ${}
// 하드코딩 과정
// document.getElementById('root').innerHTML = `<ul>
//   <li>${newsFeed[0].title}</li>
//   <li>${newsFeed[1].title}</li>
//   <li>${newsFeed[2].title}</li>
// </ul>`
// 0..1..2 반복패턴

// 반복코드 사용하기
// for문

// for (let i = 0 ; i < 10; i++) {
//     document.getElementById('root').innerHTML = `<ul>
//       <li>${newsFeed[i].title}</li>
//     </ul>`;
// }
const ul = document.createElement('ul'); // ul 태그를 만든다.
document.getElementById('root').appendChild(ul); // ul태그를 root 자식요소로 만든다.
for (let i = 0 ; i < 10; i++) {
  const li = document.createElement('li'); // for문에서 li를 새로 매번 만들어준다.
  li.innerHTML = newsFeed[i].title;
  ul.appendChild( li )
}
