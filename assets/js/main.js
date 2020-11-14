window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class setCards{
        constructor(){
            this.data = [];
            this.filterData = [];
            this.stepCardUpload = 10;
            this.btnMore = document.getElementById('more');
        }

        animateCard(){

        }

        generateCard(){
            const cards = document.querySelector('.cards'),
                iterator = this.filterData.length > 0 ? this.filterData : this.data;

            cards.innerHTML = '';

            iterator.forEach((item, i) => {
                if(i >= this.stepCardUpload) return;

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

                card.addEventListener('click', () => this.modal(item));

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
                target.value.toLowerCase() === 'all' ?
                    (this.filterData = [], 
                        this.stepCardUpload = 10, 
                        this.btnMore.style.display = 'block', 
                        this.generateCard()) : (this.generateCard(), this.btnMore.style.display = 'none');
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

        modal({name, species, birthDay, deathDay, actors, citizenship}){
            const closeBtn = document.querySelector('.modal-close'),
                title = document.getElementById('content-title'),
                text = document.getElementById('content-text');

            title.textContent = `Подробнее о ${name}`;
            text.innerHTML = `
                <p>Национальность: ${citizenship ? citizenship : 'неизвестно'}</p>
                <p>Вид: ${species ? species : 'неизвестно'}</p>
                <p>Год рождения: ${birthDay ? birthDay : 'неизвесно'}</p>
                <p>Актер: ${actors ? actors : 'неизвестено'}</p>
                <p>Год смерти: ${deathDay ? deathDay : 'неизвестно'}</p>
            `;

            this.openModal();

            closeBtn.addEventListener('click', this.closeModal);
        }

        openModal(){
            document.querySelector(".modal").classList.add("is_open");
        }
        
        closeModal(){
            document.querySelector(".modal").classList.add("is_closing");
                setTimeout(() => {
                  document.querySelector(".modal").classList.remove("is_closing");
                  document.querySelector(".modal").classList.remove("is_open");
            }, 300);
        }

        uploadCardMore(){

            this.btnMore.addEventListener('click', () => {
                this.stepCardUpload += 10;
                this.generateCard();

                if(this.stepCardUpload >= this.data.length){
                    this.btnMore.style.display = 'none';
                }
            });
        }

        init(){
            this.getAJAXCard();
            this.uploadCardMore();
        }
    }


    const card = new setCards();
    card.init();

});

