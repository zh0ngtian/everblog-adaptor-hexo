const _ = require('lodash')
const fse = require('fs-extra')
const moment = require('moment')
const fm = require('front-matter')
const entities = require('entities')
const enml2text = require('enml2text')
const debug = require('debug')('everblog-adaptor-hexo')

module.exports = async function (data, cleanMode = false) {
  const dist = process.cwd() + '/source/_posts/'
  fse.emptyDirSync(dist)

  data.notes.forEach(note => {
    const defaultFrontMatter = {
      title: note.title,
      date: formatDate(note.created),
      updated: formatDate(note.updated),
      tags: note.tags
    }
    debug(`title: ${note.title}, content(enml): ${note.content}`)

    let contentMarkdown = entities.decodeHTML(enml2text(note.content))
    let data = fm.parse(contentMarkdown)
    _.merge(data.attributes, defaultFrontMatter)
    contentMarkdown = fm.stringify(data)

    const filename = dist + note.title + '.md'
    fse.outputFileSync(filename, contentMarkdown)
    debug(`title: ${filename}, content(markdown): ${contentMarkdown}`)
  })
  debug('build success!')
}

function formatDate (timestamp) {
  return moment(timestamp).format('YYYY/M/DD HH:mm:ss')
}
