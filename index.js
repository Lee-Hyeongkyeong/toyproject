const baseURL = "http://52.79.195.195:8000/post/"

function openWindow() {
    const options = 'width=700, height=600, top=50, left=50, scrollbars=yes'
    window.open('note.html','_blank',options)
}

function openDelete(id) {
    const options = 'width=400, height=220, top=100, left=100, scrollbars=no';
    window.open(`delete.html?id=${id}`, '_blank', options);
}

const container = document.getElementById("card_section");

async function loadNote() {
    try {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log(data);

        const posts = data.data || [];

        if (posts.length === 0) {
            container.innerHTML = '<p>아직 방명록이 없습니다. 첫 번째 방명록을 남겨보세요!</p> <style> p {text-align: center;} </style>';
            return;
        }

        posts.forEach(post => {
            createCard(post);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>방명록을 불러오는 데 실패했습니다.</p> <style> p {text-align: center;} </style>';
    }
}


function createCard(post) {

    // 전체 카드 구조
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = post.id;
    
    // 제목
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    cardTitle.textContent = post.title;
    
    // 구분선
    const cardDivider = document.createElement('hr');
    cardDivider.className = 'card-divider';
    
    // 내용
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    cardContent.textContent = post.content;
    
    // 삭제 버튼
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'card-delete-button';
    deleteButton.textContent = '삭제하기';
    deleteButton.onclick = () => {
        openDelete(post.id, post.password);
    };
    
    cardFooter.appendChild(deleteButton);
    card.appendChild(cardTitle);
    card.appendChild(cardDivider);
    card.appendChild(cardContent);
    card.appendChild(cardFooter);

    container.appendChild(card);
}

window.addEventListener('load', loadNote);

// 방명록 추가 후 새로고침을 위한 이벤트 리스너 (팝업 창에서 메시지 받기)
window.addEventListener('message', function(event) {
    if (event.data === 'refreshNotes') {
        loadNote();
    }
});