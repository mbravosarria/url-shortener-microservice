require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use("/public", express.static(`${process.cwd()}/public`))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

const originalUrls = []
const shortUrls = []

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url
  const foundIndex = originalUrls.indexOf(url)

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({
      error: "Invalid URL",
    })
  }

  if (foundIndex < 0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length + 1)

    return res.json({
      original_url: url,
      short_url: shortUrls.length,
    })
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex],
  })
})

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = req.params.shorturl
  const foundIndex = shortUrls.indexOf(Number(shorturl))

  if (foundIndex < 0) {
    return res.json({
      error: "URL Not Found",
    })
  }

  res.redirect(originalUrls[foundIndex])
})

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
