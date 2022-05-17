if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY

console.log(stripePublicKey)

const express = require('express')
const { json } = require('express/lib/response')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripePrivateKey)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

app.get('/store', function (req, res) {
    fs.readFile('items.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase', function (req, res) {
    fs.readFile('items.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.products
            let total = 0
            req.body.items.forEach(function (item) {
                const itemJson = itemsArray.find(function (i) {
                    return i.id == item.id
                })
                total = total + itemJson.price
            })

            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function () {
                console.log('Charge Successful')
                res.json({ message: 'Successfully purchased items' })
            }).catch(function () {
                console.log('Successfully purchased items')
                res.status(500).end()
            })
        }
    })
})

app.listen(4000)