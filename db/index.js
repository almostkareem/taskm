const Sequelize = require('sequelize')
const TaskModel = require('./models/task')

class DB {
  constructor(_config = null) {
    const config = _config || require('./config')
    const {dialect, storage, logging} = config
    const sequelize = new Sequelize({
      dialect, storage, logging,
      query:{
        raw:true,
      },
    })
    const Task = TaskModel(sequelize, Sequelize)

    this._TaskModel = Task
    this.sequelize = sequelize
  }

  init(options = {}){
    const {isPurge = false} = options
    const dbOptions = isPurge ? { force: true } : {}

    if(isPurge) {
      console.log('[+] Going to purge')
    }

    return this.sequelize.sync(dbOptions).then(() => {
      console.log(`[+] Database & tables initialized!`)
      return
    })
  }

  TaskModel() {
    return this._TaskModel
  }
}

module.exports = DB