const express = require('express')
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || '5001'
const app = express()
// eslint-disable-next-line no-unused-vars
const helpers = require('handlebars-helpers')(['string'])

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error)

const getAllPokemon = catchErrors(async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    const json = await res.json()
    console.table(json.results)
    return json
})

const getPokemon = catchErrors(async (pokemon = '1') => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const json = await res.json()
    console.table(json.results)
    return json
})

//middleware
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', catchErrors(async (_, res) => {
    const pokemons = await getAllPokemon()
    res.render('home', { pokemons })
}))

app.post('/search', (req, res) => {
    const search = req.body.search
    console.log(search);
    res.redirect(`/${search}`)
})

app.get('/notFound', (_, res) => res.render('notFound'))

app.get('/:pokemon', catchErrors(async (req, res) => {
    const search = req.params.pokemon
    const pokemon = await getPokemon(search)
    if (pokemon) {
        res.render('pokemon', { pokemon })
    } else {
        res.redirect('notFound')
    }
})
)

app.listen(PORT, () => console.log(`Server is listening on port : ${PORT}`))