const DBClass = require('./db')
const {
  STATUS_CREATED,
  STATUS_SUBMITTED,
  STATUS_FINISHED,
  STATUS_FAIL
} = require('./const')

class Controller {
  constructor() {
    this.DB = new DBClass()
  }
  add(_sourceId = '', payload = {}) {
    return new Promise((resolve, reject) => {
      const sourceId = _sourceId || `${new Date().getTime()}`
      const Task = this.DB.TaskModel()
      return Task.findOne({ where: { sourceId } })
        .then((res) => {
          if (!res) {
            console.log(`[INFO] creating task : ${sourceId}`)
            return Task.create({ ...payload, sourceId, status: STATUS_CREATED })
          } else {
            console.log(`[INFO] task existed skip: ${sourceId}`)
            return
          }
        }).then((res) => {
          resolve(res)
        })
    })
  }

  getFirst(condition = {}) {
    return this.DB.TaskModel().findOne({ where: { ...condition } })
  }

  listAllTasks(condition = {}) {
    return this.DB.TaskModel().findAll({ where: { ...condition } })
  }

  getTaskById(id) {
    const res = this.DB.TaskModel().findOne({ where: { id } });
    if (res[0] !== 1) return this.DB.TaskModel().findOne({ where: { sourceId: id } });
    return res
  }

  getFirstRandom(condition = {}) {
    return this.DB.TaskModel().findOne({ order: this.DB.sequelize.random(), where: { ...condition } })
  }

  async updateTask(id, meta) {
    const res = await this.DB.TaskModel().update({ meta: meta }, { where: { id } })

    if (res[0] !== 1) return this.DB.TaskModel().update({ meta: meta }, { where: { sourceId: id } })

    return res;
  }

  async markFinished(id) {
    const res = await this.DB.TaskModel().update({ status: STATUS_FINISHED }, { where: { id } })

    if (res[0] !== 1) return this.DB.TaskModel().update({ status: STATUS_FINISHED }, { where: { sourceId: id } })

    return res
  }

  async markSubmitted(id) {
    const res = await this.DB.TaskModel().update({ status: STATUS_SUBMITTED }, { where: { id } })

    if (res[0] !== 1) return this.DB.TaskModel().update({ status: STATUS_SUBMITTED }, { where: { sourceId: id } })

    return res
  }

  async markFail(id) {
    const res = await this.DB.TaskModel().update({ status: STATUS_FAIL }, { where: { id } })

    if (res[0] !== 1) return this.DB.TaskModel().update({ status: STATUS_FAIL }, { where: { sourceId: id } })

    return res
  }

  purge() {
    return this.DB.init({ isPurge: true })
  }
  init() {
    return this.DB.init()
  }
}

module.exports = Controller