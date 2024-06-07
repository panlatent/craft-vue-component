<?php

namespace panlatent\craft\vuecomponent;

use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\Template;
use yii\web\View;

abstract class VueHelper
{
    public static function renderComponent(string $componentName, array $props = []): string
    {
        $id = StringHelper::randomString(10);
        $containerId = "vue-$componentName-$id";
        $propsJSON = Json::encode($props);
        Template::js("window.mountVueComponent('$componentName', $propsJSON, document.getElementById('$containerId'))", ['position' => View::POS_END]);
        return Html::tag('div', '', ['id' => $containerId]);
    }
}