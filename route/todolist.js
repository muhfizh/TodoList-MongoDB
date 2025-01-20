const express = require('express');
const ToDolist = require('../model/todolist');

const router = express.Router();

router.post('/ToDolist', async (req, res) => {
    const todolist = new ToDolist(req.body);

    try{
        await todolist.save();
        res.status(201).send({message: 'berhasil simpan !'});
    } catch (error) {
        res.status(500).send({message: 'gagal simpan !', error: error.message });
    };
});

router.get('/ToDolist', async (req, res) => {
    try{
        const todolist = await ToDolist.find({});
        res.send({todolist});
    } catch (error) {
        res.status(500).send({ message: 'Data tidak ditemukan', error: error.message });
    }
});
router.get('/ToDolist/:nama_todolist', async (req, res) => {
    try{
        const todolist = await ToDolist.findOne({ TodoList: req.params.nama_todolist });
        if (!todolist) {
            return res.status(404).send({ message: 'Data tidak ditemukan' });
        }
        res.status(200).send({ todolist });
    } catch (error) {
        res.status(500).send({ message: 'Terjadi kesalahan', error: error.message });
    };
});

router.patch('/ToDolist/:nama_todolist', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Description', 'Status']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'gagal update'})
    }

    try {
        const todolist = await ToDolist.findOne({ TodoList: req.params.nama_todolist})
    
        if(!todolist){
            return res.status(404).send({ error: 'ToDoList tidak ditemukan' });
        }

        updates.forEach((update) => todolist[update] = req.body[update])
        await todolist.save()
        res.send(todolist)
    } catch (error) {
        res.status(400).send(error)
    }
});

router.delete('/ToDolist/:nama_todolist', async(req, res) => {
    try {
        const deletedItem = await ToDolist.findOneAndDelete( {TodoList: req.params.nama_todolist} )
        if(!deletedItem) {
            return res.status(404).send({error: "ToDoList tidak ditemukan"})
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = router;