const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"; // 마킹 @id
const content = document.createElement('div');

// 입력은 인자로 받을 수 있음
// function getData(url) {
//   ajax.open( 'GET', url, false );
//   ajax.send();
// }

const getData = function(url) {
  ajax.open( 'GET', url, false );
  ajax.send();
  return JSON.parse(ajax.response);
}
const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul'); // ul 태그를 만든다.

window.addEventListener('hashchange', function() { // 해시값이 변경될 경우에 함수 호출
  const id = location.hash.substring(1)
  const newsContent =  getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');
  content.appendChild(title);
  title.innerHTML = newsContent.title;
});

for (let i = 0 ; i < 10; i++) {
  const div = document.createElement('div') ; // 임시로 div를 만들어 안에 li태그를 생성, 사용한다.
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