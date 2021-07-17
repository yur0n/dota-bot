const botgram = require("botgram")
const request = require('request')
const bot = botgram("1883716013:AAF6aaTD5CntA2t7IeL3VGfdBmpqQuSCYV8")

bot.command("start", (msg, reply, next) => {
    console.log(msg.from.username || msg.from.name, msg.from.id)
    reply.text('LOADING...')
    msg.url = 'https://api.opendota.com/api/players/120202499/recentMatches'
    request({ url: msg.url, json: true }, (error, response) => {
        if (error) {
            reply.text('Случилось дерьмо')
        }
        msg.matchId = response.body[0].match_id
        reply.editText(msg.id + 1, 'В последней игре у тебя ' + response.body[0].kills + ' убийства, ' + 
                       response.body[0].deaths + ' смертей, ' + response.body[0].assists + ' ассистов.')
        stats(reply, msg, response)
    })
    next()
})

bot.command("start", (msg, reply, next) => {
    const interval = setInterval(function() {
        request({ url: msg.url, json: true }, (error, response) => {
            if (error) {
                reply.text('Случилось дерьмо')
            }
            if (msg.matchId !== response.body[0].match_id) {
                msg.matchId = response.body[0].match_id
                reply.text('В последней игре у тебя ' + response.body[0].kills + ' убийства, ' + 
                           response.body[0].deaths + ' смертей, ' + response.body[0].assists + ' ассистов.')
                stats(reply, msg, response)
            }
        })
    }, 900000);  
})

const stats = (reply, response) => {
    reply.text('Так же ты нанёс ' + response.body[0].hero_damage + ' урона по героям, ' + response.body[0].tower_damage + 
               ' урона по строениям, похилил на ' + response.body[0].hero_healing + ' хп и получал ' + 
               response.body[0].gold_per_min + ' золота/мин с ' + response.body[0].last_hits + ' ластхитами')
               if (response.body[0].kills <= response.body[0].deaths) reply.text('Слабак!')
               if (response.body[0].kills > response.body[0].deaths) reply.text('А ты хорош, продолжай!')
               if ((response.body[0].player_slot < 4 && response.body[0].radiant_win == 1) || 
               (response.body[0].player_slot > 4 && response.body[0].radiant_win == 0)) reply.text("Ты победил! \u{1F638}")
               if ((response.body[0].player_slot > 4 && response.body[0].radiant_win == 1) || 
               (response.body[0].player_slot < 4 && response.body[0].radiant_win == 0)) reply.text("Ты проиграл! \u{1F63F}")
               if (response.body[0].leaver_status == 1) reply.text('Хренов ливер!')
}