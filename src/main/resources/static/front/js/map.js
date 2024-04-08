document.addEventListener('DOMContentLoaded', function() {

    const addressInput = document.getElementById('address');
    const searchBtn = document.getElementById('submit');

    function searchNaverAPI(query) {
        var clientId = 'P7JNwPbBMfUZIbLaDtYE';
        var clientSecret = '0yvZtJuEsX';
        var apiURL = 'https://openapi.naver.com/v1/search/local.json?query=' + encodeURIComponent(query);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiURL);
        xhr.setRequestHeader('X-Naver-Client-Id', clientId);
        xhr.setRequestHeader('X-Naver-Client-Secret', clientSecret);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    console.log(response); // 검색 결과 확인
                    // 여기서 검색 결과를 활용하여 원하는 작업 수행
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            }
        };
    }

    searchBtn.addEventListener('click', function () {
        var searchAddress = addressInput.value.trim();
        if (searchAddress !== '') {
            searchNaverAPI(searchAddress);
        } else {
            alert('검색할 주소를 입력해주세요.')
        }
    })


});