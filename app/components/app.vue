<template>
  <div>
    <h1>Printd example</h1>

    <p>
      This is an <b>example!</b> using a <a href="https://vuejs.org/">VueJS</a> <em>component</em>.
    </p>

    <pre>
      import Printd from 'printd'

      const printd: Printd = new Printd()

      printd.print(this.$el, this.cssText)
    </pre>

    <button @click="print">Imprimir</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import Printd from '../../src/index'

@Component
export default class App extends Vue {

  cssText: string = `
    button {
      background-color: #f0f0f0;
      border: solid 1px #ccc;
      padding: 10px;
    }

    pre {
      color: #c7254e;
    }
  `

  print (): void {
    const printd: Printd = new Printd()
    printd.print(this.$el, this.cssText)
  }

}
</script>
<style>
  button {
    background-color: #f0f0f0;
    border: solid 1px #ccc;
    padding: 5px 10px;
  }

  pre {
    color: #c7254e;
  }
</style>
