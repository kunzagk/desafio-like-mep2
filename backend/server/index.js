require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { readPosts, createPost, updatePost, deletePost } = require('../utilities/pg')
const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/posts', async (_, res) => {
  const dataPosts = await readPosts()
  res.status(200).json(dataPosts)
})

app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body
  const dataPosts = await createPost({ titulo, url, descripcion })
  res.status(200).json(dataPosts)
})

app.put('/posts/like/:id', (req, res) => {
  updatePost(req.params.id)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.delete('/posts/:id', (req, res) => {
  deletePost(req.params.id)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})


app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Ruta no existente' }))

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
