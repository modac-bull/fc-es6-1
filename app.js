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

function getData(url) {
  ajax.open( 'GET', url, false );
  ajax.send();
  return JSON.parse(ajax.response);
}


// 라우터란 - 중계기 (화면이 여러개가 있다고 하면 A상태 B상태를 상황에 맞게 보여주는 것)
// 글 목록화면의 코드를 함수로 묶어주어야 한다. 
// 목록 화면을 보여주는 함수
function newsFeed() {
  const newsFeed = getData(NEWS_URL); // 데이터를 가져오는 코드
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
  
  container.innerHTML = newsList.join('');
}

// 뉴스 상세 부르는 함수
function newsDetail() { // 해시값이 변경될 경우에 함수 호출
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
}

// 라우터 - 화면이 전환되어야 할 때를 판단
// 기존에 hashchange를 통해 화면 전환 트리거를 사용했음
// 해시가 바뀌면 무조건 글 내용을 보는 것이다 (지금까지는)
// 해시가 바뀔때마다 router함수가 호출되도록 변경
function router() {
  // 시작하자마자 게시글을 한번 보여주어야 한다.
  
  // 실제로 화면을 전화하는 것이 목적
  const routePath = location.hash;
  // 초기 hash값이 없으면 newsFeed 함수를 호출하고
  // '#' 만 들어있을 경우에는 빈값을 반환함
  if(routePath === '') {
    newsFeed();
  } else { // hash값이 존재한다면 newsDetail함수를 호출
    newsDetail();
  }

}

// 글 내용 화면 - 함수로 구성됨
// 이벤트 핸들러함수가 묶여 있을 경우 밖으로 빼낼 방법이 없다..? (무슨 뜻. 익명함수로 되어있으면 부를 방법이 없다.)
window.addEventListener('hashchange', router);


router(); // 초기에 router 함수를 호출