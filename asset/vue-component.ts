import {App, createApp, defineAsyncComponent} from "vue";
import RequireContext = __WebpackModuleApi.RequireContext;
import {Component} from "@vue/runtime-core";

type Initializer = (app: App) => void

export default class VueComponent {
    create: (component: Component, props: Record<string, unknown>) => App

    constructor(init: Initializer|null) {
        this.create = (component: Component, props: Record<string, unknown>): App => {
            const app=  createApp(component, props)
            if (init) {
                init(app)
            }
            return app
        }
    }

    static register(init: Initializer|null, context: RequireContext) {
        const vc = new VueComponent(init)
        vc.registerControllerComponents(context)
        vc.bindToWindow()
    }

    mount(name: string, props: any, element: string) {
        const component = this.loadComponent(name);
        const app = this.create(component, props);
        return app.mount(element);
    }

    loadComponent(name: string) {
        const componentPath = `./${name}.vue`;
        if (!(componentPath in this.vueControllers)) {
            const possibleValues = Object.keys(this.vueControllers).map((key) => key.replace('./', '').replace('.vue', ''));
            throw new Error(`Vue controller "${name}" does not exist. Possible values: ${possibleValues.join(', ')}`);
        }
        if (typeof this.vueControllers[componentPath] === 'undefined') {
            const module = this.context?.(componentPath);
            if (module.default) {
                this.vueControllers[componentPath] = module.default;
            }
            else if (module instanceof Promise) {
                this.vueControllers[componentPath] = defineAsyncComponent(() => new Promise((resolve, reject) => {
                    module
                        .then((resolvedModule) => {
                            if (resolvedModule.default) {
                                resolve(resolvedModule.default);
                            }
                            else {
                                reject(new Error(`Cannot find default export in async Vue controller "${name}".`));
                            }
                        })
                        .catch(reject);
                }));
            }
            else {
                throw new Error(`Vue controller "${name}" does not exist.`);
            }
        }
        return this.vueControllers[componentPath];
    }

    private vueControllers: any;

    private context: RequireContext|null = null

    registerControllerComponents(context: RequireContext) {
        this.context = context
        this.vueControllers = context.keys().reduce((acc: Record<string, any>, key) => {
            acc[key] = undefined;
            return acc;
        }, {});
    }

    bindTo(object: Record<any, any>) {
        object.createVueComponent = this.create
        object.mountVueComponent = this.mount
    }

    bindToWindow() {
        this.bindTo(window)
    }
}
