<template>
  <div class="box">
    <h1>Printd example</h1>

    <p>
      This is an <b>example!</b> using a <a href="https://vuejs.org/">VueJS</a> <em>component</em>.
    </p>

    <pre>
      import Printd from 'printd'

      const p: Printd = new Printd()

      p.print(this.$el, `.my_style { color: blue; }`)
    </pre>

    <button @click="print">Print this component</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import Printd from '../../src'

@Component
export default class App extends Vue {

  cssText: string = `
    .box {
      font-family: sans-serif;
      width: 500px;
      border: solid 1px #ccc;
      text-align: center;
      padding: 1em;
      margin: 2em auto;
    }

    button {
      background-color: #f0f0f0;
      border: solid 1px #ccc;
      padding: 5px 10px;
      font-size: 12px;
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
  .box {
    font-family: sans-serif;
    width: 500px;
    border: solid 1px #ccc;
    text-align: center;
    padding: 1em;
    margin: 2em auto;
  }

  button {
    background-color: #f0f0f0;
    border: solid 1px #ccc;
    padding: 5px 10px;
    font-size: 12px;
  }

  pre {
    color: #c7254e;
  }
</style>
