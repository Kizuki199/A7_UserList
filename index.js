const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const users = []
let filteredUsers = []

const USERS_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderUserList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${item.avatar}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-info" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-friend" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}
function showUserModal(id) {
  const modalName = document.querySelector('#user-modal-name');
  const modalEmail = document.querySelector('#user-modal-email');
  const modalGender = document.querySelector('#user-modal-gender');
  const modalAge = document.querySelector('#user-modal-age');
  const modalRegion = document.querySelector('#user-modal-region');
  const modalBirthday = document.querySelector('#user-modal-birthday');
  const modalAvatar = document.querySelector('#user-modal-avatar');

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalName.innerText = `${data.name} ${data.surname}`;
    modalEmail.innerText = `Email: ${data.email}`;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalRegion.innerText = `Region: ${data.region}`
    modalBirthday.innerText = `Birthday: ${data.birthday}`
    modalAvatar.innerHTML = `<img
                src="${data.avatar}"
                alt="movie-poster" class="img-fluid">`;
  })
}

function addFriend(id) {
  const list = JSON.parse(localStorage.getItem('friends')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此用戶已經在好友名單中!')
  }
  list.push(user)
  localStorage.setItem('friends', JSON.stringify(list))
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  // 計算起始index
  const startIndex = (page - 1) * USERS_PER_PAGE
  // 回傳切割後的新陣列
  return data
  .slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  // 製作 template
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  // 放回 HTML
  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-info')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-friend')) {
    addFriend(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  // 透過dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  // 更新畫面
  renderUserList(getUsersByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 取消預設事件
  event.preventDefault()

  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  // 錯誤處理:輸入無效字串
  if (!keyword.length) {
    return alert('請輸入有效字串')
  }
  // 條件篩選
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )
  // 錯誤處理:無符合條件的結果
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件用戶`)
  }
  renderPaginator(filteredUsers.length)
  // 重新輸出至畫面
  renderUserList(getUsersByPage(1))
})


axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))
