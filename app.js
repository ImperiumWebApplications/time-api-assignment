const express = require('express')
const axios = require('axios')

const app = express()


app.get('/getTimeStories', (req, res) => {
    axios.get('https://time.com/')
        .then((response) => {
            let latestStoriesSectionSubString = response.data.substring(
                response.data.indexOf("<h2 class=\"latest-stories__heading\">Latest Stories") + 1,
                response.data.lastIndexOf("</ul>")
            );


            const resultantString = latestStoriesSectionSubString.split("</ul>")[0]
            const cleanedString = resultantString.replace("h2 class=\"latest-stories__heading\">Latest Stories</h2>\n", "").replace("  <ul>\n", "")
            const cleanedStringSplit = cleanedString.split("</li>")


            const modifiedArray = cleanedStringSplit.map((i) => {
                return i.replace("<li class=\"latest-stories__item\">\n", "")
            })



            const headerTextArray = modifiedArray.map((element) => {
                return element.substring(
                    element.indexOf("<h3 class=\"latest-stories__item-headline\">") + 42,
                    element.lastIndexOf("</h3>")
                )

            })

            const urlTextArray = modifiedArray.map((element) => {
                return element.substring(
                    element.indexOf("<a href=") + 9,
                    element.indexOf("\">")
                )
            })

            const responseArray = [];

            for (let i = 0; i < headerTextArray.length; i++) {
                responseArray[i] = {
                    title: headerTextArray[i],
                    link: "https://time.com"+urlTextArray[i]
                }
            }
            responseArray.splice(-1, 1)

            res.send(responseArray)


        })
        .catch((error) => {
            console.log(error)
        })
})

app.listen(8000)