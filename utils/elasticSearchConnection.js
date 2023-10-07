const { Client } = require('@elastic/elasticsearch')
const config = require("../config/default.json")
const client = new Client({
    node: config.ElasticSearch.node,
    auth: {
        apiKey: config.ElasticSearch.apiKey
    }
})

async function createIndex() {
    let deletedResponse = await client.indices.delete({index: config.ElasticSearch.index})
    console.log(deletedResponse)
    await client.indices.create({
        index: config.ElasticSearch.index, mappings: {
            properties: {
                title: {
                    type: "text",
                    store: true,
                    index: true,
                },
                author: {
                    type: "text",
                    store: true,
                    index: true,
                },
                description: {
                    type: "text",
                    store: true,
                    index: true,
                },
                date_created: {
                    type: "long",
                    store: true,
                    index: true,
                },
                image: {
                    type: "text",
                    store: true,
                    index: false,
                },
                isbn: {
                    type: "text",
                    store: true,
                    index: false,
                },
                publicationYear:{
                    type: "integer",
                    store: true,
                    index: false,
                }
            }
        }
    })


}

// Warning run this function only once when there is no index created
// createIndex().then(async (response) => {
    
//     console.log(response, "Success")
// }).catch((error) => {
//     console.log(error)
// })

module.exports = {
    ElasticSearchClient: client
}
// Let's search!
// const searchResult = await client.search({
//     index: 'search-calibr.ai.index',
//     q: 'snow'
// });

// console.log(searchResult.hits.hits)
