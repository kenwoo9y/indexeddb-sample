// all the variables we need for the app
const form = document.getElementById('form');
const title = document.getElementById('title');
const evaluation = document.getElementById('evaluation');
const image = document.getElementById('image');
const submit = document.getElementById('submit');

// create an instance of a db object for us to store the IndexedDB data in
let db;

// open database
const dbOpenRequest = window.indexedDB.open("ItemDB", 1);

dbOpenRequest.onerror = function(event) {
    alert("Error loading database.");
};

dbOpenRequest.onsuccess = function(event) {
    db = dbOpenRequest.result;
};

dbOpenRequest.onupgradeneeded = function(event) {
    let db = event.target.result;

    // Create an objectStore for this database
    let objectStore = db.createObjectStore("ItemDB", { keyPath: "item_id", autoIncrement: true });

    // define what data items the objectStore will contain
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("evaluation", "evaluation", { unique: false});
    objectStore.createIndex("image", "image", { unique: false});
};

// give the form submit button an event listener so that when the form is submitted the addData() function is run
form.addEventListener('submit', addData, false);

function addData(event) {
    event.preventDefault();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the IndexedDB
    let newItem = [
        { title: title.value, evaluation: evaluation.value, image: image.value }
    ];

    // open a read/write db transaction
    let transaction = db.transaction(["ItemDB"], "readwrite");

    transaction.onerror = function() {
        alert("Error add data.")
    };

    transaction.oncomplete = function() {};

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore("ItemDB");

    // add a newItem object to the object store
    let objectStoreAddRequest = objectStore.add(newItem[0]);

    objectStoreAddRequest.onsuccess = function(event) {
        // clear the form, ready for adding the next entry
        title.value = '';
        evaluation.value = 'good';
        image.value = null;
    };
};

function deleteItem(event) {
    // retrieve the name of the task we want to delete
    let itemName = event.target.getAttribute('');

    // open a read/write db transaction
    let transaction = db.transaction(["ItemDB"], "readwrite");

    // delete the item
    let objectStore = transaction.objectStore("ItemDB").objectStore.delete(itemName);
};