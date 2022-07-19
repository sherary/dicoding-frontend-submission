let bookshelf = {}

const validateForm = (items) => {
    if (items["title"].length < 2) {
        return "Title is required"
    }
    if (items["author"].length < 2) {
        return "Author is required"
    }
    if (items["year"] > new Date().getFullYear() || items["year"] < 0 || items["year"] == '') {
        return "Insert valid date"
    }
    return true
}

const saveToLocalStorage = (items) => {
    return localStorage[items.id] = JSON.stringify(items)
}

const retrieveAllDataFromLocalStorage = () => {
    for (let i = 0; i < localStorage.length; i++) {
        let element = JSON.parse(localStorage.getItem(localStorage.key(i)));
        bookshelf[element.id] = element
    }

    Object.keys(bookshelf).reduce((previous, key) => {
        return previous + bookshelf[key].value;
    }, 0);

    return bookshelf
}

const retrieveSingleDataFromLocalStorage = (bookID) => {
    return JSON.parse(localStorage.getItem(bookID))
}

const deleteLocalStorageByBookID = (bookID) => {
    return localStorage.removeItem(bookID)
}

const createBookElements = (book) => {
    const element = 
        `<article class="book_item" id="${book.id}">
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        
        <div class="action">
            <button class="green">Belum selesai di Baca</button>
            <button class="red" onclick="deleteBookClicked(${book.id})">Hapus buku</button>
        </div>`

        let bookID = book.id
        let bookNode = document.getElementById(bookID.toString())

        if (!bookNode) {
            if (book.isComplete == true) {
                completeBookshelfList.innerHTML += element
                document.getElementById(bookID.toString()).querySelector('.action > button.green').setAttribute('onClick', `moveBookClicked('incomplete', ${bookID.toString()})`)
            } else {
                incompleteBookshelfList.innerHTML += element
                document.getElementById(bookID.toString()).querySelector('.action > button.green').innerText = "Selesai di baca"
                document.getElementById(bookID.toString()).querySelector('.action > button.green').setAttribute('onClick', `moveBookClicked('complete', ${bookID.toString()})`)
            }
        }
}

const createNewBook = (where, book) => {
    if (typeof book == 'object') {
        saveToLocalStorage(book)
        createBookElements(book)
    } else {
        document.getElementById(book).remove()
        
        let bookObject = retrieveSingleDataFromLocalStorage(book)
        if (where == 'complete') {
            bookObject.isComplete = true
            localStorage.setItem(bookObject["id"], JSON.stringify(bookObject))
        } else {
            bookObject.isComplete = false
            localStorage.setItem(bookObject["id"], JSON.stringify(bookObject))
        }
        createBookElements(bookObject)
    }
}

const moveBookClicked = (where, book) => {
    return createNewBook(where, book)
}

const deleteBookClicked = (bookID) => {
    if (confirm('Are you sure you want to delete this book?')) {
        alert("Book is deleted");
        document.getElementById(bookID).remove()
        return deleteLocalStorageByBookID(bookID)
    } else {
        alert("Book is restored");
        return;
    }
}

const showBookshelfListHandler = () => {
    for (const [booksKey, booksValue] of Object.entries(bookshelf)) {
        createBookElements(booksValue)
    }
}

const submitBook = (e) => {
    e.preventDefault();

    let book = {
        id: +new Date(),
        title: inputBookTitle.value,
        author: inputBookAuthor.value,
        year: +inputBookYear.value,
        isComplete: inputBookIsComplete.checked,
    }

    if (validateForm(book) != true) {
        window.alert(validateForm(book))
    } else {
        //reset form
        document.getElementById('inputBook').reset();

        createNewBook('all', book)
    }
}

const isCompleteChecked = () => {
    if (inputBookIsComplete.checked == true) {
        document.querySelector('#bookSubmit > span').textContent = "Selesai dibaca"
    } else {
        document.querySelector('#bookSubmit > span').textContent = "Belum selesai dibaca"
    }
}

const hideTheRest = (bookInfos) => {
    if (bookInfos.length == 0) {
        for (const [booksKey, booksValue] of Object.entries(bookshelf)) {
            let element = document.getElementById(booksValue.id)
            element.style.display = "block"
        }
    }

    for (let i = 0 ; i < bookInfos.length; i++) {
        let element = document.getElementById(bookInfos[i])
        element.style.display = "none"
    }
}

const bookResults = (title) => {
    let hideInfos = []

    if (title == '') return hideTheRest(hideInfos)
    
    for (const [booksKey, booksValue] of Object.entries(bookshelf)) {
        const a = title.toLowerCase().split(' ')
        const b = booksValue.title.toLowerCase().split(' ')
        let num = 0
        
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (a[i] == b[j]) {
                    num += 1
                }
            }
        }

        if (num == 0) {
            hideInfos.push(booksValue.id)
        }
    }

    return hideTheRest(hideInfos)
}

const searchBookByInput = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        return bookResults(searchBookTitle.value)
    }
}

const searchBookByButton = (e) => {
    e.preventDefault();
    return bookResults(searchBookTitle.value)
}

isCompleteChecked()
retrieveAllDataFromLocalStorage()
showBookshelfListHandler()

const submitButton = document.getElementById('bookSubmit')
const searchSubmit = document.getElementById('searchSubmit')
const searchInput = document.getElementById('searchBookTitle')

searchSubmit.addEventListener('click', searchBookByButton)
searchInput.addEventListener('keypress', searchBookByInput)
submitButton.addEventListener("click", submitBook)
