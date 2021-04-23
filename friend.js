const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const users = JSON.parse(localStorage.getItem('friends'))
const FRIENDS_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
              <button class="btn btn-danger btn-remove-friend" data-id="${item.id}">X</button>
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

function removeFromFriend(id) {
  if (!users) return
  // 透過id找到要刪除好友的index
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  //刪除該筆電影
  users.splice(userIndex, 1)

  // 存回 local storage
  localStorage.setItem('friends', JSON.stringify(users))

  // 更新頁面
  renderUserList(users)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-info')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-friend')) {
    removeFromFriend(Number(event.target.dataset.id))
  }
})
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 取消預設事件
  event.preventDefault()
  let filteredUsers = []
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
  // 重新輸出至畫面
  renderUserList(filteredUsers)
})


renderUserList(users)