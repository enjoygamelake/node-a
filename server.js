const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
// 정적 파일이 있는 디렉터리 설정
app.use(express.static(path.join(__dirname, '2126_antique_cafe', 'public')));

// Sample data storage
let requests = [];
let nextId = 1; // 요청 ID를 위한 카운터

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '2126_antique_cafe', 'public', 'index.html'));
});
app.set('views', path.join(__dirname, 'views')); 

// Request item route
app.post('/request', (req, res) => {
    const { itemName, requesterName, latlon} = req.body;
    requests.push({ id: nextId++, itemName, requesterName, latlon ,status: 'pending' }); // ID와 상태 추가
    res.redirect('/');
});

// Admin route to view requests
app.get('/admin', (req, res) => {
    res.render('admin', { requests: requests });  // 'requests' 배열을 'admin' 뷰에 전달
});

app.get('/index1', (req, res) => {
    res.render('index1', { requests: requests });  // 'requests' 배열을 'admin' 뷰에 전달
});

// Accept request handler
app.post('/admin/accept/:id', (req, res) => {
    const requestId = parseInt(req.params.id); // ID를 정수로 변환
    const request = requests.find(req => req.id === requestId);
    if (request) {
        request.status = 'accepted'; // 상태를 'accepted'로 변경
    }
    res.redirect('/admin'); // 관리자 페이지로 리다이렉트
});

// Reject request handler
app.post('/admin/reject/:id', (req, res) => {
    const requestId = parseInt(req.params.id); // ID를 정수로 변환
    const request = requests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected'; // 상태를 'rejected'로 변경
    }
    res.redirect('/admin'); // 관리자 페이지로 리다이렉트
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
