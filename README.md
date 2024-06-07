# Craft Vue Component

Loading Vue components in Craft CMS

## Requirements

This plugin requires Craft CMS 4.3.5 or later, and PHP 8.0.2 or later.

## Installation

You can install this plugin from the Plugin Store or with Composer.

#### From the Plugin Store

Go to the Plugin Store in your project’s Control Panel and search for “Vue Component”. Then press “Install”.

#### With Composer

Open your terminal and run the following commands:

```bash
# go to the project directory
cd /path/to/my-project.test

# tell Composer to load the plugin
composer require panlatent/craft-vue-component

# tell Craft to install the plugin
./craft plugin/install vue-component
```

### Install NPM Package

```bash
npm i craft-vue-component --save
```

## Usage

### Front-end Development

Add the registration code to your frontend project, usually in the `index.js` file

```js
import {VueComponent} from 'craft-vue-component'

VueComponent.register((app) => {
   // app.use() ...
}, require.context('vue/controllers', true, /\.vue$/))
```

`vue/controllers` is the directory where Vue single component files are stored. You can replace it with your directory

This will register the Vue components under the specified directory and bind the dependencies to the browser's `window` object.

`window.createVueComponent` and `window.mountVueComponent` are ready.

### Using your component in a Twig template

```twig
{{ vueComponent() }}
```

Now, suppose we have a `field.vue` component in `vue/controllers`:

```vue
<script setup>
import {defineProps} from "vue";

const props = defineProps(['label', 'required'])

</script>

<template>
  <div class="field-container">
    <label class="body-font-4 d-block text-gray-900 rt-mb-8">{{ label }} <span class="required">{{ required ? '*' : ''}}</span></label>
    <slot></slot>
  </div>
</template>

<style scoped>

</style>
```

Render it:


```twig
{{ vueComponent('field', {label: "Title", required: required ?? false}}}
```

Or

```twig
{% js %}
createVueComponent({
    data() {
        {% block data %}
        var data = {{ {
            label: "Title",
            required: required ?? false,
        }|json_encode|raw }}
        {% endblock %}
        return data;
    },
    computed: {
    },
    methods: {
    }
}).mount("#{{ containerId }}");
{% endjs %}
```
