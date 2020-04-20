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

( () => {

  _queue = []

  _components = []
  _mixins = []

  const component = files => {
    for (let [name, path] of Object.entries(files)) {
      _queue.push( _fetchComponent(name, path) )
    }

    return Promise.all(_queue)
  }

  const mixin = files => {

    files.forEach(file => {
      _queue.push( _fetchMixin(file) )
    });

    return Promise.all(_queue)
  }

  const _fetchComponent = async (name, path) => {

    if (_components[path])
      return Promise.resolve()

    await fetch(path)
      .then(response => response.text())
      .then(content => {
        const template = (_match(content, /<template>([\s\S]*?)<\/template>/)) || false
        const script   = (_match(content, /<script>.*?export\s+?default([\s\S]*?)<\/script>/)) || false
        const style    = (_match(content, /<style.*?>([\s\S]*?)<\/style>/)) || false

        const code     = `(function() {
          let component = (${script}) || {}

          component.template = \`${template}\`
          Vue.component("${name}", component)
        })()`

        _components.push(path)
        addStyle(style)
        eval(code)
      })
      .catch( e => console.error(e));
  }

  const _fetchMixin = async path => {

    if (_mixins[path])
      return Promise.resolve()

    await fetch(path)
      .then(response => response.text())
      .then(content => {

        const mixin = (_match(content, /.*?export\s+?default([\s\S]+)/)) || false

        console.log(mixin)

        const code  = `(function() { Vue.mixin(${mixin}) })()`
        
        _mixins.push(path)
        eval(code)
      })
      .catch( e => console.error(e));
  }

  const addStyle = style => {
    let el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.innerHTML = style
    document.head.appendChild(el);
  }

  // ----------------
  // Helper functions

  const _match = (string, regex) => {
    const code = _toOneLine(string).match(regex)
    if (code === null) return

    console.log(code)

    return code[1].trim()
  }

  const _toOneLine = string => {
    return string
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
  }

  window.Vly = {
    component,
    mixin
  }

})()