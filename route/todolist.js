const express = require('express');
const ToDolist = require('../model/todolist');
const UserPass = require('../model/userpass');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/user', async (req, res) => {
    try{
        const userpass = await UserPass.find({});
        res.send({userpass});
        console.log(req.path || ' ' || req.method);
    } catch (error) {
        res.status(500).send({ message: 'Data tidak ditemukan', error: error.message });
        console.log(req.path || ' ' || req.method);
    }
});

router.post('/login', async (req, res) => {
    try{
        const userpass = await UserPass.findOne({ Username: req.body.Username, Password: req.body.Password});
        if (!userpass) {
            return res.status(404).send({ message: 'User tidak ditemukan !!!' });
            console.log(req.path || ' ' || req.method);
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
        time: Date(),
        username: req.params.username,
        password: req.params.password
        }
        
        const token = jwt.sign(data, jwtSecretKey);
        res.status(200).send(token);
        console.log(req.path || ' ' || req.method);
    } catch (error) {
        res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
        console.log(req.path || ' ' || req.method);
    };
});

router.post('/register', async (req, res) => {
    const userpass = new UserPass(req.body);

    try{
        await userpass.save();
        res.status(201).send({message: 'berhasil simpan !'});
        console.log(req.path || ' ' || req.method);
    } catch (error) {
        res.status(500).send({message: 'gagal simpan !', error: error.message });
        console.log(req.path || ' ' || req.method);
    };
});

router.post('/ToDolist', async (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            const todolist = new ToDolist(req.body);
            try{
                await todolist.save();
                res.status(201).send({message: 'berhasil simpan !'});
                console.log(req.path || ' ' || req.method);
            } catch (error) {
                res.status(500).send({message: 'gagal simpan !', error: error.message });
                console.log(req.path || ' ' || req.method);
            };
        } else {
            return res.status(401).send(error);
        }
});

router.get('/ToDolist', async (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            try{
                const todolist = await ToDolist.find({});
                res.send({todolist});
                console.log(req.path || ' ' || req.method);
            } catch (error) {
                res.status(500).send({ message: 'Data tidak ditemukan', error: error.message });
                console.log(req.path || ' ' || req.method);
            }
        } else {
            return res.status(401).send(error);
        }
});

router.get('/ToDolist/:nama_todolist', async (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            try{
                const todolist = await ToDolist.findOne({ TodoList: req.params.nama_todolist });
                if (!todolist) {
                    return res.status(404).send({ message: 'Data tidak ditemukan' });
                    console.log(req.path || ' ' || req.method);
                }
                res.status(200).send({ todolist });
                console.log(req.path || ' ' || req.method);
            } catch (error) {
                res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
                console.log(req.path || ' ' || req.method);
            };
        } else {
            return res.status(401).send(error);
        }
});

router.patch('/ToDolist/:nama_todolist', async(req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            const updates = Object.keys(req.body)
    const allowedUpdates = ['Description', 'Status']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'gagal update'})
        console.log(req.path || ' ' || req.method);
    }

    try {
        const todolist = await ToDolist.findOne({ TodoList: req.params.nama_todolist})
    
        if(!todolist){
            return res.status(404).send({ error: 'ToDoList tidak ditemukan' });
            console.log(req.path || ' ' || req.method);
        }

        updates.forEach((update) => todolist[update] = req.body[update])
        await todolist.save()
        res.send(todolist)
        console.log(req.path || ' ' || req.method);
    } catch (error) {
        res.status(400).send(error)
        console.log(req.path || ' ' || req.method);
    }
        } else {
            return res.status(401).send(error);
        }
});

router.delete('/ToDolist/:nama_todolist', async(req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            try {
                const deletedItem = await ToDolist.findOneAndDelete( {TodoList: req.params.nama_todolist} )
                if(!deletedItem) {
                    return res.status(404).send({error: "ToDoList tidak ditemukan"})
                    console.log(req.path || ' ' || req.method);
                }
                res.send(deletedItem)
            } catch (error) {
                res.status(400).send(error)
                console.log(req.path || ' ' || req.method);
            }
        } else {
            return res.status(401).send(error);
        }
});

module.exports = router;