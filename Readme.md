```               __  __            _    ____     
  ____  ____     / /_/ /_  ___     | |  / / /_  __
 / __ \/ __ \   / __/ __ \/ _ \    | | / / / / / /
/ /_/ / / / /  / /_/ / / /  __/    | |/ / / /_/ / 
\____/_/ /_/   \__/_/ /_/\___/     |___/_/\__, /  
                                         /____/
```

Use your Vue.js Single-File components without the need to compile.

```html
<script src="https://unpkg.com/vue"></script>
<script src="js/vly.js"></script>
<script>
(async () => {

  const components = {
    myIntro: 'components/Intro.vue',
    myButton: 'components/Button.vue'
  }

  const mixins = ['mixins/mix.js']

  await Vly.component(components)
  await Vly.mixin(mixins)

  new Vue({el: '#app'})
})()
</script>
```

### Restrictions

* Does not support CSS precompilers such as Sass/SCSS, Less or PostCSS
* Ignores all other code prior to `export default`
* IE is not supported (neither is Opera Mini)
