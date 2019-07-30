
const axios = require('axios')
const connection = require('./connection');

const getNext = async (next, upload) => {
    const resultVidNext = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        params: {
            key: process.env.KEY,
            playlistId: upload,
            pageToken: next,
            part: 'snippet',
            maxResults: 50
        }
    })

    return resultVidNext.data
}

const youtubeAPI = async () => {

    const result = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/youtube/v3/channels',
        params: {
            key: process.env.KEY,
            id: 'UC1auzQbFso05Rw4HvmXXsoQ',
            part: 'contentDetails'
        }
    })

    const upload = result.data.items[0].contentDetails.relatedPlaylists.uploads

    const resultVid = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        params: {
            key: process.env.KEY,
            playlistId: upload,
            part: 'snippet',
            maxResults: 50
        }
    })
    let next = resultVid.data.nextPageToken
    let data = [...resultVid.data.items]
    while (next) {
        const dataNext = await getNext(next, upload)
        data = [...data, ...dataNext.items]
        next = dataNext.nextPageToken
    }
    const dataExploited = data.map(elem => {
        return {
            date: elem.snippet.publishedAt,
            titre: elem.snippet.title,
            video: elem.snippet.resourceId.videoId
        }
    })

    for (const dataE of dataExploited) {
        const select = 'SELECT * from video WHERE video=' + connection.escape(dataE.video)
        connection.query(select, (err, result) => {
            if (err) throw err
            if (!result.length) {
                const insert = 'INSERT INTO video (video, date, titre) VALUES (' + connection.escape(dataE.video) + ', ' + connection.escape(dataE.date) + ', ' + connection.escape(dataE.titre) + ')'
                connection.query(insert, (err2) => {
                    if (err2) throw err2
                })
            }
        })
    }
}

module.exports = youtubeAPI