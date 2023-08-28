// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require("electron");
const items = require('./items')

const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

search.addEventListener('keyup', e => {
    Array.from( document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch  = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    })
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
});

const toggleModalButtons = () => {
    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

//show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

//hide modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

// handle new item
addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        ipcRenderer.send('new-item', itemUrl.value);
        toggleModalButtons();
    }
});

// handle new item
itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click();
    }
});

ipcRenderer.on('new-item-success', (e, data) => {
    items.addItem(data, true);

    toggleModalButtons();

    modal.style.display = 'none';
    itemUrl.value = '';
});