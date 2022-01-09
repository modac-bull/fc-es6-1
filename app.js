const container = document.getElementById('root');
//  데이터는 HN 사이트에 있음
// 네트워크 너머에 있는 데이터를 가져와야함
// AJAX
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"; // 마킹 @id
// 어떻게 클릭했는지 알 수 있을까? -> 이벤트를 활용
const content = document.createElement('div');

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

window.addEventListener('hashchange', function() { // 해시값이 변경될 경우에 함수 호출
  console.log('hashchange');
  // location - 브라우저가 기본으로 제공해주는 객체. 
  // 주소와 관련된 다양한 정보들을 제공해준다. 
  const id = location.hash.substring(1)
  ajax.open('GET', CONTENT_URL.replace('@id', id), false); 
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  console.log(newsContent);

  const title = document.createElement('h1');
  
  content.appendChild(title);
  title.innerHTML = newsContent.title;

});

// 목록 리스트 데이터의 구조를 만들어 둔다.
/* 
ul
  li
    a
*/
for (let i = 0 ; i < 10; i++) {
  const div = document.createElement('div') ; // 임시로 div를 만들어 안에 li태그를 생성, 사용한다.
  const li = document.createElement('li'); // for문에서 li를 새로 매번 만들어준다.
  const a = document.createElement('a'); // a태그에 href속성이 없어서 링크 기능이 사용되지 않는다.


  // 문자열을 가지고 html 구조를 만드는 것이 파악하기 쉽다.
  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}"> 
        ${newsFeed[i].title} (${newsFeed[i].comments_count}) 
      <a>
    </li>
  `
  // div에 추가된 li만 사용하는 방법
  // 1. div.children[0]
  // 2. div.firstElementChild
  ul.appendChild( div.firstElementChild ) ; 
}

container.appendChild(ul); // ul태그를 root 자식요소로 만든다.
container.appendChild(content); // 버그 발생(기존 제목은 그대로 남아있음)

// 똑같은 코드가 반복되는것은 좋지 않다.
// document.getElementById() -> 변수로 묶는다.