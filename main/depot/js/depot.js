define(['jquery'], function($) {
    'use strict';
    
    var depot = {};

    depot.head =["    <header class=\"header left\">",
"            <div class=\"left nav\">",
"                <ul>",
"                    <li><i class=\"fa fa-home white margin-right-5\"></i><a href=\"../../index/views/index.html\">系统主页</a> </li>",
"                    <li><i class=\"fa fa-table white margin-right-5\"></i><a href=\"index.html\">数据概览</a></li>",
"                    <li><i class=\"fa fa-video-camera white margin-right-5\"></i><a href=\"video.html\">视频监控</a> </li>",
"                    ",
"                </ul>",
"            </div>",
"            <div class=\"header_center left\">",
"                <h1><strong>智能可视化监管系统</strong></h1>",
"                <p class=\"color_font\"><small>Intelligent visual monitoring system</small></p>",
"            </div>",
"            <div class=\"right nav text_right\">",
"                <ul> ",
"                    <li><i class=\"fa fa-map white margin-right-5\"></i><a href=\"map.html\">地图界面</a> </li>",
"                    <li><i class=\"fa fa-etsy white margin-right-5\"></i><a href=\"static.html\">数据分析</a> </li>",
"                    <li><i class=\"fa fa-search white margin-right-5\"></i><a href=\"device.html\">设备查询</a> </li>",
"                </ul>",
"            </div>",
"    </header>"].join("");


    
    return depot;
});