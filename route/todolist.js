const express = require('express');
const ToDolist = require('../model/todolist');

const router = express.Router();

router.post('/ToDolist', async (req, res) => {
    const todolist = new ToDolist(req.body);

    try{
        await todolist.save();
        res.send(201).send({message: 'berhasil simpan !'});
    } catch {
        res.send(500).send({message: 'gagal simpan !'});
    };
});

router.get('/ToDolist', async (req, res) => {
    try{
        const todolist = await ToDolist.find({});
        res.send({todolist});
    } catch {
        res.send(400).send({message: 'Data Tidak ditemukan'});
    };
});
router.get('/ToDolist/:nama_todolist', async (req, res) => {
    try{
        const todolist = await ToDolist.find(req.params.nama_todolist);
        res.send({todolist});
    } catch {
        res.send(400).send({message: 'Data Tidak ditemukan'});
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
        const todolist = await ToDolist.findOne({ nama_todolist: req.params.nama_todolist})
    
        if(!todolist){
            return res.status(404).json(error)
        }

        updates.forEach((update) => todolist[update] = req.body[update])
        await todolist.save()
        res.send(todolist)
    } catch (error) {
        res.status(400).json(error)
    }
});

router.delete('/ToDolist/:nama_todolist', async(req, res) => {
    try {
        const deletedItem = await ToDolist.findOneAndDelete( {nama_todolist: req.params.nama_todolist} )
        if(!deletedItem) {
            res.status(404).json({error: "ToDoList tidak ditemukan"})
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).json(error)
    }
});

module.exports = router;