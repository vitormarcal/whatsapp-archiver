const { Message } = require('../models');


class MessageService {
    async updateAuthorName(chatId, oldName, newName) {
        Message.update({author: newName}, {where: {author: oldName, chatId: chatId}})
            .then(() => {
                console.log('Registros atualizados com sucesso!');
            })
    }

}


module.exports = {MessageService}