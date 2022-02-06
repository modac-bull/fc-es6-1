const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"; // 마킹 @id
const content = document.createElement('div');
// 여러 함수에 걸쳐 공유되는 자원들을 하나로 묶어 놓는다. 
// 다른 데이터들도 추가될수 있기 때문에
const store = {
  currentPage : 1, // 현재 페이지 초기값 1
  maxPage : null,
};


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
  store.maxPage = Math.round(newsFeed.length / 10);
  console.log(store.maxPage);

  // 코드의 양은 늘어나더라도 복잡도가 늘어나지 않도록 작업해야 한다.
  // 내용이 복잡해지면 문제발생 ...  배열을 최소화 --> 템플릿 방식 사용 (주조 , 몰딩 생각)
  // UI가 어떤 구조인지 명확하게 알 수 있다. + Marking도 잘 확인 할 수 있음
  // 즉, 복잡도를 줄일 수 있다.
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">Previous</a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500">Next</a>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 text-exl text-gray-700">
        {{__news_feed__}}
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10 ; i < store.currentPage * 10; i++) {
    // DOM API 제거실습
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
    `)
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage -1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);
  
  container.innerHTML = template;
}

// 뉴스 상세 부르는 함수
function newsDetail() { // 해시값이 변경될 경우에 함수 호출
  const id = location.hash.substring(7);
  const newsContent =  getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;


  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>    
      `)
      // 커멘트 자체에 커멘트가 또 있을 수 있다.
      if(comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1)); // 재귀호출 --> 익숙해져야 하는 구조
      }
    }

    return commentString.join('');
  }
  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
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
    // 목록화면에서 넘어갈때 현재 currentPage값을 사용
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) { // hash값이 존재한다면 newsDetail함수를 호출
    store.currentPage = Number(routePath.substring(7));
    console.log(routePath.substring(7))
    // 페이지네이션
    // store.currentPage = 2; // 하드코딩
    newsFeed();
  } else {
    newsDetail();
  }

}

// 글 내용 화면 - 함수로 구성됨
// 이벤트 핸들러함수가 묶여 있을 경우 밖으로 빼낼 방법이 없다..? (무슨 뜻. 익명함수로 되어있으면 부를 방법이 없다.)
window.addEventListener('hashchange', router);


router(); // 초기에 router 함수를 호출