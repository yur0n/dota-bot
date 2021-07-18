const botgram = require("botgram")
const request = require('request')
const bot = botgram("1883716013:AAF6aaTD5CntA2t7IeL3VGfdBmpqQuSCYV8")

var key = [
    [ { text: "Рудя"}, {text: 'Грызля'} ],
    [ { text: "Антон"}, {text: 'Юрон'} ]
]

const loading = ['loading..', 'loading...', 'loading....', 'loading.....', 'loading......']

const stats = (reply, msg, response) => {
    if (response.body[0].kills <= response.body[0].deaths) reply.text('Слабак!')
    if (response.body[0].kills > response.body[0].deaths) reply.text('А ты хорош, продолжай!')
    reply.text('Так же ты нанёс ' + response.body[0].hero_damage + ' урона по героям, ' + response.body[0].tower_damage + 
               ' урона по строениям, похилил на ' + response.body[0].hero_healing + ' хп и получал ' + 
               response.body[0].gold_per_min + ' золота/мин с ' + response.body[0].last_hits + ' ластхитами.')
    if ((response.body[0].player_slot <= 4 && response.body[0].radiant_win == true) || 
        (response.body[0].player_slot > 4 && response.body[0].radiant_win == false)) reply.text("Ты победил! \u{1F638}")
    if ((response.body[0].player_slot > 4 && response.body[0].radiant_win == true) || 
        (response.body[0].player_slot <= 4 && response.body[0].radiant_win == false)) reply.text("Ты проиграл! \u{1F63F}")
    if (response.body[0].leaver_status == 1) reply.text('Ливер!')
}

bot.command("start", (msg, reply, next) => {
    console.log(msg.from.username, msg.from.name, msg.from.id)
    reply.keyboard(key, true, true).text("Ты кто? Введи свой Steam32 ID, если тебя нет в списке.")
    reply.text('Я буду присылать статистику твоей каждой сыгранной игры.')
})

bot.text( async (msg, reply, next) => {
    var player = msg.text
    if (msg.text == "Рудя") player = '120202499'; if (msg.text == "Антон") player = '97938416'
    if (msg.text == "Грызля") player = '115455869'; if (msg.text == "Юрон") player = '93442227'
    await reply.text('loading.')
    loading.forEach(load => {
        reply.editText(msg.id + 1, load)
    })
    url = 'https://api.opendota.com/api/players/' + player + '/recentMatches'
    request({ url: url, json: true }, async (error, response) => {
        try {
        matchId = response.body[0].match_id
        await reply.editText(msg.id + 1, 'В последней игре у тебя ' + response.body[0].kills + ' убийств, ' + 
                       response.body[0].deaths + ' смертей, ' + response.body[0].assists + ' ассистов.')
        stats(reply, msg, response)
        } catch (e) {
            reply.editText(msg.id + 1, 'Неверный ID или настройки приватности')
        }
    })
    setInterval(() => {
        request({ url: url, json: true }, (error, response) => {
            try {
                if (matchId !== response.body[0].match_id) {
                    matchId = response.body[0].match_id
                    reply.text('В последней игре у тебя ' + response.body[0].kills + ' убийства, ' + 
                            response.body[0].deaths + ' смертей, ' + response.body[0].assists + ' ассистов.')
                    stats(reply, msg, response)
                }
            } catch (e) {
                reply.text('Случилось дерьмо')
            }    
        })
    }, 900000); 
})