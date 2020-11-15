window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class setCards{
        constructor(btnMore, selectMovies, selectGenders, selectStatus, nameHero){
            this.data = [];
            this.filterData = [];
            this.stepCardUpload = 10;
            this.btnMore = btnMore;
            this.selectMovies = selectMovies;
            this.selectGenders = selectGenders;
            this.selectStatus = selectStatus;
            this.nameHero = nameHero;
        }

        burgerMenu(){
            const burger = document.getElementById('sandwichmenu'),
                sortMenu = document.querySelector('.sort');
            burger.addEventListener('click', (event) => {
                event.preventDefault();
                burger.classList.toggle('active');
                sortMenu.classList.toggle('active');
            });
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

        generateOption(select, item){
            const newOption = document.createElement('option');
            newOption.value = item;
            newOption.textContent = item;

            select.appendChild(newOption);
        }

        projection(field, obj){
            const rowList = obj.reduce((acc, item) => acc.concat(item[field]), []);
            return rowList.filter((item, i) => item && rowList.indexOf(item) === i);
        }

        parseData(){
            if(this.data === '') return;

            this.projection('movies', this.data)
                .forEach(item => this.generateOption(this.selectMovies, item));
            this.projection('status', this.data)
                .forEach(item => this.generateOption(this.selectStatus, item));
            this.projection('gender', this.data)
                .forEach(item => this.generateOption(this.selectGenders, item));

            this.generateCard();
            this.filter();

        }

        filtered(target, field){
            this.data.forEach(item => {
                if(item[field]){
                    [item[field]].forEach((key) => {
                        if(Array.isArray(key))
                            key.forEach(i => i.toLowerCase() === target.value.toLowerCase() ? this.filterData.push(item) : '');
                        else if(key.toLowerCase().includes(target.value.toLowerCase().trim())){
                            this.filterData.push(item);
                        }
                    });
                }
            });
            this.generateCard();
        }

        filter(){
            const sortContent = document.querySelector('.sort-content');

            sortContent.addEventListener('input', (event) => {
                const target = event.target;

                switch(target){
                    case this.selectMovies: this.filtered(target, 'movies');
                        break;
                    case this.selectStatus: this.filtered(target, 'status');
                        break;
                    case this.selectGenders: this.filtered(target, 'gender');
                        break;
                    case this.nameHero: this.filtered(target, 'name');
                        break;
                }
            });
        }

        getData(){

            fetch('../../dbHeroes.json')
                .then(response => response.json())
                .then(heroes => (this.data = heroes, this.parseData()))
                .catch(error => {
                    throw new Error(error);
                });

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
            this.getData();
            this.uploadCardMore();
            this.burgerMenu();
        }
    }

    const selectMovies = document.getElementById('select-movies'),
        selectGender = document.getElementById('select-gender'),
        selectStatus = document.getElementById('select-status'),
        btnMore = document.getElementById('more'),
        nameHero = document.getElementById('name-herro__input'),
        card = new setCards(btnMore, selectMovies, selectGender, selectStatus, nameHero);

    card.init();

});

