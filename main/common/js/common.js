define(['jquery'],function () {
    var common = {};
    //全局服务器连接地址
    common.host = "http://192.168.0.142:8060";

    common.end = "http://localhost:8040";

    //全局页面跳转地址，用于部署IIS
    common.openurl = "/hnvmns-frontweb";

    //后端api地址
    common.api = "http://localhost:8080";


    //模拟的WMS参数配置，放到全局变量里是考虑重复使用
    common.wmsDefaultOption = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: '',
        maxFeatures: '100',
        outputFormat: 'application/json'
    };

    common.wmsUrl = "/geoserver/cite/ows?";

    common.head =     ["<div id=\"sui_nav\" class=\"sui-nav horizontal\">",
        "    <div class=\"sui-nav-wrapper nav-border nav-line\">",
        "        <div class=\"pull-left nav-header\">",
        "            <img src=\""+common.openurl+"/common/asset/img/logo.png\" alt=\"华南光电\">",
        "            智能可视化监管系统",
        "        </div>",
        "        <ul>",
        "            <li><a class=\"\" href=\""+common.openurl+"/index/views/index.html\"></span>&nbsp;主页</a></li>",
        "            <li><a class=\"\"  href=\""+common.openurl+"/core/view/core.html\"><span class=\"glyphicon glyphicon-fire\"></span>&nbsp;一张图</a></li>",
        "            <li><a href=\""+common.openurl+"/depot/view/index.html\"><span class=\"glyphicon glyphicon-plane\"></span>驾驶舱</a>",
        "                <ul>",
        "                    <li><a href=\"#\"><span class=\"glyphicon glyphicon-edit\"></span> editor</a></li>",
        "                    <li><a href=\"#\"><span class=\"glyphicon glyphicon-pencil\"></span> pencil</a></li>",
        "                    <li><a href=\"#\"><span class=\"glyphicon glyphicon-saved\"></span> Level23</a>",
        "                        <span class=\"indicator\">&gt;</span>",
        "                        <ul>",
        "                            <li><a href=\"#\">Level31</a></li>",
        "                            <li><a href=\"#\">Level32</a></li>",
        "                            <li><a href=\"#\">Level33</a>",
        "                                <ul>",
        "                                    <li><a href=\"#\">Level331</a></li>",
        "                                    <li><a href=\"#\">333 is hide</a></li>",
        "                                    <li class=\"hide-in-horizontal\"><a href=\"#\">Level333</a></li>",
        "                                    <li><a href=\"#\">Level334</a></li>",
        "                                </ul>",
        "                                <span class=\"indicator\">&gt;</span>",
        "                            </li>",
        "                            <li><a href=\"#\">Level34</a></li>",
        "                        </ul>",
        "                    </li>",
        "                    <li><a href=\"#\"><span class=\"glyphicon glyphicon-save\"></span> Level24</a></li>",
        "                </ul>",
        "            </li>",
        "        </ul>",
        "        <ul class=\"pull-right\">",
        "            <li><a class=\"glyphicon glyphicon-home\"></a>",
        "                <ul>",
        "                    <li><a>Right</a></li>",
        "                    <li><a>Right</a>",
        "                        <ul>",
        "                            <li><a>Right</a></li>",
        "                            <li><a>Right</a></li>",
        "                            <li><a>Right</a></li>",
        "                        </ul>",
        "                    </li>",
        "                    <li><a>Others</a></li>",
        "                </ul></li>",
        "            <li><a class=\"glyphicon glyphicon-user\">&nbsp;关于</a>",
        "                <ul>",
        "                    <li><a>Right</a></li>",
        "                    <li><a>Right</a>",
        "                        <ul>",
        "                            <li><a>Right</a></li>",
        "                            <li><a>Right</a></li>",
        "                            <li><a>Right</a></li>",
        "                        </ul>",
        "                    </li>",
        "                    <li><a>Others</a></li>",
        "                </ul>",
        "            </li>",
        "        </ul>",
        "    </div>",
        "</div>"].join("");
    // href=\""+common.openurl+"/index/views/index.html\"



    common.dashboard = [
        {
            // onclick="window.location.href='/GIS-Front/test-panel/view/panel.html';"
            id: 'panel1',   // 面板编号
            colWidth: '4',  // 栅格尺寸
            content:'          <div class="panel-heading">\n' +
            '            <div class="title">业务看板</div>\n' +
            '            <div class="panel-actions">\n' +
            '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '          <div class="panel-body">\n' +
            '                        <div class="big notes-thumb" data-page="random-page" id="open-panel">\n' +
            '                <span class="fa fa-folder-open-o fa-2x pull-left dashboard-icon-position"></span>\n' +
            '                <p>业务看板</p>\n' +
            '            </div>\n' +
            '          </div>'
        },
        {
            id: 'panel2',   // 面板编号
            colWidth: '4',  // 栅格尺寸
            content:'          <div class="panel-heading">\n' +
            '            <div class="title">配置中心</div>\n' +
            '            <div class="panel-actions">\n' +
            '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '          <div class="panel-body">\n' +
            '                        <div class="small lock-thumb">\n' +
            '                <span class="fa fa-bug fa-2x dashboard-icon-position" ></span><p class="dashboard-icon-little-title">问题处理</p>\n' +
            '            </div>\n' +
            '            <div class="small last cpanel-thumb" data-page="random-page">\n' +
            '                <span class="fa fa-cog fa-2x dashboard-icon-position"></span><p class="dashboard-icon-little-title">设置中心</p>\n' +
            '            </div>\n' +
                '             <div class="small lock-thumb">\n' +
            '                <span class="fa fa-bug fa-2x dashboard-icon-position" ></span><p class="dashboard-icon-little-title">问题处理</p>\n' +
            '            </div>\n' +
            '            <div class="small last cpanel-thumb" data-page="random-page">\n' +
            '                <span class="fa fa-cog fa-2x dashboard-icon-position"></span><p class="dashboard-icon-little-title">设置中心</p>\n' +
            '            </div>\n'+
            '          </div>'
        },
        {
            id: 'panel3',   // 面板编号
            colWidth: '4',  // 栅格尺寸
            content:'          <div class="panel-heading">\n' +
            '            <div class="title">运维中心</div>\n' +
            '            <div class="panel-actions">\n' +
            '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '          <div class="panel-body">\n' +
            '            <div class="big organizer-thumb" data-page="random-page"><span class="fa fa-camera-retro fa-2x pull-left dashboard-icon-position"></span><p>运维中心</p></div>\n' +
            '          </div>'
        },
        {
            id: 'panel4',   // 面板编号
            colWidth: '4',  // 栅格尺寸
            content:'          <div class="panel-heading">\n' +
            '            <div class="title">一张图</div>\n' +
            '            <div class="panel-actions">\n' +
            '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '          <div class="panel-body">\n' +
            '                        <div class="big photos-thumb" data-page="random-page" id="open-map">\n' +
            '                <span class="fa fa-map fa-2x pull-left dashboard-icon-position"></span><p>一张图</p>\n' +
            '            </div>\n\n' +
            '          </div>'
        },
        {
            id: 'panel5',   // 面板编号
            colWidth: '4',  // 栅格尺寸
            content:'          <div class="panel-heading">\n' +
            '            <div class="title">环境监测</div>\n' +
            '            <div class="panel-actions">\n' +
            '              <button type="button" class="btn remove-panel" data-toggle="tooltip" title="" data-original-title="移除面板"><i class="icon-remove"></i></button>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '          <div class="panel-body">\n' +
            '            <div class="big games-thumb" data-page="random-page" id="open-environment">\n' +
            '                <span class="fa fa-cloud fa-2x pull-left dashboard-icon-position"></span><p>环境监测</p>\n' +
            '            </div>\n' +
            '          </div>'
        }
    ];

    common.indoorJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "1",
                "properties": {
                    "id": "1",
                    "name":"1楼",
                    "level":"1"
                },
                "attributes": {
                    "OBJECTID": 5,
                    "name": "1楼",
                    "SHAPE_Length": 0.0082493936841283571,
                    "SHAPE_Area": 3.3120227185362001e-006
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09741593600006,
                                28.24427505500006
                            ],
                            [
                                113.10044846700009,
                                28.244278615000042
                            ],
                            [
                                113.10044974900006,
                                28.243186452000032
                            ],
                            [
                                113.09741721800003,
                                28.24318289200005
                            ],
                            [
                                113.09741593600006,
                                28.24427505500006
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "2",
                "properties": {
                    "id": "2",
                    "name":"2楼",
                    "level":"2"
                },
                "attributes": {
                    "OBJECTID": 6,
                    "name": "2楼",
                    "SHAPE_Length": 0.0048492491108494103,
                    "SHAPE_Area": 1.4552431480670601e-006
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09741593600006,
                                28.24427505500006
                            ],
                            [
                                113.09874366100007,
                                28.244276614000057
                            ],
                            [
                                113.09875437200003,
                                28.243184462000045
                            ],
                            [
                                113.09741721800003,
                                28.24318289200005
                            ],
                            [
                                113.09741675300006,
                                28.243579077000049
                            ],
                            [
                                113.09741593600006,
                                28.24427505500006
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "3",
                "properties": {
                    "id": "3",
                    "name":"2楼",
                    "level":"2"
                },
                "attributes": {
                    "OBJECTID": 8,
                    "name": "2楼",
                    "SHAPE_Length": 0.0054072842180556916,
                    "SHAPE_Area": 1.7533637681550281e-006
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09883287800005,
                                28.244276718000037
                            ],
                            [
                                113.10045679700011,
                                28.244266117000052
                            ],
                            [
                                113.10044974900006,
                                28.243186452000032
                            ],
                            [
                                113.09882582900002,
                                28.243197053000074
                            ],
                            [
                                113.09883287800005,
                                28.244276718000037
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "4",
                "properties": {
                    "id": "4",
                    "name":"3楼",
                    "level":"3"
                },
                "attributes": {
                    "OBJECTID": 9,
                    "name": "3楼",
                    "SHAPE_Length": 0.0082493936841286156,
                    "SHAPE_Area": 3.3120229235300953e-006
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09741593600006,
                                28.24427505500006
                            ],
                            [
                                113.10044846700009,
                                28.244278615000042
                            ],
                            [
                                113.10044974900006,
                                28.243186452000032
                            ],
                            [
                                113.09741721800003,
                                28.24318289200005
                            ],
                            [
                                113.09741660600002,
                                28.243703948000075
                            ],
                            [
                                113.09741593600006,
                                28.24427505500006
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "5",
                "properties": {
                    "id": "5",
                    "name":"3楼",
                    "level":"3"
                },
                "attributes": {
                    "OBJECTID": 14,
                    "name": "3楼",
                    "SHAPE_Length": 0.0027164594850912194,
                    "SHAPE_Area": 3.1029974992726667e-007
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09754085700001,
                                28.24413228800006
                            ],
                            [
                                113.09826540300003,
                                28.244146564000062
                            ],
                            [
                                113.09753728800001,
                                28.243275682000046
                            ],
                            [
                                113.09754085700001,
                                28.24413228800006
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "6",
                "properties": {
                    "id": "6",
                    "name":"3楼",
                    "level":"3"
                },
                "attributes": {
                    "OBJECTID": 15,
                    "name": "3楼",
                    "SHAPE_Length": 0.0025465450056082126,
                    "SHAPE_Area": 2.6820935504097149e-007
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09831894100012,
                                28.24412871800007
                            ],
                            [
                                113.09832251000012,
                                28.243264974000056
                            ],
                            [
                                113.09770147100005,
                                28.243264974000056
                            ],
                            [
                                113.09831894100012,
                                28.24412871800007
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "7",
                "properties": {
                    "id": "7",
                    "name":"3楼",
                    "level":"3"
                },
                "attributes": {
                    "OBJECTID": 16,
                    "name": "3楼",
                    "SHAPE_Length": 0.0033308018342374981,
                    "SHAPE_Area": 6.9288089914557471e-007
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.09846170900005,
                                28.244107303000078
                            ],
                            [
                                113.09926120800003,
                                28.244118011000069
                            ],
                            [
                                113.09928619200002,
                                28.243257836000055
                            ],
                            [
                                113.09844743200006,
                                28.243275682000046
                            ],
                            [
                                113.09846170900005,
                                28.244107303000078
                            ]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "8",
                "properties": {
                    "id": "8",
                    "name":"3楼",
                    "level":"3"
                },
                "attributes": {
                    "OBJECTID": 17,
                    "name": "3楼",
                    "SHAPE_Length": 0.0038022624959498947,
                    "SHAPE_Area": 9.0191118204367864e-007
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                113.0993611450001,
                                28.244157272000052
                            ],
                            [
                                113.10032839600001,
                                28.244150134000051
                            ],
                            [
                                113.10036765700011,
                                28.243225713000072
                            ],
                            [
                                113.09937542200009,
                                28.243239990000063
                            ],
                            [
                                113.0993611450001,
                                28.244157272000052
                            ]
                        ]
                    ]
                }
            }
        ]
    };



    return common;
});