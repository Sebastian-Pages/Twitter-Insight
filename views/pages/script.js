function onClick(){
    let hashtag = document.getElementById('input').value
    console.log(hashtag)
    fetch('https://www.prevision-meteo.ch/services/json/'+hashtag)
    .then(response => response.json())
    .then(data => displayData(data));
}

function displayData(data){
    //clear the data divs
    const elements = document.getElementsByClassName('answer');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    console.log('a')
}

const button_search = document.querySelector('#submit');
button_search.addEventListener('click',onClick);