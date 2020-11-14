window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class setCards{
        constructor(){
            this.data = [];
            this.filterData = [];
        }

        generateCard(){
            const cards = document.querySelector('.cards')
            cards.innerHTML = '';
        
            const iterator = this.filterData.length > 0 ? this.filterData : this.data;

            iterator.forEach((item) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.insertAdjacentHTML('beforeend', `
                    <div class="card-image">
                        <img src="assets/img/${item.photo}">
                    </div>
                    <div class="card-info">
                        <h2>Имя: ${item.name}</h2>
                        ${item.realName ? `<p>Настоящие имя: ${item.realName}</p>` : ''}
                        <p>Пол: ${item.gender}</p>
                        <p>Статус: ${item.status}</p>
                        <p>Фильмы: ${item.movies}</p>
                    </div>
                `);
                cards.append(card);
            });

            this.filterData = [];
        }    

        parseMovies(){
            if(this.data === '') return;

            const rowListMovies = this.data.reduce((acc, item) => acc.concat(item.movies), []),
                listMovies = rowListMovies.filter((item, i) => item && rowListMovies.indexOf(item) === i);

            this.generateCard();
            this.filter(listMovies);

        }

        filter(movies){
            const film = document.getElementById('film'),
                selectMovies = document.getElementById('select-movies');
            
            if(movies){
                movies.unshift('All');
                movies.forEach((item) => {
                    const newOption = document.createElement('option');
                    newOption.value = item;
                    newOption.textContent = item;

                    selectMovies.appendChild(newOption);
                });
            }

            selectMovies.addEventListener('change', (event) => {
                const target = event.target;

                this.data.forEach((item) => {
                    if(item.movies){
                        item.movies.forEach((movie) =>{
                            if(movie.toLowerCase() === target.value.toLowerCase()){
                                this.filterData.push(item);
                            }
                        });
                    }
                });
                film.textContent = target.value;
                target.value.toLowerCase() === 'all' ? (this.filterData = [], this.generateCard()) : this.generateCard();
            });
            
        }

        getAJAXCard(){

            const request = new XMLHttpRequest();

            request.addEventListener('readystatechange', () => {
                if(request.readyState !== 4){
                    return;
                }

                request.status === 200 && request.readyState === 4 ?
                    (this.data = JSON.parse(request.responseText), this.parseMovies()) : '';
            });

            request.open('GET', '../../dbHeroes.json');
            request.send();

        }

        init(){
            this.getAJAXCard();
        }
    }


    const card = new setCards();
    card.init();

});

