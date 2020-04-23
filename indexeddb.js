// get element
const form = document.getElementById('form');
const title = document.getElementById('title');
const evaluation = document.getElementById('evaluation');
const file = document.getElementById('image');

file.addEventListener('change', function() {
    // resize image
    const maxWidth = 500;
    const maxHeight = 500;
    let image = new Image();
    let fileReader = new FileReader();
    fileReader.onload = function(event) {
        image.onload = function() {
            let width = image.width;
            let height = image.height;
            if (file.files[0].size > 1024 * 1024 * 1) {
                console.log("Greater than 1MB");
                if (image.width > image.height) {
                    var ratio = image.height/image.width;
                    width = maxWidth;
                    height = maxWidth * ratio;
                    console.log("Landscape");
                } else {
                    var ratio = image.width/image.height;
                    width = maxHeight * ratio;
                    height = maxHeight;
                    console.log("Portrait");
                }
            }
            var canvas = document.getElementById('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,width,height);
            ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);

            var base64 = canvas.toDataURL('image/jpeg');

            var barr, bin, i, len;
            bin = atob(base64.split('base64,')[1]);
            len = bin.length;
            barr = new Uint8Array(len);
            i = 0;
            while (i < len) {
                barr[i] = bin.charCodeAt(i);
                i++;
            }
            blob = new Blob([barr], {type: 'image/jpeg'});
        };
        image.src = event.target.result;
    };
    fileReader.readAsDataURL(file.files[0]);
});

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
    objectStore.createIndex("evaluation", "evaluation", { unique: false });
    objectStore.createIndex("image", "image", { unique: false });
};

// give the form submit button an event listener so that when the form is submitted the addData() function is run
form.addEventListener('submit', addData, false);

function addData(event) {
    event.preventDefault();

    var canvas = document.getElementById('canvas');
    var base64 = canvas.toDataURL('image/jpeg');

    // grab the values entered into the form fields and store them in an object ready for being inserted into the IndexedDB
    let newItem = [
        { title: title.value, evaluation: evaluation.value, image: base64 }
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
        file.value = '';
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
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