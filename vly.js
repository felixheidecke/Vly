/**
 *                _   _                  _
 *   ___  _ __   | |_| |__   ___  /\   /\ |_   _
 *  / _ \| '_ \  | __| '_ \ / _ \ \ \ / / | | | |
 * | (_) | | | | | |_| | | |  __/  \ V /| | |_| |
 *  \___/|_| |_|  \__|_| |_|\___|   \_/ |_|\__, |
 *                                         |___/ 
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies. 
 *
 * https://opensource.org/licenses/ISC
 * 
 * @author Felix Heidecke <felix@heidecke.me>
 * @copyright Felix Heidecke 2020
 */

class Vly {

  constructor (base, components) {
    this._queue = []
    this._components = []
    this._base = base

    return this.require(components)
  }

  get components () {
    return this._components
  }

  require (components) {

    for (let [name, path] of Object.entries(components)) {
      this._queue.push( this.fetch(name, path) )
    }

    return Promise.all(this._queue).then( () => this)
  }

  async fetch (name, path) {

    if (this._components[path])
      return Promise.resolve()

    await fetch(this._base + '/' + path)
      .then(response => response.text())
      .then(content => {

        const template = (this._matchTemplate(content)) || false
        const script   = (this._matchScript(content)) || false
        const style    = (this._matchStyle(content)) || false

        if (!template)
          return console.warn('A template is required in', path)

        if (!script)
          return console.warn('A template is required in', path)

        const code = `(function() {
          let component = (${script}) || {}

          component.template = \`${template}\`
          Vue.component("${name}", component)
        })()`

        this._components.push(path)
        this.addStyle(style)
        eval(code)
      })
      .catch( e => console.error(e));
  }

  addStyle (style) {
    let el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.innerHTML = style
    document.head.appendChild(el);
  }

  // ----------------
  // Helper functions

  _matchTemplate = string => {
    const code = string.match(/<template>([\s\S]*?)<\/template>/)
    if (code === null) return

    return code[1].trim()
  }

  _matchScript = string => {
    const code = string.match(/<script>([\s\S]*?)<\/script>/)
    if (code === null) return

    return code[1]
      .trim()
      .replace(/.*?{/, '{')
  }

  _matchStyle = string => {
    const code = string.match(/<style.*?>([\s\S]*?)<\/style>/)
    if (code === null) return

    return code[1].trim()
  }
}