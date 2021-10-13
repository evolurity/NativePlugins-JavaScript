let fruits = [
    {
        id: 1,
        title: 'Яблоки',
        price: 20,
        img: 'https://e1.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg?1487746348'
    },
    {
        id: 2,
        title: 'Апельсины',
        price: 30,
        img: 'https://fashion-stil.ru/wp-content/uploads/2019/04/apelsin-ispaniya-kg-92383155888981_small6.jpg'
    },
    {
        id: 3,
        title: 'Манго',
        price: 40,
        img: 'https://itsfresh.ru/upload/iblock/178/178d8253202ef1c7af13bdbd67ce65cd.jpg'
    }
]

// realization 1.
function toHTML(fruit) {
    return `
            <div class="col">
                <div class="card">
                    <img style="height: 300px" src=${fruit.img} class="card-img-top" alt=${fruit.title}>
                    <div class="card-body">
                        <h5 class="card-title">${fruit.title}</h5>
                        <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Show price</a>
                        <a href="#" class="btn btn-danger" data-btn="delete" data-id="${fruit.id}">Delete</a>
                    </div>
                </div>
            </div>
            `
}

function render() {
    const html = fruits.map(toHTML).join('');
    document.querySelector('.row').innerHTML = html;
}

const priceModal = $.modal({
    title: 'Price',
    closable: true,
    width: '400px',
    footerButtons: [
        {
            text: 'Close',
            type: 'primary',
            handler() {
                priceModal.close()
            }
        }
    ]
})
render()

document.addEventListener('click', event => {
    event.preventDefault()
    const btnType = event.target.dataset.btn;
    const id = +event.target.dataset.id;
    const fruit = fruits.find(f => f.id === id);

    if (btnType === 'price') {
        priceModal.setContent(`
        <p>Price ${fruit.title}: <strong>${fruit.price}$</strong></p>
        `)
        priceModal.open()
    } else if (btnType === 'delete') {
        $.confirm({
            title: 'Are you agree?',
            content: `You are deleted this fruit: <strong>${fruit.title}</strong>`
        })
            .then(() => {
                fruits = fruits.filter(f => f.id !== id);
                render();
            })
    }
})


///////////////
//realization 2.
const renderFruitComponent = (fruits) => {
    function deleteFruit(index) {
        const el = document.querySelectorAll('.col')[index];
        el.parentNode.removeChild(el);
    }

    function showModal({textTitle, textContent, footerButtons, handlerType, indexFruitToDelete}) {
        let modal;
        if (handlerType === 'show') {
            const footerButtonsWithHandler = footerButtons.map(button => {
                return {
                    ...button,
                    handler() {
                        modal.close();
                    }
                }
            })
            modal = $.modal({
                title: textTitle,
                content: textContent,
                closable: true,
                width: '400px',
                footerButtons: footerButtonsWithHandler
            });
        } else if (handlerType === 'delete') {
            const footerButtonsWithHandler = footerButtons.map((button, index) => {
                if (index === 0) {
                    return {
                        ...button,
                        handler() {
                            deleteFruit(indexFruitToDelete);
                            modal.close();
                            modal.destroy();
                        }
                    }
                } else return {
                    ...button,
                    handler() {
                        modal.close();
                    }
                }
            })
            modal = $.modal({
                title: textTitle,
                content: textContent,
                closable: true,
                width: '400px',
                footerButtons: footerButtonsWithHandler
            });
        }
        modal.open()
    }

    function createButton(buttonType, buttonTextContent, showModalOptions) {
        const showButton = document.createElement('button');
        showButton.classList.add("btn");
        showButton.classList.add("btn-" + buttonType);
        showButton.textContent = buttonTextContent;
        showButton.onclick = () => showModal(showModalOptions);
        return showButton;
    }

    function renderCard(fruit) {
        return `
                <div class="col">
                    <div class="card">
                        <img style="height: 300px" src=${fruit.img} class="card-img-top" alt=${fruit.title}>
                        <div class="card-body">
                            <h5 class="card-title">${fruit.title}</h5>
                        </div>
                    </div>
                </div>
                `
    }

    return fruits.forEach((fruit, index) => {
            const showPriceButton = createButton('primary', 'Show price', {
                textTitle: 'Цена',
                textContent: 'Цена ' + fruit.title + ' cоставляет ' + fruit.price + ' руб.',
                footerButtons: [
                    {
                        text: 'Ok',
                        type: 'primary',
                    }
                ],
                handlerType: 'show'
            });
            const deleteButton = createButton('danger', 'Delete', {
                textTitle: 'Удаление',
                textContent: 'Вы хотите удалить ' + fruit.title,
                footerButtons: [
                    {
                        text: 'Yes',
                        type: 'danger',
                    },
                    {
                        text: 'No',
                        type: 'primary',
                    }
                ],
                handlerType: 'delete',
                indexFruitToDelete: index
            });
            document.querySelector('.row').insertAdjacentHTML('beforeend', renderCard(fruit));
            document.querySelectorAll('.card-body')[index].appendChild(showPriceButton);
            document.querySelectorAll('.card-body')[index].appendChild(deleteButton);
        }
    )
}
// renderFruitComponent(fruits);

