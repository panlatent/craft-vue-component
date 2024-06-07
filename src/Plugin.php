<?php

namespace panlatent\craft\vuecomponent;

use Craft;
use craft\base\Plugin as BasePlugin;
use craft\web\Application as WebApplication;
use craft\web\View;
use yii\base\Event;

/**
 * Vue Component plugin
 *
 * @method static Plugin getInstance()
 * @author panlatent <panlatent@gmail.com>
 * @copyright panlatent
 * @license MIT
 */
class Plugin extends BasePlugin
{
    public string $schemaVersion = '1.0.0';

    public static function config(): array
    {
        return [
            'components' => [
                // Define component configs here...
            ],
        ];
    }

    public function init(): void
    {
        parent::init();

        Craft::$app->onInit(function() {
            $this->attachEventHandlers();
        });
    }

    private function attachEventHandlers(): void
    {
        if (Craft::$app instanceof WebApplication) {
            \Craft::$app->getView()->registerTwigExtension(new Extension());
        }
    }
}
