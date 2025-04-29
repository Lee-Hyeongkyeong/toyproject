const baseURL = '/api/post/'
import.meta.env.PROD
  ? "/api" // 프로덕션 환경
  : "http://52.79.195.195:8000/post"; // 개발 환경


class Note {
    constructor(title, content, password) {
        this.title = title;
        this.content = content;
        this.password = password;
    }
}


document.getElementById('note-form').addEventListener('submit', async (e) => {

    e.preventDefault(); // 페이지 새로고침 방지

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const password = document.getElementById('password').value;

    const newNote = new Note (
        title,
        content,
        password
    );
    
    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newNote.title,
                content: newNote.content,
                password: newNote.password
            })
        }).then(response => response.json())
        .then(data => console.log('User created:', data));

        //const data = await response.json();
        //console.log('게시글 생성 결과: ', data);
        alert('등록 성공!');
        window.close();

    } catch (error) {
        console.error('Error:', error);
        alert('오류 발생: '+error);
    }
});

