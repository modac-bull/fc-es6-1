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
  // content.appendChild(title); // 추가하는 코드만 있다.
  // title.innerHTML = newsContent.title; 
  
  // 내용화면으로 진입 시 목록화면을 지워주는 코드
  // 목록화면을 지우고 새로운 화면(제목 + 콘텐츠 + 목록으로 버튼) UI를 그린다.
  // 사용자는 새로운 화면으로 진입했다고 느낄 것
  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#">목록으로</a>
    </div>
  `; // 기존 내용이 전부 제거, div#root 하위요소에 '' 빈 내용 삽입
  
  
});

// 다음 단계 - // 목록 구조도 똑같은 구조여야 한다.
// 문자열 자체를 for만으로 만들 수 없다. 
// 배열을 이용하고자 한다. (자주 쓰이는 테크닉)
// 1. 빈 배열을 만들고
// 2. 배열.push('<ul>'); 
//        <li> <a></a> </li> -> li구조 반복되게
// 3. 마지막으로 배열.push('</ul>');
// 4. 최종적으로 innerHTMl 전에 배열.jon(''); 하나의 문자열로 만들어준다.
const newsList = [];
newsList.push(`<ul>`);
for (let i = 0 ; i < 10; i++) {
  // DOM API 제거실습
  newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}"> 
        ${newsFeed[i].title} (${newsFeed[i].comments_count}) 
      <a>
    </li>
  `);
}
newsList.push(`</ul>`);
console.log(newsList.join(''));
container.innerHTML = newsList.join('');

// 라우터란 - 중계기 (화면이 여러개가 있다고 하면 A상태 B상태를 상황에 맞게 보여주는 것)
