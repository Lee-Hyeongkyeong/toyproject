const baseURL = "http://52.79.195.195:8000/post/";

function openWindow() {
    const options = 'width=700, height=600, top=50, left=50, scrollbars=yes'
    window.open('note.html','_blank',options)
}

function openDelete(id) {
    const options = 'width=400, height=220, top=100, left=100, scrollbars=no';
    window.open(`delete.html?id=${id}`, '_blank', options);
}

const container = document.getElementById("card_section");
const modal = document.getElementById('card-modal');
const modalTitle = modal.querySelector('.modal-title');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.close-btn');

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


// 카드 생성 함수
function createCard(post) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = post.id;

    // 제목
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    cardTitle.textContent = post.title || '제목없음';

    // 구분선
    const cardDivider = document.createElement('hr');
    cardDivider.className = 'card-divider';

    // 내용
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    cardContent.textContent = post.content || '';

    // 삭제 버튼
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'card-delete-button';
    deleteButton.textContent = '삭제하기';
    deleteButton.onclick = (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트와 분리
        openDelete(post.id);
    };

    cardFooter.appendChild(deleteButton);

    // 카드 조립
    card.appendChild(cardTitle);
    card.appendChild(cardDivider);
    card.appendChild(cardContent);
    card.appendChild(cardFooter);

    // 카드 클릭 시 모달 오픈
    card.addEventListener('click', () => {
        showModal(post);
    });

    container.appendChild(card);
}

// 모달 열기
function showModal(post) {
    modalTitle.textContent = post.title || '제목없음';
    modalBody.textContent = post.content || '';
    modal.style.display = 'flex';
}

// 모달 닫기
closeBtn.onclick = function() {
    modal.style.display = 'none';
};
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
window.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

window.addEventListener('load', loadNote);

// 방명록 추가 후 새로고침을 위한 이벤트 리스너 (팝업 창에서 메시지 받기)
window.addEventListener('message', function(event) {
    if (event.data === 'refreshNotes') {
        loadNote();
    }
});