const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/books', (req, res) => {
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        res.status(200).json(JSON.parse(data));
    });
});

app.get('/api/book/:isbn', (req, res) => {
    const isbnParam = req.params.isbn;
    
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ status: false, message: "Error reading file" });
        
        const books = JSON.parse(data);
        const book = books.find(b => b.isbn === isbnParam);
         
        if (!book) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }

        res.status(200).json(book);
    });
});

app.post('/api/book', (req, res) => {
    const { isbn, title, author, year, publisher } = req.body;

    if (!isbn || !title || !author || !year || !publisher) {
        return res.status(400).json({ status: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ status: false, message: "Error reading file" });

        const books = JSON.parse(data);

        const newBook = {
            isbn,
            title,
            author,
            year,
            publisher,
            status: 'available'
        };

        books.push(newBook);

        fs.writeFile('books.json', JSON.stringify(books, null, 2), (err) => {
            if (err) return res.status(500).json({ status: false, message: "Error writing file" });
            res.status(201).json({ status: true, message: "เพิ่มหนังสือสำเร็จ", book: newBook });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});