<?php

namespace panlatent\craft\vuecomponent;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class Extension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction('vueComponent', fn(...$args) => VueHelper::renderComponent(...$args), ['is_safe' => ['html_attr']]),
        ];
    }
}